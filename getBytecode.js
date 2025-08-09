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

(async () => {
  try {
    // ✅ Check if Foundry is installed
    try {
      execSync('forge --version', { stdio: 'ignore' });
    } catch {
      console.error('❌ Foundry is not installed. Please run: curl -L https://foundry.paradigm.xyz | bash');
      process.exit(1);
    }

    // 📁 Ask for contract directory
    const contractDir = await ask('📁 Enter the contract directory (e.g., src): ');
    if (!fs.existsSync(contractDir)) {
      console.error('❌ Directory does not exist.');
      process.exit(1);
    }

    // 📄 Ask for Solidity filename
    const contractFile = await ask('📄 Enter the Solidity filename (e.g., MyContract.sol): ');
    const contractPath = path.join(contractDir, contractFile);
    if (!fs.existsSync(contractPath)) {
      console.error('❌ File not found.');
      process.exit(1);
    }

    // 🧪 Compile with Foundry
    console.log('🛠️ Compiling with Foundry...');
    execSync('forge build', { stdio: 'inherit' });

    // 📦 Extract ABI and Bytecode
    const contractName = contractFile.replace('.sol', '');
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

    // 📤 Ask for output location
    const savePath = await ask('📤 Enter output file path (e.g., build/MyContract.json): ');
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
