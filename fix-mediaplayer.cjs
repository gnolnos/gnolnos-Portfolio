const fs = require('fs');
const path = '/root/.openclaw/workspace/gnolnos-Portfolio/src/App.jsx';

let content = fs.readFileSync(path, 'utf8');

// 1. Ensure MediaPlayer signature already has jellyfinApiKey (done via edit); just in case, add it
content = content.replace(
  /const MediaPlayer = \(\{ type, src, poster \}\) => {/,
  'const MediaPlayer = ({ type, src, poster, jellyfinApiKey }) => {'
);

// 2. Replace data.personalInfo.socials.jellyfin?.apiKey with jellyfinApiKey inside MediaPlayer
content = content.replace(
  /data\.personalInfo\.socials\.jellyfin\?\.apiKey/g,
  'jellyfinApiKey'
);
content = content.replace(
  /data\.personalInfo\.socials\.jellyfin\.apiKey/g,
  'jellyfinApiKey'
);

// 3. Add jellyfinApiKey prop to MediaPlayer calls
// For the multi-line block, match pattern from <MediaPlayer to /> on multiple lines
content = content.replace(
  /(\s*<MediaPlayer\s*\n\s*type=\{item\.mediaType \|\| 'audio'\}[^\n]*\n\s*src=\{item\.fileUrl\}\s*\n\s*poster=\{item\.image\}[^\n]*\n\s*\/>)/,
  `$1\n                      jellyfinApiKey={data.personalInfo.socials.jellyfin?.apiKey}`
);
// But simpler: insert after the poster line in that block
content = content.replace(
  /(\s+poster=\{item\.image\}[^\n]*\n)(\s+\/>)/,
  `$1                      jellyfinApiKey={data.personalInfo.socials.jellyfin?.apiKey}\n$2`
);

// For single-line
content = content.replace(
  /<MediaPlayer type="video" src=\{item\.fileUrl\} poster=\{item\.image\} \/>/,
  '<MediaPlayer type="video" src={item.fileUrl} poster={item.image} jellyfinApiKey={data.personalInfo.socials.jellyfin?.apiKey} />'
);

// 4. Add loading="lazy" to iframe and video tags
content = content.replace(
  /<iframe([^>]*?)>/g,
  '<iframe$1 loading="lazy">'
);
content = content.replace(
  /<video([^>]*?)>/g,
  '<video$1 loading="lazy">'
);

// 5. Remove commented-out import: //import { useForm, ValidationError } from '@formspree/react';
content = content.replace(
  /\/\/import \{ useForm, ValidationError \} from '@formspree\/react';/,
  ''
);

fs.writeFileSync(path, content, 'utf8');
console.log('Applied MediaPlayer fixes and lazy loading.');