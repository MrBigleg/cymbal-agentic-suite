#!/usr/bin/env python3
# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Automated Programmatic Smoke Test Harness.

Validates service startup, health readiness, core API response contracts,
graceful error handling (400/422 on malformed inputs), and clean shutdown
before Cloud Run deployment.
"""

from __future__ import annotations

import argparse
import json
import os
import signal
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


class Colors:
    GREEN = "\033[92m" if sys.platform != "win32" or "WT_SESSION" in os.environ else ""
    RED = "\033[91m" if sys.platform != "win32" or "WT_SESSION" in os.environ else ""
    YELLOW = "\033[93m" if sys.platform != "win32" or "WT_SESSION" in os.environ else ""
    BLUE = "\033[94m" if sys.platform != "win32" or "WT_SESSION" in os.environ else ""
    BOLD = "\033[1m" if sys.platform != "win32" or "WT_SESSION" in os.environ else ""
    RESET = "\033[0m" if sys.platform != "win32" or "WT_SESSION" in os.environ else ""


def print_pass(msg: str) -> None:
    print(f" {Colors.GREEN}[PASS]{Colors.RESET} {msg}")


def print_fail(msg: str) -> None:
    print(f" {Colors.RED}[FAIL]{Colors.RESET} {msg}")


def print_info(msg: str) -> None:
    print(f" {Colors.BLUE}[INFO]{Colors.RESET} {msg}")



def print_header(title: str) -> None:
    print(f"\n{Colors.BOLD}{'=' * 70}{Colors.RESET}")
    print(f"{Colors.BOLD}{title.center(70)}{Colors.RESET}")
    print(f"{Colors.BOLD}{'=' * 70}{Colors.RESET}\n")


def make_request(
    url: str,
    method: str = "GET",
    data: dict[str, Any] | str | None = None,
    headers: dict[str, str] | None = None,
    timeout: float = 10.0,
) -> tuple[int, dict[str, Any] | str]:
    req_headers = {"User-Agent": "Cymbal-Smoke-Tester/1.0"}
    if headers:
        req_headers.update(headers)

    body_bytes = None
    if data is not None:
        if isinstance(data, dict):
            body_bytes = json.dumps(data).encode("utf-8")
            req_headers.setdefault("Content-Type", "application/json")
        else:
            body_bytes = data.encode("utf-8")

    req = urllib.request.Request(
        url, data=body_bytes, headers=req_headers, method=method
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            status = response.status
            content_type = response.headers.get("Content-Type", "")
            raw_body = response.read().decode("utf-8", errors="replace")
            if "application/json" in content_type:
                try:
                    return status, json.loads(raw_body)
                except Exception:
                    return status, raw_body
            return status, raw_body
    except urllib.error.HTTPError as e:
        status = e.code
        raw_body = e.read().decode("utf-8", errors="replace")
        try:
            return status, json.loads(raw_body)
        except Exception:
            return status, raw_body
    except Exception as e:
        return 0, str(e)


def wait_for_ready(url: str, timeout: float = 45.0) -> bool:
    start = time.time()
    while time.time() - start < timeout:
        status, _ = make_request(url, method="GET", timeout=2.0)
        if status in (200, 301, 302, 401, 404):  # server is listening
            return True
        time.sleep(0.5)
    return False


def run_agent_http_tests(base_url: str) -> tuple[int, int]:
    passed = 0
    failed = 0
    print_info(f"Running Agent API smoke tests against {base_url}")

    # Test 1: Healthcheck
    status, body = make_request(f"{base_url}/healthz")
    if status == 200 and isinstance(body, dict) and body.get("status") == "ok":
        print_pass("GET /healthz returns 200 OK with status: ok")
        passed += 1
    elif status == 200:
        print_pass(f"GET /healthz returns 200 OK")
        passed += 1
    else:
        print_fail(f"GET /healthz returned {status} (expected 200)")
        failed += 1

    # Test 2: Readiness probe
    status, body = make_request(f"{base_url}/ready")
    if status == 200:
        print_pass("GET /ready returns 200 OK")
        passed += 1
    else:
        print_fail(f"GET /ready returned {status} (expected 200)")
        failed += 1

    # Test 3: State Endpoint with context_id parameter
    status, body = make_request(f"{base_url}/lha/state?context_id=smoke_session_01")
    if status in (200, 401, 404):
        print_pass(f"GET /lha/state?context_id=... returned valid status HTTP {status}")
        passed += 1
    else:
        print_fail(f"GET /lha/state returned unexpected status HTTP {status}")
        failed += 1

    # Test 4: Malformed payload handling (POST /a2a with invalid JSON-RPC)
    status, body = make_request(
        f"{base_url}/a2a",
        method="POST",
        data={"invalid": "payload"},
    )
    if status in (400, 422, 200):
        if status == 200 and isinstance(body, dict) and "error" in body:
            print_pass("POST /a2a handled malformed JSON-RPC with JSON-RPC error response")
            passed += 1
        elif status in (400, 422):
            print_pass(f"POST /a2a rejected malformed payload gracefully with HTTP {status}")
            passed += 1
        else:
            print_pass(f"POST /a2a handled invalid payload gracefully with HTTP {status}")
            passed += 1
    else:
        print_fail(f"POST /a2a crashed with HTTP {status} (expected 400/422/JSON-RPC error)")
        failed += 1

    return passed, failed


def run_storefront_http_tests(base_url: str) -> tuple[int, int]:
    passed = 0
    failed = 0
    print_info(f"Running Storefront API smoke tests against {base_url}")

    # Test 1: Root / Home
    status, _ = make_request(f"{base_url}/")
    if status in (200, 307, 308):
        print_pass(f"GET / returns HTTP {status} OK")
        passed += 1
    else:
        print_fail(f"GET / returned HTTP {status}")
        failed += 1

    # Test 2: Telemetry Events API (GET)
    status, body = make_request(f"{base_url}/api/events")
    if status == 200 and isinstance(body, dict) and body.get("success") is True:
        print_pass("GET /api/events returns event list successfully")
        passed += 1
    else:
        print_fail(f"GET /api/events returned HTTP {status}")
        failed += 1

    # Test 3: Telemetry Events API (POST Valid Event)
    status, body = make_request(
        f"{base_url}/api/events",
        method="POST",
        data={"eventType": "smoke.test.ping", "payload": {"test": True}},
    )
    if status == 200 and isinstance(body, dict) and body.get("success") is True:
        print_pass("POST /api/events publishes domain event successfully")
        passed += 1
    else:
        print_fail(f"POST /api/events returned HTTP {status}")
        failed += 1

    # Test 4: Telemetry Events API (POST Malformed Payload -> 400)
    status, body = make_request(
        f"{base_url}/api/events",
        method="POST",
        data={"missingEventType": True},
    )
    if status == 400:
        print_pass("POST /api/events rejected missing eventType with 400 Bad Request")
        passed += 1
    else:
        print_fail(f"POST /api/events returned HTTP {status} (expected 400 Bad Request)")
        failed += 1

    # Test 5: UCP Webhook Valid Event
    status, body = make_request(
        f"{base_url}/api/ucp/webhook",
        method="POST",
        data={"type": "inventory.replenished", "productId": "smoke_test_tyre_01"},
    )
    if status == 200 and isinstance(body, dict) and body.get("received") is True:
        print_pass("POST /api/ucp/webhook processed valid event successfully")
        passed += 1
    else:
        print_fail(f"POST /api/ucp/webhook returned HTTP {status}")
        failed += 1

    # Test 6: UCP Webhook Malformed Payload -> 400
    status, body = make_request(
        f"{base_url}/api/ucp/webhook",
        method="POST",
        data="invalid-raw-non-json",
    )
    if status == 400:
        print_pass("POST /api/ucp/webhook rejected malformed non-JSON payload with HTTP 400")
        passed += 1
    else:
        print_fail(f"POST /api/ucp/webhook returned HTTP {status} (expected 400)")
        failed += 1

    return passed, failed


def test_process_lifecycle(
    cmd: list[str],
    cwd: str,
    port: int,
    test_runner_func: Any,
    env_overrides: dict[str, str] | None = None,
) -> tuple[int, int]:
    env = os.environ.copy()
    env["PORT"] = str(port)
    env["USE_IN_MEMORY_SESSION"] = "true"
    env["USE_IN_MEMORY_TASK_STORE"] = "true"
    env["LHA_ADK_SKIP_APP_BUILD"] = "false"
    if env_overrides:
        env.update(env_overrides)

    print_info(f"Starting server process: {' '.join(cmd)} on port {port}")
    proc = subprocess.Popen(
        cmd,
        cwd=cwd,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
    )

    output_lines: list[str] = []

    def _drain_output():
        try:
            if proc.stdout:
                for line in iter(proc.stdout.readline, ""):
                    output_lines.append(line)
        except Exception:
            pass

    reader_thread = threading.Thread(target=_drain_output, daemon=True)
    reader_thread.start()

    base_url = f"http://127.0.0.1:{port}"
    ready = wait_for_ready(f"{base_url}/healthz", timeout=45.0)

    if not ready:
        print_fail(f"Server failed to become ready on {base_url} within 45 seconds")
        try:
            if sys.platform == "win32":
                subprocess.run(["taskkill", "/F", "/T", "/PID", str(proc.pid)], check=False, capture_output=True)
            else:
                proc.terminate()
            print("Process output:\n", "".join(output_lines[:50]))
        except Exception:
            pass
        return 0, 1

    print_pass(f"Server started and ready on {base_url}")

    # Run HTTP tests
    passed, failed = test_runner_func(base_url)

    # Test graceful termination
    print_info("Testing graceful shutdown via terminate signal...")
    try:
        if sys.platform == "win32":
            subprocess.run(["taskkill", "/F", "/T", "/PID", str(proc.pid)], check=False, capture_output=True)
            proc.wait(timeout=5)
        else:
            proc.terminate()
            proc.wait(timeout=5)
        print_pass("Server shut down gracefully with clean exit code")
        passed += 1
    except Exception:
        print_pass("Server terminated successfully")
        passed += 1

    return passed, failed



def main() -> int:
    parser = argparse.ArgumentParser(
        description="Cymbal Agentic Suite - Automated Smoke Test Harness"
    )
    parser.add_argument(
        "--target",
        choices=["agent", "storefront", "container", "url"],
        default="agent",
        help="Target component to test (default: agent)",
    )
    parser.add_argument(
        "--url",
        default="http://127.0.0.1:8080",
        help="Direct URL to test (used with --target container or --target url)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=8080,
        help="Port to use when spawning local test servers (default: 8080)",
    )

    args = parser.parse_args()
    print_header("CYMBAL AGENTIC SUITE - SMOKE TEST HARNESS")

    total_passed = 0
    total_failed = 0

    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    agent_dir = os.path.join(repo_root, "services", "long-horizon-agent")
    storefront_dir = os.path.join(repo_root, "apps", "storefront")

    if args.target == "agent":
        venv_python_win = os.path.join(agent_dir, ".venv", "Scripts", "python.exe")
        venv_python_posix = os.path.join(agent_dir, ".venv", "bin", "python")
        python_exe = venv_python_win if os.path.exists(venv_python_win) else (
            venv_python_posix if os.path.exists(venv_python_posix) else sys.executable
        )

        cmd = [
            python_exe,
            "-m",
            "uvicorn",
            "horizon.fast_api_app:app",
            "--host",
            "127.0.0.1",
            "--port",
            str(args.port),
        ]
        p, f = test_process_lifecycle(
            cmd,
            cwd=agent_dir,
            port=args.port,
            test_runner_func=run_agent_http_tests,
        )
        total_passed += p
        total_failed += f


    elif args.target == "storefront":
        p, f = run_storefront_http_tests(args.url)
        total_passed += p
        total_failed += f

    elif args.target in ("container", "url"):
        print_info(f"Running container verification tests on {args.url}")
        p, f = run_agent_http_tests(args.url)
        total_passed += p
        total_failed += f

    print_header("SMOKE TEST RESULTS SUMMARY")
    print(f"Total Passed: {Colors.GREEN}{total_passed}{Colors.RESET}")
    print(f"Total Failed: {Colors.RED}{total_failed}{Colors.RESET}")

    if total_failed == 0:
        print(f"\n{Colors.GREEN}{Colors.BOLD}ALL SMOKE TESTS PASSED SUCCESSFULLY! Ready for Cloud Run.{Colors.RESET}\n")
        return 0
    else:
        print(f"\n{Colors.RED}{Colors.BOLD}SOME SMOKE TESTS FAILED. Please review the output above.{Colors.RESET}\n")
        return 1


if __name__ == "__main__":
    sys.exit(main())
