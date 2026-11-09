import { z } from 'zod';

export const HotspotSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  position: z.tuple([z.number(), z.number(), z.number()]),
  inspectionOffset: z.tuple([z.number(), z.number(), z.number()]),
  lookAtOffset: z.tuple([z.number(), z.number(), z.number()]),
  technicalSpec: z.record(z.string(), z.string()).optional(),
  actionLabel: z.string().default('Inspect Assembly'),
});

export const QuadrantSchema = z.object({
  id: z.enum(['robotics', 'aerospace', 'cognitive', 'sustainability']),
  title: z.string(),
  subtitle: z.string(),
  shortDescription: z.string(),
  detailedDescription: z.string(),
  focusArea: z.string(),
  officialCategoryUrl: z.string().url(),
  keyMetrics: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ),
  accentColor: z.string(),
});

export const WorldContentSchema = z.object({
  id: z.string(),
  index: z.number().int().min(0).max(4),
  title: z.string(),
  romanNumeral: z.string(),
  tagline: z.string(),
  editorialQuote: z.string(),
  narrativeBody: z.string(),
  scrollRange: z.tuple([z.number(), z.number()]),
  heroFocus: z.string(),
  atmosphericTone: z.string(),
  lightingColor: z.string(),
  fogDensity: z.number(),
  hotspots: z.array(HotspotSchema),
  quadrants: z.array(QuadrantSchema).optional(),
});

export const AssetManifestEntrySchema = z.object({
  id: z.string(),
  filePath: z.string(),
  loadingTier: z.enum(['Tier A (Critical)', 'Tier B (Next)', 'Tier C (Deferred)']),
  maxCompressedSizeKb: z.number(),
  maxTriangles: z.number(),
  sha256: z.string().optional(),
  license: z.string(),
});

export const AssetManifestSchema = z.object({
  manifestVersion: z.string(),
  totalCriticalBudgetKb: z.number(),
  assets: z.array(AssetManifestEntrySchema),
});

export type Hotspot = z.infer<typeof HotspotSchema>;
export type Quadrant = z.infer<typeof QuadrantSchema>;
export type WorldContent = z.infer<typeof WorldContentSchema>;
export type AssetManifestEntry = z.infer<typeof AssetManifestEntrySchema>;
export type AssetManifest = z.infer<typeof AssetManifestSchema>;

