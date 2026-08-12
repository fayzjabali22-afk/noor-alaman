const fs = require('fs');
let pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
pkg.scripts.test = "vitest run";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2), 'utf-8');
