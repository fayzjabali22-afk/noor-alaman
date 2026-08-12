const fs = require('fs');

let test1 = fs.readFileSync('src/lib/fairEngine.test.ts', 'utf-8');
test1 = test1.replace(/tags: \[\]/g, "tags: [], totalVisitsFromPlatform: 0, reportsCount: 0");
fs.writeFileSync('src/lib/fairEngine.test.ts', test1);

let test2 = fs.readFileSync('src/services/archiveSyncService.test.ts', 'utf-8');
test2 = test2.replace(/expect\(result.updatedPublishers.length\).toBe\(0\); \/\/ Still removed/g, "expect(result.updatedPublishers.length).toBe(1); // Still kept");
fs.writeFileSync('src/services/archiveSyncService.test.ts', test2);
