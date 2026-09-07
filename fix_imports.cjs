const fs = require('fs');
const path = require('path');

function fixDir(dirPath) {
  for (const file of fs.readdirSync(dirPath)) {
    const full = path.join(dirPath, file);
    if (fs.statSync(full).isDirectory()) {
      fixDir(full);
    } else if (full.endsWith('.jsx')) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;
      if (content.includes('../../../../API/axiosInstance')) {
        content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/API\/axiosInstance/g, '../../../API/axiosInstance');
        changed = true;
      }
      if (content.includes('from "../../../API/axiosInstance"')) {
        // Wait, files in src/components/clientAdmin/candidate/ are depth 3 from src.
        // src/components(1)/clientAdmin(2)/candidate(3)/View.jsx -> to get to src: ../../../
        // So for candidate/ and hr/ and login/, the correct path IS ../../../API/axiosInstance!
        // Because:
        // View.jsx -> ../ (to candidate) -> ../ (to clientAdmin) -> ../ (to components) -> ../ (to src) => 4 ../s!
        // Let's count:
        // View.jsx is in src/components/clientAdmin/candidate/
        // `..` from View.jsx goes to `candidate`? NO!
        // `..` from `src/components/clientAdmin/candidate/View.jsx` goes to `src/components/clientAdmin/candidate`? NO.
        // In node or webpack, `../` from a file goes to its parent directory!
        // So from `View.jsx`:
        // `../` -> `src/components/clientAdmin/candidate`
        // `../../` -> `src/components/clientAdmin`
        // `../../../` -> `src/components`
        // `../../../../` -> `src`
        // `../../../../../` -> `BGVPlatformdemo`
        // Therefore, to get to `src/API/axiosInstance.js` from `src/components/clientAdmin/candidate/View.jsx`, we need `../../../../API/axiosInstance`? NO.
        // Wait, from `View.jsx`:
        // `../` is `candidate/`
        // `../../` is `clientAdmin/`
        // `../../../` is `components/`
        // `../../../../` is `src/`
        // So `../../../../API/axiosInstance` IS `src/API/axiosInstance`!
        
        // Wait! The Vite error said:
        // Failed to resolve import "../../../../API/axiosInstance" from "src/components/clientAdmin/hr/HRForm.jsx". Does the file exist?
        // Let's count for HRForm.jsx:
        // file is in src/components/clientAdmin/hr/
        // `../` -> clientAdmin/
        // `../../` -> components/
        // `../../../` -> src/
        // `../../../../` -> root/ (Frontend/BGVPlatformdemo/)
        // Ah! `../` from a file in `hr/` goes to `clientAdmin/`!
        // `hr/` is NOT a file, it's a directory. The file is IN `hr/`.
        // So `../` from `HRForm.jsx` = `clientAdmin/`.
        // `../../` from `HRForm.jsx` = `components/`.
        // `../../../` from `HRForm.jsx` = `src/`.
        // So `../../../API/axiosInstance` is `src/API/axiosInstance`!!
        
        // My script earlier calculated depth=4, generating `../../../../API/axiosInstance`.
        // I need to replace `../../../../API/axiosInstance` with `../../../API/axiosInstance`.
        // And `../../../API/axiosInstance` (if it exists directly in clientAdmin/) with `../../API/axiosInstance`.
        
        // Let's just blindly replace `../../../../API/axiosInstance` with `../../../API/axiosInstance` globally in the file content.
      }
      
      content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/API\/axiosInstance/g, '../../../API/axiosInstance');
      
      // Let's also check depth=2 files (e.g. if I have files directly in src/components/clientAdmin/)
      // Wait, there are none, but just in case, I should just fix `../../../../API/axiosInstance` first.
      
      if (content !== fs.readFileSync(full, 'utf8')) {
        fs.writeFileSync(full, content);
        console.log('Fixed path in: ' + full);
      }
    }
  }
}
fixDir('src/components/clientAdmin');
console.log('Done');
