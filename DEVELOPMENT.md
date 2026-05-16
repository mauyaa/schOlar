# schOlar Development Guide

Complete guide for setting up, developing, and maintaining the schOlar project.

## Prerequisites

- **Node.js**: v18 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Git**: For version control
- **MetaMask**: Browser extension for Web3 testing ([Install](https://metamask.io/))
- **Hardhat**: Smart contract development (installed per project)

## Project Structure

```
schOlar/
├── frontend/                 # Next.js 14 application
│   ├── components/          # React components
│   │   ├── ui/             # Shared UI components
│   │   ├── vault/          # Vault-specific components
│   │   └── student/        # Student dashboard components
│   ├── lib/                # Utilities and helpers
│   │   ├── api.ts          # API client
│   │   ├── web3.ts         # Web3 utilities
│   │   ├── mockStore.ts    # Mock database (replace with real DB)
│   │   └── types.ts        # TypeScript interfaces
│   ├── pages/              # Next.js pages and API routes
│   │   ├── api/            # Backend API endpoints
│   │   ├── donor/          # Donor interface pages
│   │   ├── student/        # Student dashboard pages
│   │   └── index.tsx       # Homepage
│   ├── styles/             # Tailwind CSS
│   ├── .env.local          # Local environment variables
│   ├── .env.example        # Template for environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── contracts/              # Solidity smart contracts
│   ├── contracts/          # Contract source files
│   │   ├── ScholarshipFactory.sol
│   │   └── ScholarshipVault.sol
│   ├── scripts/            # Deployment scripts
│   │   └── deploy.js
│   ├── test/               # Contract tests
│   ├── hardhat.config.js
│   ├── package.json
│   └── .env.example
│
└── joke-generator/         # Utility project (optional)
```

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update `.env.local`:

```env
# Web3 Configuration
NEXT_PUBLIC_FACTORY_ADDRESS=0x... # Deployed factory address
NEXT_PUBLIC_NETWORK_ID=31337       # 1 (mainnet), 31337 (local), etc.

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=
```

### 3. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
npm run start
```

## Smart Contracts Setup

### 1. Install Dependencies

```bash
cd contracts
npm install
```

### 2. Compile Contracts

```bash
npm run compile
```

Output will be in `artifacts/` directory.

### 3. Start Local Network

Open new terminal in `contracts/`:

```bash
npx hardhat node
```

This runs a local Ethereum network on `http://localhost:8545`

### 4. Deploy Contracts Locally

In another terminal:

```bash
npm run deploy
```

Deployment output will show contract addresses. Copy the `ScholarshipFactory` address.

### 5. Update Frontend Configuration

In `frontend/.env.local`:

```env
NEXT_PUBLIC_FACTORY_ADDRESS=0x... # From deployment output
```

## Common Development Tasks

### Run Tests

**Frontend:**
```bash
cd frontend
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # Coverage report
```

**Contracts:**
```bash
cd contracts
npm test                    # Run Hardhat tests
npm run test:coverage      # Coverage report
```

### Code Linting & Formatting

**Frontend:**
```bash
npm run lint               # ESLint check
npm run lint:fix           # Fix linting issues
npm run format             # Prettier formatting
```

**Contracts:**
```bash
npm run lint               # Solhint check
```

### Database Integration (Replace Mock Store)

Currently using `lib/mockStore.ts`. To integrate a real database:

1. **Install PostgreSQL driver:**
   ```bash
   npm install @prisma/client
   npm install -D prisma
   ```

2. **Initialize Prisma:**
   ```bash
   npx prisma init
   ```

3. **Update `.env.local`:**
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/scholar
   ```

4. **Create Prisma schema** in `prisma/schema.prisma`

5. **Replace `lib/mockStore.ts`** with Prisma client calls

6. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

## API Development

### Adding New API Endpoint

1. Create file in `pages/api/` (e.g., `pages/api/vaults/list.ts`)

2. Example implementation:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // Your logic here
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).end();
  }
}
```

3. Test with cURL or Postman:
```bash
curl http://localhost:3000/api/vaults/list
```

## Web3 Integration

### Connect to Wallet

```typescript
import { ethers } from 'ethers';

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const address = await signer.getAddress();
```

### Interact with Contract

```typescript
import { CONTRACT_ABI } from '@/lib/abis';

const contract = new ethers.Contract(
  contractAddress,
  CONTRACT_ABI,
  signer
);

const tx = await contract.fundMilestone(vaultId, amount);
await tx.wait();
```

## Debugging

### Frontend Debugging

1. **React DevTools**: Install browser extension
2. **Network Tab**: Check API calls
3. **Console Logs**: Use browser console
4. **VS Code Debugger**: Add breakpoints and debug

### Contract Debugging

1. **Hardhat Console:**
   ```bash
   npx hardhat console --network localhost
   ```

2. **Console.log in Solidity:** Use `console.sol`
3. **Event Logs:** Check emitted events

## Performance Optimization

### Frontend
- Use React.memo for expensive components
- Implement code splitting with dynamic imports
- Optimize images with Next.js Image component
- Enable caching headers

### Contracts
- Minimize storage operations
- Use events instead of storage for logs
- Optimize gas usage with proper data types

## Deployment

### Frontend to Vercel

```bash
cd frontend
npx vercel
```

Set environment variables in Vercel dashboard.

### Contracts to Testnet

1. **Get Testnet RPC URL** (e.g., Sepolia from Infura)
2. **Configure in `hardhat.config.js`:**
   ```javascript
   networks: {
     sepolia: {
       url: process.env.SEPOLIA_RPC_URL,
       accounts: [process.env.PRIVATE_KEY]
     }
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy -- --network sepolia
   ```

## Troubleshooting

### "Cannot find module" errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### MetaMask connection issues
- Ensure correct network is selected in MetaMask
- Check `NEXT_PUBLIC_NETWORK_ID` matches wallet network
- Try disconnecting and reconnecting wallet

### Contract deployment fails
- Ensure local Hardhat node is running
- Check gas parameters
- Verify contract syntax with `npm run compile`

### API returns 404
- Verify file exists in `pages/api/`
- Check exact route path
- Restart development server

## Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Hardhat Docs](https://hardhat.org/docs)
- [ethers.js Docs](https://docs.ethers.org)
- [Solidity Docs](https://docs.soliditylang.org)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## Additional Resources

- Schol website documentation
- Smart contract audit checklist
- Performance benchmarking guide
- Security best practices guide
