#!/usr/bin/env node
/**
 * Run this after adding new photos to public/images/ (case studies, logos,
 * hero/about photos, etc). It resizes anything larger than MAX_DIMENSION
 * on its long edge and recompresses JPG/PNG in place, so nothing you
 * upload from a phone or a Figma export ends up shipping a multi-megabyte
 * file to visitors.
 *
 * Usage:
 *   npm run optimize-images
 */
import sharp from "sharp";
import { glob } from "glob";
import path from "path";
import fs from "fs";

const MAX_DIMENSION = 2000; // px, long edge
const JPEG_QUALITY = 82;
const PNG_QUALITY = 82;

const IMAGES_ROOT = path.join(process.cwd(), "public", "images");

async function optimizeOne(file) {
  const before = fs.statSync(file).size;
  const ext = path.extname(file).toLowerCase();
  const buffer = fs.readFileSync(file);

  let pipeline = sharp(buffer).resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: "inside",
    withoutEnlargement: true,
  });

  if (ext === ".png") {
    pipeline = pipeline.png({ quality: PNG_QUALITY, compressionLevel: 9 });
  } else {
    // .jpg / .jpeg
    pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
  }

  const output = await pipeline.toBuffer();

  // Only overwrite if we actually made it smaller -- some already-tiny
  // logos won't benefit and re-encoding could nudge them up slightly.
  if (output.length < before) {
    fs.writeFileSync(file, output);
    const after = output.length;
    const pct = (100 * (1 - after / before)).toFixed(0);
    console.log(
      `${path.relative(IMAGES_ROOT, file)}: ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB (-${pct}%)`
    );
  } else {
    console.log(`${path.relative(IMAGES_ROOT, file)}: already optimized, skipped`);
  }
}

async function main() {
  const files = await glob("**/*.{png,jpg,jpeg}", {
    cwd: IMAGES_ROOT,
    absolute: true,
  });

  if (files.length === 0) {
    console.log("No images found under public/images.");
    return;
  }

  console.log(`Optimizing ${files.length} image(s)...\n`);
  for (const file of files) {
    await optimizeOne(file);
  }
  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
