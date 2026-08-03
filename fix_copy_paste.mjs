import fs from 'fs';

const filesToUpdate = [
  'D:\\BGVPlatform - Copy\\Frontend\\src\\components\\candidate\\login\\LoginForm.jsx',
  'D:\\BGVPlatform - Copy\\Frontend\\src\\components\\clientAdmin\\login\\LoginForm.jsx',
  'D:\\BGVPlatform - Copy\\Frontend\\src\\components\\hr\\login\\LoginForm.jsx',
  'D:\\BGVPlatform - Copy\\Frontend\\src\\components\\superAdmin\\login\\LoginForm.jsx',
  'D:\\BGVPlatform - Copy\\Frontend\\src\\components\\vendor\\login\\VendorLoginForm.jsx'
];

filesToUpdate.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Undo the mistake on Email field
  const undoSearch = `onKeyDown={handleKeyDown}
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}`;
  
  if (content.includes(undoSearch)) {
    content = content.replace(undoSearch, 'onKeyDown={handleKeyDown}');
  }

  // Apply to Password field specifically
  const passSearch = 'type={showPassword ? "text" : "password"}';
  const passReplace = `type={showPassword ? "text" : "password"}
            onCopy={(e) => e.preventDefault()}
            onPaste={(e) => e.preventDefault()}
            onCut={(e) => e.preventDefault()}`;
  
  if (content.includes(passSearch) && !content.includes(passReplace)) {
    content = content.replace(passSearch, passReplace);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed ${filePath}`);
});
