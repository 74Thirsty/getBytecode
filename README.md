# 🧪 Foundry ABI & Bytecode Extractor

A lightweight Node.js script that compiles Solidity contracts using [Foundry](https://book.getfoundry.sh/) and extracts the **ABI** and **bytecode** into a clean JSON file. Perfect for deploying, testing, or integrating with frontends.

---

## 🚀 Features

- ✅ Checks if Foundry is installed
- 📁 Prompts for contract directory and filename
- 🛠️ Runs `forge build` automatically
- 📦 Extracts ABI and bytecode from Foundry's output
- 📤 Saves to a user-defined location as structured JSON

---

## 📦 Installation

Clone the repo and install dependencies (if needed):

```bash
git clone https://github.com/your-username/foundry-abi-extractor.git
cd foundry-abi-extractor
```

Make the script executable:

```bash
chmod +x extractAbiBytecode.js
```

---

## 🧑‍💻 Usage

Run the script interactively:

```bash
node getBytecode.js
```

You'll be prompted to:
1. Enter the contract directory (e.g., `src`)
2. Enter the Solidity filename (e.g., `MyContract.sol`)
3. Specify the output path (e.g., `build/MyContract.json`)

---
## 🧑‍💻 Usage
### 🔁 Interactive Mode
```
node getBytecode.js
```
⚡ CLI Mode
```
node getBytecode.js --dir src --file MyContract.sol --out build/MyContract.json
```

## 📂 Output Format

The script generates a JSON file like:

```json
{
  "contract": "MyContract",
  "abi": [ ... ],
  "bytecode": "0x60806040..."
}
```

---

## 🛠 Requirements

- [Foundry](https://book.getfoundry.sh/getting-started/installation) installed (`forge` must be available in your PATH)
- Node.js v14+ recommended

---

## 🧠 Future Enhancements

- CLI flags for non-interactive mode
- Etherscan verification integration
- ABI-only or bytecode-only export options
- Auto-discovery of contracts in a directory

---


## 🚀 Script: `extractAbiBytecode.js`

```js
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
```

---

   node extractAbiBytecode.js
   ```

---
