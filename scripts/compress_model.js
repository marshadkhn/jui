const fs = require('fs');
const path = require('path');
const { NodeIO } = require('@gltf-transform/core');
const { KHRDracoMeshCompression, KHRMaterialsTransmission, KHRMaterialsEmissiveStrength } = require('@gltf-transform/extensions');
const { simplify, weld, resample, prune, dedup } = require('@gltf-transform/functions');
const draco3d = require('draco3dgltf');
const MeshoptSimplifier = require('meshoptimizer').MeshoptSimplifier;

async function compress() {
  console.log('Starting GLB model compression...');
  const workspaceRoot = path.join(__dirname, '..');
  const inputPath = path.join(workspaceRoot, 'public/final_models/Note_printer.glb');
  const outputPath = path.join(workspaceRoot, 'public/final_models/Note_printer.glb');
  const backupPath = path.join(workspaceRoot, 'public/final_models/Note_printer_original.glb');

  if (!fs.existsSync(backupPath)) {
    console.log('Creating backup of original model...');
    fs.copyFileSync(inputPath, backupPath);
  }

  const io = new NodeIO()
    .registerExtensions([KHRDracoMeshCompression, KHRMaterialsTransmission, KHRMaterialsEmissiveStrength])
    .registerDependencies({
      'draco3d.decoder': await draco3d.createDecoderModule(),
      'draco3d.encoder': await draco3d.createEncoderModule(),
    });

  console.log('Reading GLB document...');
  const doc = await io.read(backupPath);

  console.log('Applying optimizations (weld, dedup, simplify, prune)...');
  await MeshoptSimplifier.ready;

  await doc.transform(
    weld({ tolerance: 0.0001 }),
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.05, error: 0.001 }),
    resample(),
    dedup(),
    prune()
  );

  console.log('Writing compressed GLB document...');
  await io.write(outputPath, doc);
  
  const oldSize = fs.statSync(backupPath).size / 1024 / 1024;
  const newSize = fs.statSync(outputPath).size / 1024 / 1024;
  console.log(`Compression complete! Size reduced from ${oldSize.toFixed(2)} MB -> ${newSize.toFixed(2)} MB`);
}

compress().catch(err => {
  console.error('Compression failed:', err);
  process.exit(1);
});
