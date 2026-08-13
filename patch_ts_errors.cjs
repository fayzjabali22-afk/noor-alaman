const fs = require('fs');

// 1. Fix useSupporterActions.ts
let hook = fs.readFileSync('src/hooks/useSupporterActions.ts', 'utf-8');
hook = hook.replace(
  /eventBus\.emit\('CORE_FAIR_ENGINE', \{\s*action: 'supporter_action_recorded',\s*payload: \{ publisherId: action\.publisherId \}\s*\}\);/,
  "eventBus.publish('PUBLISHER_VISITED', { publisherId: action.publisherId });"
);
fs.writeFileSync('src/hooks/useSupporterActions.ts', hook);

// 2. Fix fairEngine.test.ts
if (fs.existsSync('src/lib/fairEngine.test.ts')) {
  let test1 = fs.readFileSync('src/lib/fairEngine.test.ts', 'utf-8');
  test1 = test1.replace(/'SUPPORT'/g, "'HUMANITARIAN_AID'");
  test1 = test1.replace(/subscribersCount: 50000/g, "subscribersCount: '50000'");
  test1 = test1.replace(/subscribersCount: 200/g, "subscribersCount: '200'");
  test1 = test1.replace(/subscribersCount: 15000/g, "subscribersCount: '15000'");
  test1 = test1.replace(/subscribersCount: 3000/g, "subscribersCount: '3000'");
  test1 = test1.replace(/subscribersCount: 120000/g, "subscribersCount: '120000'");
  fs.writeFileSync('src/lib/fairEngine.test.ts', test1);
}

// 3. Fix archiveSyncService.test.ts
if (fs.existsSync('src/services/archiveSyncService.test.ts')) {
  let test2 = fs.readFileSync('src/services/archiveSyncService.test.ts', 'utf-8');
  test2 = test2.replace(/'SUPPORT'/g, "'HUMANITARIAN_AID'");
  test2 = test2.replace(/'MEDICAL'/g, "'RELIEF_AND_MEDICAL'");
  
  test2 = test2.replace(/expect\(result\.migratedCount\)\.toBe/g, "expect(result.newArchive.length).toBe");
  
  test2 = test2.replace(/impactSummary: \{\s*totalSponsorships: 0\s*\}/g, "status: 'GRADUATED'");
  
  fs.writeFileSync('src/services/archiveSyncService.test.ts', test2);
}

