import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { AssetManifestSchema } from '../../src/data/schema';

describe('Asset Manifest & Resource Integrity', () => {
  const manifestPath = path.resolve('public/asset-manifest.json');

  it('asset-manifest.json exists and adheres to Zod schema', () => {
    expect(fs.existsSync(manifestPath)).toBe(true);
    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const parsed = AssetManifestSchema.safeParse(content);
    expect(parsed.success).toBe(true);
  });

  it('all declared assets exist on disk and meet budget thresholds', () => {
    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const parsed = AssetManifestSchema.parse(content);

    let criticalSum = 0;

    for (const asset of parsed.assets) {
      const fullPath = path.join(path.resolve('public'), asset.filePath);
      expect(fs.existsSync(fullPath)).toBe(true);

      const sizeKb = fs.statSync(fullPath).size / 1024;
      expect(sizeKb).toBeLessThanOrEqual(asset.maxCompressedSizeKb);

      if (asset.loadingTier === 'Tier A (Critical)') {
        criticalSum += sizeKb;
      }
    }

    // Critical Tier A must be well under 5.0 MB (5,000 KB)
    expect(criticalSum).toBeLessThan(5000);
    expect(criticalSum).toBeLessThan(parsed.totalCriticalBudgetKb);
  });
});

