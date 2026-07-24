/**
 * fetch-assets.mjs
 * -----------------------------------------------------------------------------
 * Downloads the original photos/logo from the WordPress site into
 * src/assets/img/, replacing the placeholder images committed to the repo.
 *
 * Run once (Node 18+):   npm run fetch-assets
 *
 * The repo ships with branded placeholders so it builds and previews without
 * this step. Run this when you want the real imagery, then rebuild.
 * If you later move the media elsewhere, just edit BASE / the map below.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

const BASE =
  "https://epbzvyzw.elementor.cloud/wp-content/uploads/2025/11/";

// local filename (under src/assets/img)  ->  remote file (relative to BASE)
const MAP = {
  "logo.png": "OPAF-Logo.png",
  "favicon.png": "OPAF-Logo.png",

  "role-end-user.webp":
    "small-vecteezy_aerial-view-of-a-large-industrial-chemical-plant-operating_50784345_small.webp",
  "role-system-integrator.webp":
    "small-vecteezy_it-technician-troubleshooting-server-issues-in-data-center_66526437_small.webp",
  "role-solution-provider.webp":
    "small-vecteezy_engineers-collaborating-at-industrial-site-with-storage_67897253_small.webp",
  "role-hardware-supplier.webp":
    "small-vecteezy_close-up-view-of-a-computer-microchip-on-a-circuit-board_69069503_small.webp",
  "role-software-supplier.webp":
    "small-vecteezy_professional-coder-working-on-multiple-screens-at-a-modern_70256249_small.webp",
  "role-service-provider.webp":
    "small-vecteezy_technician-in-orange-jumpsuit-analyzes-data-on-digital_72597103_small.webp",

  "about-mission.webp":
    "medium-vecteezy_team-collaborating-on-data-analysis-in-a-modern-office-at-night_71427457_medium.webp",
  "about-end-users.webp":
    "small-vecteezy_aerial-view-of-a-large-industrial-chemical-plant-operating_50784345_small.webp",
  "about-system-integrators.webp":
    "small-vecteezy_it-technician-troubleshooting-server-issues-in-data-center_66526437_small.webp",
  "about-vendors.webp":
    "small-vecteezy_close-up-view-of-a-computer-microchip-on-a-circuit-board_69069503_small.webp",
  "about-standards.webp":
    "small-vecteezy_a-group-of-people-working-on-laptops-in-an-office_70161431_small.webp",
};

const OUT = "src/assets/img/";
let ok = 0;
let failed = 0;

for (const [local, remote] of Object.entries(MAP)) {
  const url = BASE + remote;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    const dest = OUT + local;
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, buf);
    console.log(`✓ ${local}  (${(buf.length / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (err) {
    console.warn(`✗ ${local}  ← ${url}\n    ${err.message}`);
    failed++;
  }
}

console.log(`\nDone: ${ok} downloaded, ${failed} failed.`);
if (failed) {
  console.log(
    "Failed items keep their placeholder image. Check the URL still exists, or update BASE/MAP."
  );
}
