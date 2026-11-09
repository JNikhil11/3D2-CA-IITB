import fs from 'node:fs';
import path from 'node:path';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, reorder, quantize, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';

await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder,
});

export async function optimizeModel(inputPath, outputPath) {
  console.log(`Optimizing ${path.basename(inputPath)}...`);
  const initialSize = fs.statSync(inputPath).size;
  const document = await io.read(inputPath);

  await document.transform(
    dedup(),
    weld({ tolerance: 0.0001 }),
    reorder({ encoder: MeshoptEncoder, target: 'performance' }),
    quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }),
    meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
    prune()
  );

  await io.write(outputPath, document);
  const finalSize = fs.statSync(outputPath).size;
  const savings = (((initialSize - finalSize) / initialSize) * 100).toFixed(1);
  console.log(`Optimized ${path.basename(outputPath)}: ${(initialSize / 1024).toFixed(1)} KB -> ${(finalSize / 1024).toFixed(1)} KB (${savings}% savings)`);
}

async function main() {
  const modelsDir = path.resolve('public/assets/models');
  const files = fs.readdirSync(modelsDir).filter(f => f.endsWith('.glb'));

  for (const file of files) {
    const fullPath = path.join(modelsDir, file);
    await optimizeModel(fullPath, fullPath);
  }
  console.log('All models optimized successfully with meshopt and quantize!');
}

main().catch(err => {
  console.error('Optimization failed:', err);
  process.exit(1);
});

