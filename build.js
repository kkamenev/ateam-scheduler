
const childProcess = require('child_process');

console.log(`Running 'npm install' for client app`)
childProcess.execSync('npm i', {cwd: './client'});

console.log(`Running build for React app`)
childProcess.execSync('npm run build', {cwd: './client'});

console.log('Running build for NestJS app')
childProcess.execSync('npm run build:nest', {cwd: '.'});
