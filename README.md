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
node extractAbiBytecode.js
```

You'll be prompted to:
1. Enter the contract directory (e.g., `src`)
2. Enter the Solidity filename (e.g., `MyContract.sol`)
3. Specify the output path (e.g., `build/MyContract.json`)

---

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

## 📄 License

MIT — feel free to fork, modify, and contribute!

---

## 🤝 Contributing

Pull requests welcome! If you have ideas for improvements or want to extend functionality, open an issue or submit a PR.
