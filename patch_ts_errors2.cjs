const fs = require('fs');

if (fs.existsSync('src/lib/fairEngine.test.ts')) {
  let test1 = fs.readFileSync('src/lib/fairEngine.test.ts', 'utf-8');
  test1 = test1.replace(/stage: [^,]+,/g, "");
  test1 = test1.replace(/subscribersCount: (\d+)/g, "subscribersCount: '$1'");
  fs.writeFileSync('src/lib/fairEngine.test.ts', test1);
}

if (fs.existsSync('src/services/archiveSyncService.test.ts')) {
  let test2 = fs.readFileSync('src/services/archiveSyncService.test.ts', 'utf-8');
  test2 = test2.replace(/stage: [^,]+,/g, "");
  test2 = test2.replace(/impactSummary: \{[^}]+\}/g, "");
  fs.writeFileSync('src/services/archiveSyncService.test.ts', test2);
}
