# 🛒 Cymbal Tyres Storefront & Manager Portal

This package contains the Next.js 15 customer retail shop, vehicle registration lookup, A2UI notification cards, and corporate manager incident investigation portal.

---

## 📂 Key Directories & Pages

- **`app/page.tsx`**: Customer tyre shopping home page (size & vehicle reg search).
- **`app/checkout/`**: UCP-driven checkout process with fitting bay scheduling.
- **`app/demo-controls/`**: Hackathon evaluation control center to simulate cart stalling, inventory replenishment, and customer survey events.
- **`app/manager/`**: Multi-location regional manager operations dashboard.
- **`app/manager/incidents/[id]/`**: Deep-dive incident dossier linking Places Insights benchmarks, BigQuery anomaly alerts, and immutable audit logs.
- **`app/api/a2a/`**: Inbound A2A JSON-RPC 2.0 endpoint.
- **`app/api/gchat/webhook/`**: Google Chat webhook handling in-place interactive card updates.

---

## 🛠️ Local Development

```bash
# Run storefront locally on port 3000
pnpm --filter @cymbal/storefront dev
```
