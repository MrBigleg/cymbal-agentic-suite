import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Theme Tokens and CSS Utilities in globals.css', () => {
  it('should define the signature asymmetric corner tokens and color palette in globals.css', () => {
    const cssPath = path.resolve(__dirname, '../../app/globals.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    expect(cssContent).toContain('.cymbal-box-lg');
    expect(cssContent).toContain('.cymbal-box-md');
    expect(cssContent).toContain('.cymbal-btn-primary');
    expect(cssContent).toContain('.cymbal-tag');
    expect(cssContent).toContain('.cymbal-stamp');
    expect(cssContent).toContain('#060913'); // Canvas
    expect(cssContent).toContain('#0c1222'); // Surface
  });
});
