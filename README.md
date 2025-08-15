# 🧪 Foundry ABI & Bytecode Extractor
[![Copilot-20250601-124946.png](https://i.postimg.cc/P5TQq2RL/Copilot-20250601-124946.png)](https://postimg.cc/QHYT4kss)

## 🔧 Technologies & Tools

[![Cyfrin](https://img.shields.io/badge/Cyfrin-Audit%20Ready-005030?logo=shield&labelColor=F47321)](https://www.cyfrin.io/)
[![FlashBots](https://img.shields.io/pypi/v/finta?label=Finta&logo=python&logoColor=2774AE&labelColor=FFD100)](https://www.flashbots.net/)
[![Python](https://img.shields.io/badge/Python-3.11-003057?logo=python&labelColor=B3A369)](https://www.python.org/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.20-7BAFD4?logo=ethereum&labelColor=4B9CD3)](https://docs.soliditylang.org)
[![pYcHARM](https://img.shields.io/badge/Built%20with-PyCharm-782F40?logo=pycharm&logoColor=CEB888)](https://www.jetbrains.com/pycharm/)
[![Issues](https://img.shields.io/github/issues/74Thirsty/getBytecode.svg?color=hotpink&labelColor=brightgreen)](https://github.com/74Thirsty/getBytecode/issues)
[![Lead Dev](https://img.shields.io/badge/C.Hirschauer-Lead%20Developer-041E42?logo=parrotsecurity&labelColor=8D817B)](https://christopherhirschauer.bio)


> <p><strong>Christopher Hirschauer</strong><br>
> Builder @ the bleeding edge of MEV, automation, and high-speed arbitrage.<br>
<em>June 13, 2025</em></p>


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

function getFoundryForgePath() {
  const forgePath = path.join(process.env.HOME, '.foundry/bin/forge');
  if (!fs.existsSync(forgePath)) {
    console.warn('⚠️ Foundry forge binary not found at ~/.foundry/bin/forge');
    console.warn('   Make sure Foundry is installed via foundryup and your PATH is set correctly.');
    return 'forge'; // fallback to system forge
  }

  // Sanity check: make sure it's Foundry's forge
  try {
    const versionOutput = execSync(`${forgePath} --version`).toString();
    if (!versionOutput.toLowerCase().includes('foundry')) {
      console.warn('⚠️ Detected forge binary is not Foundry. You may be using a conflicting tool like ZOE.');
    }
  } catch {
    console.warn('⚠️ Unable to verify forge binary. Proceeding anyway.');
  }

  return forgePath;
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

    const forgeBinary = getFoundryForgePath();

    execSync(`${forgeBinary} build --contracts ${normalizedContractPath}`, {
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

```

## 🔍 1. ZOE Is Still Interfering

Even though `which forge` points to Foundry, your compiler output says:

> ⚠ Detected forge binary is not Foundry. You may be using a conflicting tool like ZOE.

That means something in your environment is **still executing ZOE’s version**, possibly via:

- A rogue alias
- A symlink
- A wrapper script
- A cached binary path

Let’s hunt it down.

---

## 🧨 Step-by-Step ZOE Exorcism

### ✅ 1. Check for aliases

```
alias forge
```

If you see anything, remove it:

```
unalias forge
```

---

### ✅ 2. Check for symlinks

```
ls -l $(which forge)
```

If it’s a symlink to `/usr/bin/forge`, delete it:

```
sudo rm /usr/bin/forge
```

---

### ✅ 3. Check your `$PATH` order

Run:

```
echo $PATH
```

Make sure `~/.foundry/bin` comes **before** `/usr/bin`. If not, fix it in `.bashrc` or `.zshrc`:

```
export PATH="$HOME/.foundry/bin:$PATH"
```

Then reload:

```bash
source ~/.bashrc
```

---

### ✅ 4. Clear shell cache

```
hash -r
```

---

### ✅ 5. Reinstall Foundry (optional but clean)

```
foundryup --reinstall
```

---

## 🧠 Bonus: Detect ZOE in Your Script

Want a script that auto-detects ZOE and warns the user? Here's a snippet:

```
if forge --version 2>&1 | grep -q "ZOE"; then
  echo "❌ ZOE detected. Please run: sudo rm /usr/bin/forge"
  exit 1
fi
```

---
