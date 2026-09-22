const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'views');
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.tsx')) continue;
  const p = path.join(dir, f);
  let c = fs.readFileSync(p, 'utf8');
  if (!c.startsWith("'use client'")) {
    fs.writeFileSync(p, "'use client';\n\n" + c);
    console.log('fixed', f);
  }
}
