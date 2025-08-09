#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer.trim())));
}

function expandHome(p) {
  return p.startsWith('~') ? path.join(process.env.HOME, p.slice(1)) : p;
}

(async () => {
  try {
    console.log('🔧 Foundry Contract Compiler');

    const contractDirInput = await ask('📁 Enter the Foundry project directory: ');
    const contractFileInput = await ask('📄 Enter the contract file path (relative to project root): ');

    const projectRoot = path.resolve(expandHome(contractDirInput));
    const contractFileRelative = path.normalize(contractFileInput);
    const fullContractPath = path.resolve(projectRoot, contractFileRelative);
    const normalizedContractPath = path.relative(projectRoot, fullContractPath);

    if (!fs.existsSync(fullContractPath)) {
      console.error(`❌ Contract file not found at: ${fullContractPath}`);
      rl.close();
      process.exit(1);
    }

    console.log(`📁 Foundry project root: ${projectRoot}`);
    console.log(`📄 Normalized contract path: ${normalizedContractPath}`);

    execSync(`forge build --contracts ${normalizedContractPath}`, {
      cwd: projectRoot,
      stdio: 'inherit',
    });

    console.log('✅ Contract compiled successfully');
  } catch (err) {
    console.error('❌ Foundry build failed');
  } finally {
    rl.close();
  }
})();
