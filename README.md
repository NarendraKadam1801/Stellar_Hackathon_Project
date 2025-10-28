<div align="center">
  <h1 align="center">✨ AidBridge</h1>
  <p align="center">Revolutionizing Aid Distribution with Blockchain Technology</p>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Stellar](https://img.shields.io/badge/Stellar-7D00FF?logo=stellar&logoColor=white)](https://stellar.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

  <img src="https://img.shields.io/github/last-commit/yourusername/aidbridge?style=for-the-badge" alt="Last commit" />
  <img src="https://img.shields.io/github/contributors/yourusername/aidbridge?style=for-the-badge" alt="Contributors" />
  <img src="https://img.shields.io/github/issues/yourusername/aidbridge?style=for-the-badge" alt="Open Issues" />

  ![AidBridge Demo](https://via.placeholder.com/1200x600/2d2d2d/ffffff?text=AidBridge+Demo)
</div>

## 🌟 Why AidBridge?

AidBridge is a **next-generation decentralized platform** that leverages the power of the Stellar blockchain to transform how aid is distributed globally. Our mission is to create a transparent, efficient, and accountable system that connects donors directly with those in need, eliminating intermediaries and reducing overhead costs.

### 🔍 Key Problems We Solve

- **Transparency Issues**: Every transaction is recorded on the Stellar blockchain, providing an immutable audit trail
- **High Transaction Costs**: Stellar's low fees ensure more of your donation reaches those who need it
- **Slow Processing**: Near-instant settlement times mean aid reaches beneficiaries faster
- **Lack of Accountability**: Smart contracts ensure funds are used as intended

## 🚀 Features

<div align="center">
  <table>
    <tr>
      <td width="33%" align="center">
        <h3>🌐 Seamless Integration</h3>
        <p>Built on Stellar for fast, secure, and low-cost transactions</p>
      </td>
      <td width="33%" align="center">
        <h3>💎 Modern Interface</h3>
        <p>Responsive Next.js frontend with beautiful Radix UI components</p>
      </td>
      <td width="33%" align="center">
        <h3>🔒 Secure by Design</h3>
        <p>Enterprise-grade security with JWT and blockchain verification</p>
      </td>
    </tr>
    <tr>
      <td width="33%" align="center">
        <h3>🤖 Smart Contracts</h3>
        <p>Soroban-based contracts for transparent operations</p>
      </td>
      <td width="33%" align="center">
        <h3>📦 IPFS Storage</h3>
        <p>Decentralized storage for documents and metadata</p>
      </td>
      <td width="33%" align="center">
        <h3>🌍 Global Impact</h3>
        <p>Designed to scale and serve communities worldwide</p>
      </td>
    </tr>
  </table>
</div>

## 🛠️ Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Stellar-7D00FF?style=for-the-badge&logo=stellar&logoColor=white" alt="Stellar" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white" alt="Rust" />
</div>

### Frontend
- **Framework**: Next.js 13+ (App Router) - For blazing fast server-rendered React applications
- **UI/UX**: Radix UI + Tailwind CSS - Beautiful, accessible components with utility-first CSS
- **State Management**: Redux Toolkit - Predictable state management for React apps
- **Blockchain**: Stellar SDK & Freighter Wallet - Seamless blockchain interactions

### Backend
- **Runtime**: Node.js - JavaScript runtime built on Chrome's V8 engine
- **Framework**: Express.js - Fast, unopinionated web framework for Node.js
- **Database**: MongoDB (via Mongoose) - Flexible NoSQL database
- **Authentication**: JWT - Secure token-based authentication

### Smart Contracts
- **Platform**: Soroban - Smart contracts platform for Stellar
- **Language**: Rust - Fast and memory-efficient language
- **Features**: Secure data storage, transparent transactions, and more

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- [MongoDB](https://www.mongodb.com/) (v5.0 or later)
- [Rust](https://www.rust-lang.org/) (for smart contract development)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup) (for contract deployment)
- [Freighter Wallet](https://www.freighter.app/) (for blockchain interactions)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/aidbridge.git
   cd aidbridge
cd aidbridge
```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   yarn
   
   # Install frontend dependencies
   cd frontend
   yarn
   
   # Install server dependencies
   cd ../server
   yarn
   ```

3. **Set Up Environment Variables**

   Create `.env` files in both `frontend` and `server` directories:

   **Frontend (frontend/.env.local)**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
   # Add other frontend environment variables here
   ```

   **Backend (server/.env)**
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/aidbridge
   JWT_SECRET=your_secure_jwt_secret
   STELLAR_SECRET_KEY=your_stellar_secret_key
   # Add other backend environment variables here
   ```
```

**Backend (server/.env)**
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/aidbridge
JWT_SECRET=your_jwt_secret
STELLAR_SECRET_KEY=your_stellar_secret_key
```

### 3. Install Dependencies
```bash
# Install root dependencies
yarn

# Install frontend dependencies
cd frontend
yarn

# Install server dependencies
cd ../server
yarn
```

### 4. Start Development Servers

In separate terminal windows:

**Start the backend server**
```bash
cd server
yarn dev
```

**Start the frontend**
```bash
cd frontend
yarn dev
```

### 5. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Development

### Running Locally

1. **Start the Backend**
   ```bash
   cd server
   yarn dev
   ```

2. **Start the Frontend** (in a new terminal)
   ```bash
   cd frontend
   yarn dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - API Server: http://localhost:3001

## 🔧 Smart Contract Development

### Build the Contract
```bash
cd smart-contract/contracts/hello-world
cargo build --target wasm32-unknown-unknown --release
```

### Deploy the Contract
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/hello_world.wasm \
  --source <your-secret-key> \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase 'Test SDF Network ; September 2015'
```

## 🧪 Testing

Run the test suite:

```bash
# Frontend tests
cd frontend
yarn test

# Backend tests
cd ../server
yarn test
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

1. 🐛 **Report Bugs** - Open an issue with detailed reproduction steps
2. 💡 **Suggest Features** - Share your ideas in the discussions
3. 🛠 **Submit Pull Requests** - Follow these steps:
   ```bash
   # 1. Fork the repository
   # 2. Create your feature branch
   git checkout -b feature/amazing-feature
   # 3. Commit your changes
   git commit -m 'Add some amazing feature'
   # 4. Push to the branch
   git push origin feature/amazing-feature
   # 5. Open a Pull Request
   ```

## 📚 Documentation

For detailed documentation, please visit our [Documentation Wiki](https://github.com/yourusername/aidbridge/wiki).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Special thanks to these amazing projects and communities:

- [Stellar Development Foundation](https://stellar.org/) for building the Stellar network
- [Soroban](https://soroban.stellar.org/) for the smart contracts platform
- [Next.js](https://nextjs.org/) for the amazing React framework
- All our [contributors](https://github.com/yourusername/aidbridge/graphs/contributors)

## 🌟 Show Your Support

If you find this project helpful, please consider:

- Giving a ⭐️ on GitHub
- Sharing with your network
- Contributing code or documentation

## 📬 Contact

- **Email**: contact@aidbridge.org
- **Twitter**: [@AidBridgeApp](https://twitter.com/AidBridgeApp)
- **Discord**: [Join our community](https://discord.gg/your-invite-link)

---

<div align="center">
  Made with ❤️ by the AidBridge Team
</div>
