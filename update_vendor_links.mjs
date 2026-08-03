import fs from 'fs';
import path from 'path';

const pagesDir = 'd:\\BGVPlatform - Copy\\Frontend\\src\\pages\\vendor';

const filesToUpdate = [
  { name: 'AssignedApplications.jsx', type: 'Assigned', icon: 'Edit' },
  { name: 'UnverifiedApplications.jsx', type: 'Unverified', icon: 'Edit' },
  { name: 'VerifiedApplications.jsx', type: 'Verified', icon: 'Eye' },
  { name: 'RefuteApplications.jsx', type: 'Refute', icon: 'Eye' }
];

filesToUpdate.forEach(fileObj => {
  const filePath = path.join(pagesDir, fileObj.name);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix imports
  if (!content.includes('useNavigate')) {
    content = content.replace('import { Link } from "react-router-dom";', 'import { Link, useNavigate } from "react-router-dom";');
  }

  // Add useNavigate to component
  const componentName = fileObj.name.replace('.jsx', '');
  if (!content.includes('const navigate = useNavigate();')) {
    content = content.replace(`function ${componentName}() {`, `function ${componentName}() {\n  const navigate = useNavigate();`);
  }

  // Replace button logic
  const mode = (fileObj.type === 'Assigned' || fileObj.type === 'Unverified') ? 'edit' : 'view';

  // We already added Link in the previous step, so we need to replace the Link block.
  // Or we can just replace the whole td
  const regex = /<td className="px-6 py-4 text-gray-400 text-center">[\s\S]*?<\/[A-Za-z]+>[\s\S]*?<\/td>/;
  const newTd = `<td className="px-6 py-4 text-gray-400">
                    <button 
                      className="p-1 hover:bg-gray-200 rounded transition inline-flex justify-center items-center"
                      onClick={() => {
                        const mode = "${mode}";
                        if (row.caseType.includes("Employment Verification")) {
                          navigate(\`/vendor/employment-details?mode=\${mode}\`);
                        } else if (row.caseType.includes("Address Verification")) {
                          navigate(\`/vendor/address-details?mode=\${mode}\`);
                        } else if (row.caseType.includes("Drug Test")) {
                          navigate(\`/vendor/drug-test-details?mode=\${mode}\`);
                        } else if (row.caseType.includes("Education Verification")) {
                          navigate(\`/vendor/education-details?mode=\${mode}\`);
                        } else if (row.caseType.includes("Criminal Check")) {
                          navigate(\`/vendor/criminal-details?mode=\${mode}\`);
                        }
                      }}
                    >
                      <${fileObj.icon} size={18} />
                    </button>
                  </td>`;

  content = content.replace(regex, newTd);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${fileObj.name}`);
});
