const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'src');

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'app') files = walk(full, files);
    else if (entry.isFile() && entry.name.endsWith('.tsx')) files.push(full);
  }
  return files;
}

const skip = new Set([
  path.normalize('src/App.tsx'),
  path.normalize('src/main.tsx'),
]);

for (const file of walk(srcDir)) {
  const rel = path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/');
  if (skip.has('src/' + rel.split('/').slice(-2).join('/')) || rel.endsWith('App.tsx') || rel.endsWith('main.tsx')) continue;

  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('react-router-dom')) continue;

  if (!content.startsWith("'use client'") && !content.startsWith('"use client"')) {
    content = "'use client';\n\n" + content;
  }

  content = content.replace(/import \{ Link \} from 'react-router-dom';/g, "import Link from 'next/link';");
  content = content.replace(/import \{ Link, useNavigate \} from 'react-router-dom';/g, "import Link from 'next/link';\nimport { useRouter } from 'next/navigation';");
  content = content.replace(/import \{ Link, useLocation, useNavigate \} from 'react-router-dom';/g, "import Link from 'next/link';\nimport { useRouter } from 'next/navigation';\nimport { usePathname } from 'next/navigation';");
  content = content.replace(/import \{ Link, Navigate \} from 'react-router-dom';/g, "import Link from 'next/link';\nimport { useRouter } from 'next/navigation';");
  content = content.replace(/import \{ Link, useParams \} from 'react-router-dom';/g, "import Link from 'next/link';\nimport { useParams } from 'next/navigation';");
  content = content.replace(/import \{ Link, useNavigate, useParams \} from 'react-router-dom';/g, "import Link from 'next/link';\nimport { useParams, useRouter } from 'next/navigation';");
  content = content.replace(/import \{ Link, useSearchParams, useNavigate \} from 'react-router-dom';/g, "import Link from 'next/link';\nimport { useRouter, useSearchParams } from 'next/navigation';");
  content = content.replace(/import \{ Link, useLocation \} from 'react-router-dom';/g, "import Link from 'next/link';");
  content = content.replace(/import \{ useLocation, useNavigate \} from 'react-router-dom';/g, "import { usePathname, useRouter } from 'next/navigation';");
  content = content.replace(/import \{ useNavigate \} from 'react-router-dom';/g, "import { useRouter } from 'next/navigation';");
  content = content.replace(/import \{ useLocation \} from 'react-router-dom';/g, "import { consumeNavState } from '@/lib/nav-state';");
  content = content.replace(/import \{ useParams \} from 'react-router-dom';/g, "import { useParams } from 'next/navigation';");
  content = content.replace(/import \{ Link, NavLink, Outlet(?:, useNavigate)? \} from 'react-router-dom';/g, '');

  content = content.replace(/\bto="/g, 'href="');
  content = content.replace(/\bto=\{/g, 'href={');
  content = content.replace(/\bto={`/g, 'href={`');
  content = content.replace(/const navigate = useNavigate\(\);/g, 'const router = useRouter();');
  content = content.replace(/\bnavigate\(/g, 'router.push(');
  content = content.replace(/router\.push\(([^,]+), \{ replace: true \}\)/g, 'router.replace($1)');
  content = content.replace(/router\.push\(([^,]+), \{ replace: true, state: [^}]+\}\)/g, 'router.replace($1)');

  content = content.replace(/const location = useLocation\(\);[\s\S]*?const from = \(location\.state[\s\S]*?\) \|\| '([^']+)';/g,
    "const navState = consumeNavState<{ from?: string; reservaPrefill?: { destinoId: number; numeroDias?: number } }>() || {};\n  const from = navState.from || '$1';");
  content = content.replace(/const reservaPrefill = \(location\.state[\s\S]*?\)\?\.reservaPrefill;/g,
    'const reservaPrefill = navState.reservaPrefill;');

  content = content.replace(/const \{ id \} = useParams\(\);/g, 'const params = useParams();\n  const id = params.id as string | undefined;');
  content = content.replace(/const \{ id \} = useParams\(\);\s*const guiaId = Number\(id\);/g, 'const params = useParams();\n  const guiaId = Number(params.id);');
  content = content.replace(/location\.pathname/g, 'usePathname()');

  content = content.replace(/<Link([^>]*?) state=\{[^}]+\}/g, '<Link$1');
  content = content.replace(/return <Navigate to="([^"]+)" replace \/>;/g, 'router.replace("$1"); return null;');

  fs.writeFileSync(file, content);
  console.log('Updated', rel);
}

console.log('Done');
