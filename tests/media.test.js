import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Buffer } from 'node:buffer';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { optimizeImage } from '../admin/server/media.js';

// Noise keeps the PNG large, like a real screenshot
const png = (width, height) => sharp(crypto.randomBytes(width * height * 3), { raw: { width, height, channels: 3 } }).png().toBuffer();

test('large PNG becomes a smaller, resized WebP', async () => {
  const data = await png(3000, 1500);
  const out = await optimizeImage(data, 'shots/big.png');
  assert.equal(out.rel, 'shots/big.webp');
  assert.ok(out.data.length < data.length);
  assert.equal((await sharp(out.data).metadata()).width, 2400);
});

test('small images and non-PNG/JPEG files pass through', async () => {
  const small = await png(64, 64);
  assert.deepEqual(await optimizeImage(small, 'icon.png'), { data: small, rel: 'icon.png' });
  const gif = Buffer.from('GIF89a');
  assert.deepEqual(await optimizeImage(gif, 'anim.gif'), { data: gif, rel: 'anim.gif' });
});
