const fs = require('fs');

async function check() {
  const seed = fs.readFileSync('prisma/seed.ts', 'utf8');
  const hero = fs.readFileSync('src/components/home/HeroCollage.tsx', 'utf8');
  const regex = /https:\/\/images\.unsplash\.com\/photo-[^"'`\s\?]+/g;
  const urls = Array.from(new Set([
    ...Array.from(seed.matchAll(regex), m => m[0]),
    ...Array.from(hero.matchAll(regex), m => m[0])
  ]));

  console.log('Checking', urls.length, 'Unsplash image URLs...');
  const broken = [];

  for (const u of urls) {
    try {
      const res = await fetch(u + '?auto=format&fit=crop&w=300&q=80', { method: 'HEAD' });
      if (!res.ok) {
        console.log('BROKEN (' + res.status + '):', u);
        broken.push(u);
      }
    } catch (err) {
      console.log('FETCH FAILED:', u, err.message);
      broken.push(u);
    }
  }

  console.log('Audit complete. Total broken:', broken.length);
  if (broken.length > 0) {
    console.log('Broken list:', JSON.stringify(broken, null, 2));
  }
}

check();
