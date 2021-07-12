const fs = require('fs');
const { exec } = require('child_process');

if (fs.existsSync(process.cwd() + '/dist')) {
  exec('node dist/index.js --postinstall');
}
