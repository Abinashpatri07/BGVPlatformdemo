const fs = require('fs');
const path = require('path');
function processDir(dirPath, depth) {
  for (const file of fs.readdirSync(dirPath)) {
    const full = path.join(dirPath, file);
    if (fs.statSync(full).isDirectory()) {
      processDir(full, depth + 1);
    } else if (full.endsWith('.jsx')) {
      let content = fs.readFileSync(full, 'utf8');
      if (content.includes('import axios from "axios";')) {
        let rel = '';
        for (let i = 0; i < depth; i++) rel += '../';
        rel += 'API/axiosInstance';
        content = content.replace('import axios from "axios";', 'import axiosInstance from "' + rel + '";');
        content = content.replace(/axios\.(get|post|put|patch|delete)/g, 'axiosInstance.$1');
        fs.writeFileSync(full, content);
        console.log('Fixed: ' + full);
      }
    }
  }
}
processDir('src/pages/clientAdmin', 2);
processDir('src/components/clientAdmin', 3);
console.log('Success');
