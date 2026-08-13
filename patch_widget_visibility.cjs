const fs = require('fs');
let content = fs.readFileSync('src/components/HomeScreenView.tsx', 'utf-8');

const target = `            {/* Quiet Impact Widget (Zero UI Bloat) */}
            {analytics.totalActions > 0 && (
              <div className="w-full max-w-2xl mx-auto mt-2">`;

const replacement = `            {/* Quiet Impact Widget (Zero UI Bloat) */}
            <div className="w-full max-w-2xl mx-auto mt-2">`;

content = content.replace(target, replacement);

const target2 = `                </button>
              </div>
            )}`;

const replacement2 = `                </button>
              </div>`;

content = content.replace(target2, replacement2);
fs.writeFileSync('src/components/HomeScreenView.tsx', content);
