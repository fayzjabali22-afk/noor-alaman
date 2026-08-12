const fs = require('fs');

let file = fs.readFileSync('src/lib/fairEngine.test.ts', 'utf-8');
file = file.replace(/calculatePublisherFairScore\(pub, supporterActions, defaultFairEngineWeights\)/g, "calculatePublisherFairScore({...pub, totalVisitsFromPlatform: 50}, defaultFairEngineWeights)");
file = file.replace(/calculatePublisherFairScore\(unverifiedPub, \[\], defaultFairEngineWeights\)/g, "calculatePublisherFairScore(unverifiedPub, defaultFairEngineWeights)");
file = file.replace(/calculatePublisherFairScore\(goldPub, \[\], defaultFairEngineWeights\)/g, "calculatePublisherFairScore(goldPub, defaultFairEngineWeights)");
file = file.replace(/calculatePublisherFairScore\(platinumPub, \[\], defaultFairEngineWeights\)/g, "calculatePublisherFairScore(platinumPub, defaultFairEngineWeights)");

fs.writeFileSync('src/lib/fairEngine.test.ts', file);
