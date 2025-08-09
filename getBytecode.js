#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

function parseArgs() {
  const args = process.argv.slice(2);
  const flags = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    const value = args[i + 1];
    flags[key] = value;
  }
  return flags;
}

(async () => {
  try {
    // ✅ Check if Foundry is installed, install if missing
    try {
      execSync('forge --version', { stdio: 'ignore' });
    } catch {
      console.log('📦 Foundry not detected. Installing...');
      try {
        execSync('curl -L https://foundry.paradigm.xyz | bash', { stdio: 'inherit' });
        execSync('foundryup', { stdio: 'inherit' });
        console.log('✅ Foundry installed successfully.');
      } catch (installErr) {
        console.error('❌ Failed to install Foundry automatically. Please install manually.');
        process.exit(1);
      }
    }

    const flags = parseArgs();

    // 📁 Get contract directory
    const contractDir = flags.dir || await ask('📁 Enter the contract directory (e.g., src): ');
    if (!fs.existsSync(contractDir)) {
      console.error('❌ Directory does not exist.');
      process.exit(1);
    }

    // 📄 Get Solidity filename
    const contractFile = flags.file || await ask('📄 Enter the Solidity filename (e.g., MyContract.sol): ');
    const contractPath = path.join(contractDir, contractFile);
    if (!fs.existsSync(contractPath)) {
      console.error('❌ File not found.');
      process.exit(1);
    }

    // 🧪 Compile with Foundry
    console.log('🛠️ Compiling with Foundry...');
    execSync('forge build', { stdio: 'inherit' });

    // 📦 Extract ABI and Bytecode
    const contractName = path.basename(contractFile, '.sol');
    const outputPath = path.join('out', contractFile, `${contractName}.json`);
    if (!fs.existsSync(outputPath)) {
      console.error('❌ Compiled output not found.');
      process.exit(1);
    }

    const compiled = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    const abi = compiled.abi;
    const bytecode = compiled.bytecode?.object || compiled.evm?.bytecode?.object;

    if (!abi || !bytecode) {
      console.error('❌ ABI or bytecode missing in compiled output.');
      process.exit(1);
    }

    // 📤 Get output file path
    const savePath = flags.out || await ask('📤 Enter output file path (e.g., build/MyContract.json): ');
    const saveDir = path.dirname(savePath);
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    const outputJson = {
      contract: contractName,
      abi,
      bytecode
    };

    fs.writeFileSync(savePath, JSON.stringify(outputJson, null, 2));
    console.log(`✅ ABI and bytecode saved to ${savePath}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    rl.close();
  }
})();
