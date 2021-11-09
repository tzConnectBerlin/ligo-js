const fs = require('fs');
const { exec } = require('child_process');

if (fs.existsSync(process.cwd() + '/dist')) {
  console.info(`ℹ️  Running postinstall scripts... Trying to install LIGO`);
  exec('node dist/index.js --postinstall');
}
