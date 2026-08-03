import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'D:\\BGVPlatform - Copy\\Frontend\\src\\components\\candidate\\login\\LoginForm.jsx',
  'D:\\BGVPlatform - Copy\\Frontend\\src\\components\\clientAdmin\\login\\LoginForm.jsx',
  'D:\\BGVPlatform - Copy\\Frontend\\src\\components\\hr\\login\\LoginForm.jsx',
  'D:\\BGVPlatform - Copy\\Frontend\\src\\components\\superAdmin\\login\\LoginForm.jsx',
  'D:\\BGVPlatform - Copy\\Frontend\\src\\components\\vendor\\login\\VendorLoginForm.jsx'
];

filesToUpdate.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  // We are looking for the password input block which looks like:
  /*
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 rounded-md px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
  */

  if (content.includes('onCopy={(e) => e.preventDefault()}')) {
    console.log(`Already updated: ${filePath}`);
    return;
  }

  // Find the exact line: onKeyDown={handleKeyDown}
  // and insert the copy/paste preventions right after it
  const searchStr = 'onKeyDown={handleKeyDown}';
  const replaceStr = `onKeyDown={handleKeyDown}
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}`;

  content = content.replace(searchStr, replaceStr);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
});
