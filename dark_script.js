const fs = require('fs');
const path = require('path');

const replacements = [
  ['bg-white', 'bg-white dark:bg-zinc-950'],
  ['bg-zinc-50', 'bg-zinc-50 dark:bg-zinc-900'],
  ['bg-zinc-50/50', 'bg-zinc-50/50 dark:bg-zinc-900/50'],
  ['text-zinc-950', 'text-zinc-950 dark:text-zinc-50'],
  ['text-zinc-900', 'text-zinc-900 dark:text-zinc-100'],
  ['text-zinc-700', 'text-zinc-700 dark:text-zinc-300'],
  ['text-zinc-600', 'text-zinc-600 dark:text-zinc-400'],
  ['text-zinc-500', 'text-zinc-500 dark:text-zinc-400'],
  ['border-zinc-200', 'border-zinc-200 dark:border-zinc-800'],
  ['border-zinc-100', 'border-zinc-100 dark:border-zinc-800/50'],
  ['bg-zinc-100', 'bg-zinc-100 dark:bg-zinc-800'],
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      for (const [find, replace] of replacements) {
        const regex = new RegExp(`(?<!dark:)\\b${find}\\b(?![/\\w])`, 'g');
        content = content.replace(regex, replace);
      }
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

processDir('e:/Website/Portfolio/DARKWATCH/darkwatch-web/app/dashboard');
console.log('Applied dark classes to app/dashboard');
