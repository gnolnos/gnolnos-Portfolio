const fs = require('fs');
const path = '/root/.openclaw/workspace/gnolnos-Portfolio/src/App.jsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove commented-out formspree import
content = content.replace(
  /\/\/import \{ useForm, ValidationError \} from '@formspree\/react';[\r\n]+/,
  ''
);

// 2. Improve avatar alt text: change alt="Portrait" to alt={\`Portrait of \${data.personalInfo.fullName}\`}
content = content.replace(
  /<img src=\{data\.personalInfo\.avatarUrl\} alt="Portrait" className="w-full h-full object-cover"\/>/,
  `<img src={data.personalInfo.avatarUrl} alt={\`Portrait of \${data.personalInfo.fullName}\`} className="w-full h-full object-cover" />`
);

// 3. Ensure the "Custom Icons" comment is properly placed after imports, before ZaloIcon. Already there, but we removed comment before it; so we need to reintroduce the comment line? Actually the code had:
// // --- Custom Icons ---
// That line is after the commented import we removed. After removal, we might have a blank line then // --- Custom Icons ---. That's fine.
// Also ensure there's no duplicate comments.

fs.writeFileSync(path, content, 'utf8');
console.log('Final cleanup: removed commented import, improved avatar alt.');