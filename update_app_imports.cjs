const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const importsToLazy = [
  'HomeScreenView',
  'CorePlatformView',
  'JasmineSectorView',
  'DalalSectorView',
  'RaedaSectorView',
  'PublisherPortalView',
  'SupporterPortalView',
  'AdminPortalView',
  'AnalyticsView',
  'HybridImpactView',
  'ErrorDictionaryExplorer'
];

importsToLazy.forEach(component => {
  const importRegex = new RegExp(`import \\{ ${component} \\} from '\\.\/components\/${component}';`);
  code = code.replace(importRegex, `const ${component} = React.lazy(() => import('./components/${component}').then(module => ({ default: module.${component} })));`);
});

// Since the components are named exports, we use `.then(module => ({ default: module.${component} }))`

fs.writeFileSync('src/App.tsx', code, 'utf-8');
