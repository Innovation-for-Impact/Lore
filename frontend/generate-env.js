const os = require('os');
const fs = require('fs');
const path = require('path');

const nets = os.networkInterfaces();
let localIp = '127.0.0.1';

for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      localIp = net.address;
      break;
    }
  }
}

const envContent = `EXPO_PUBLIC_HOST_IP=${localIp}\n`;
fs.writeFileSync(path.resolve(__dirname, '.env'), envContent);
console.log(`.env file created with EXPO_PUBLIC_HOST_IP=${localIp}`);
