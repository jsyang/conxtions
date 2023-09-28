const fs = require('fs');
const child_process = require('child_process');

const ENV = fs.readFileSync('.env').toString().trim();

`
rm -rf dist
mkdir -p dist/lib
cp *.mjs dist
cp *.html dist
cp lib/* dist/lib
${ENV} npx wrangler pages deploy dist --project-name conx --commit-dirty=true
`.split('\n').map(r=>r.trim()).filter(Boolean).forEach(cmd => {
    try {
        child_process.execSync(cmd);
    } catch(e) {
        console.error(cmd);
        console.log(e.stdout.toString());
        console.log(e.stderr.toString());
    }
});
