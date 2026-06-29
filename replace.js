import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Convert double quoted URLs to backticks
  content = content.replace(/"(https:\/\/bgvplatform-backend\.onrender\.com)([^"]*)"/g, (match, host, rest) => {
    return '`${import.meta.env.VITE_API_URL}' + rest + '`';
  });

  // 2. Convert single quoted URLs to backticks
  content = content.replace(/'(https:\/\/bgvplatform-backend\.onrender\.com)([^']*)'/g, (match, host, rest) => {
    return '`${import.meta.env.VITE_API_URL}' + rest + '`';
  });

  // 3. For any remaining URLs already in backticks, just replace the host
  content = content.replace(/https:\/\/bgvplatform-backend\.onrender\.com/g, '${import.meta.env.VITE_API_URL}');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      processFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
