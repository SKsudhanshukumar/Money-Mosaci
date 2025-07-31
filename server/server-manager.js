#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const commands = {
  start: startServer,
  stop: stopServer,
  restart: restartServer,
  status: checkStatus,
  kill: killAllNode
};

async function startServer() {
  console.log('🚀 Starting server...');
  try {
    const child = exec('node index.js', { cwd: process.cwd() });
    
    child.stdout.on('data', (data) => {
      console.log(data.toString());
    });
    
    child.stderr.on('data', (data) => {
      console.error(data.toString());
    });
    
    child.on('close', (code) => {
      console.log(`Server process exited with code ${code}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
  }
}

async function stopServer() {
  console.log('🛑 Stopping server...');
  try {
    if (process.platform === 'win32') {
      await execAsync('taskkill /IM node.exe /F');
    } else {
      await execAsync('pkill -f "node index.js"');
    }
    console.log('✅ Server stopped');
  } catch (error) {
    console.log('ℹ️  No server processes found or already stopped');
  }
}

async function restartServer() {
  await stopServer();
  setTimeout(startServer, 1000);
}

async function checkStatus() {
  console.log('📊 Checking server status...');
  try {
    if (process.platform === 'win32') {
      const { stdout } = await execAsync('netstat -ano | findstr :9000');
      if (stdout.trim()) {
        console.log('✅ Server is running on port 9000');
        console.log(stdout);
      } else {
        console.log('❌ No server found on port 9000');
      }
    } else {
      const { stdout } = await execAsync('lsof -i :9000');
      if (stdout.trim()) {
        console.log('✅ Server is running on port 9000');
        console.log(stdout);
      } else {
        console.log('❌ No server found on port 9000');
      }
    }
  } catch (error) {
    console.log('❌ No server found on port 9000');
  }
}

async function killAllNode() {
  console.log('💀 Killing all Node.js processes...');
  try {
    if (process.platform === 'win32') {
      await execAsync('taskkill /IM node.exe /F');
    } else {
      await execAsync('pkill node');
    }
    console.log('✅ All Node.js processes terminated');
  } catch (error) {
    console.log('ℹ️  No Node.js processes found');
  }
}

function showHelp() {
  console.log(`
🔧 Server Manager

Usage: node server-manager.js <command>

Commands:
  start    - Start the server
  stop     - Stop the server gracefully
  restart  - Restart the server
  status   - Check if server is running
  kill     - Kill all Node.js processes (use with caution)
  help     - Show this help message

Examples:
  node server-manager.js start
  node server-manager.js status
  node server-manager.js restart
`);
}

// Main execution
const command = process.argv[2];

if (!command || command === 'help') {
  showHelp();
} else if (commands[command]) {
  commands[command]();
} else {
  console.error(`❌ Unknown command: ${command}`);
  showHelp();
  process.exit(1);
}