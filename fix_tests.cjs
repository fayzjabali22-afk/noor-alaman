const fs = require('fs');

let fairEngineTest = fs.readFileSync('src/lib/fairEngine.test.ts', 'utf-8');
fairEngineTest = fairEngineTest.replace(/calculateFairScore/g, 'calculatePublisherFairScore');
fs.writeFileSync('src/lib/fairEngine.test.ts', fairEngineTest);

let archiveSyncTest = fs.readFileSync('src/services/archiveSyncService.test.ts', 'utf-8');
archiveSyncTest = archiveSyncTest.replace(/originalPublisherId/g, 'publisherId');
archiveSyncTest = archiveSyncTest.replace(/platform: 'YouTube',/g, "platform: 'YouTube', avatar: '', totalOutboundVisitsAchieved: 0, sustainabilitySource: '',");
archiveSyncTest = archiveSyncTest.replace(/channelUrl: '',/g, "externalUrl: '',");
fs.writeFileSync('src/services/archiveSyncService.test.ts', archiveSyncTest);

