const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /bg-\[#F5F7FF\]/g, replace: 'bg-theme-bg' },
  { regex: /bg-\[#EEF1FF\]/g, replace: 'bg-theme-surface-soft' },
  { regex: /border-\[#E4E8FF\]/g, replace: 'border-theme-border' },
  { regex: /border-\[#E8EBFF\]/g, replace: 'border-theme-border' },
  { regex: /text-\[#02027A\]/g, replace: 'text-theme-primary' },
  { regex: /text-\[#01026E\]/g, replace: 'text-theme-primary' },
  { regex: /text-\[#2B3674\]/g, replace: 'text-theme-text' },
  { regex: /bg-\[#02027A\]/g, replace: 'bg-theme-primary' },
  { regex: /bg-\[#01026E\]/g, replace: 'bg-theme-primary' },
  { regex: /hover:bg-\[#01016a\]/g, replace: 'hover:bg-theme-primary-hover' },
  { regex: /hover:bg-\[#02038a\]/g, replace: 'hover:bg-theme-primary-hover' },
  { regex: /hover:bg-\[#00005E\]/g, replace: 'hover:bg-theme-primary-hover' },
];

function processDir(dirPath) {
  for (const file of fs.readdirSync(dirPath)) {
    const full = path.join(dirPath, file);
    if (fs.statSync(full).isDirectory()) {
      processDir(full);
    } else if (full.endsWith('.jsx')) {
      let content = fs.readFileSync(full, 'utf8');
      let original = content;
      for (const { regex, replace } of replacements) {
        content = content.replace(regex, replace);
      }
      if (content !== original) {
        fs.writeFileSync(full, content);
        console.log('Refactored colors in: ' + full);
      }
    }
  }
}

processDir('src/pages/clientAdmin');
processDir('src/components/clientAdmin');
console.log('Done refactoring colors.');
