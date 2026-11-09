import fs from 'node:fs';
import path from 'node:path';
import { AssetManifestSchema } from '../src/data/schema';

function verifyManifest() {
  console.log('Verifying asset manifest against Zod schema and disk files...');
  const manifestPath = path.resolve('public/asset-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found at ${manifestPath}`);
  }

  const rawJson = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const parsed = AssetManifestSchema.parse(rawJson);

  let totalCriticalKb = 0;

  for (const asset of parsed.assets) {
    const fullPath = path.join(path.resolve('public'), asset.filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Asset file missing on disk: ${asset.filePath} (expected at ${fullPath})`);
    }

    const stat = fs.statSync(fullPath);
    const sizeKb = stat.size / 1024;

    if (sizeKb > asset.maxCompressedSizeKb) {
      throw new Error(`Asset ${asset.id} exceeds budget! Actual: ${sizeKb.toFixed(1)} KB, Max: ${asset.maxCompressedSizeKb} KB`);
    }

    if (asset.loadingTier === 'Tier A (Critical)') {
      totalCriticalKb += sizeKb;
    }

    console.log(`✓ [${asset.loadingTier}] ${asset.id}: ${sizeKb.toFixed(1)} KB (budget: ${asset.maxCompressedSizeKb} KB)`);
  }

  console.log(`\nTotal Tier A Critical Assets: ${totalCriticalKb.toFixed(1)} KB (Hard Budget: ${parsed.totalCriticalBudgetKb} KB)`);
  if (totalCriticalKb > parsed.totalCriticalBudgetKb) {
    throw new Error(`Tier A payload exceeds 5.0 MB budget! Total: ${totalCriticalKb.toFixed(1)} KB`);
  }

  console.log('✓ Manifest verification passed with 100% compliance!\n');
}

verifyManifest();

