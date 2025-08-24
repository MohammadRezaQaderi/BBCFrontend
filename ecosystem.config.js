module.exports = {
  apps: [{
    name: 'react-app',
    script: 'npm',
    args: 'start',
    cwd: '/home/mrq/Dev/SefroYek/bbc/BBCFrontend',
    interpreter: 'none',
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      BROWSER: 'none' // optional: prevents auto-opening browser
    },
    autorestart: true,
    watch: true, // set to true if you want pm2 to restart on file changes
    max_memory_restart: '1G', // restart if memory exceeds 1GB
    instances: 1,
    exec_mode: 'fork'
  }]
};