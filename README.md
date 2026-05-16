# ScOlar

A full-stack scholarship funding platform built with Next.js, React, and Solidity smart contracts. Donors fund students through milestone-based vaults with complete proof trails.

**🚀 [Live Demo](https://frontend-aseiim8jp-mauyaas-projects.vercel.app)**

## What It Does

- **Donor Interface:** Browse verified scholarship vaults, inspect funding gaps, and fund milestones
- **Student Dashboard:** Submit applications and track funded vaults linked to your wallet
- **Vault System:** Milestone-based releases with audit trails, risk notes, and funding actions
- **Smart Contracts:** Trustless scholarship factory and vault funding logic on EVM networks

## Key Features

- Searchable, sortable donor desk with verified scholarship vaults
- Wallet-linked student applications and vault lookup
- Milestone tracking with real-time funding status
- Complete audit events and proof trail for each vault
- Accessible UI with focus states, semantic markup, and reduced-motion support
- Mock API for local demos; ready for database integration

## Tech Stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **API** | Next.js API routes with mock store |
| **Web3** | ethers.js, Solidity, Hardhat |
| **Deployment** | Vercel (frontend), Hardhat (contracts) |

## Quick Start

### Prerequisites
- Node.js 18+
- MetaMask or compatible EVM wallet
- npm

### Setup

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:3000`

**Contracts:**
```bash
cd contracts
npm install
npm run compile
npx hardhat node          # Local test network
npm run deploy            # Deploy locally
```

### Environment Variables

Create `frontend/.env.local` to use a deployed factory:
```bash
NEXT_PUBLIC_FACTORY_ADDRESS=0xYourFactoryAddress
```

## Project Structure

```
scolar/
├── frontend/
│   ├── components/     Shared UI components and wallet shell
│   ├── lib/            API helpers, Web3 utilities, mock store
│   ├── pages/          Next.js pages and API routes
│   └── styles/         Tailwind CSS configuration
└── contracts/
    ├── contracts/      ScholarshipFactory and ScholarshipVault
    └── scripts/        Hardhat deployment
```

## API Routes

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/students` | GET | Fetch all students and vault summaries |
| `/api/students` | POST | Create a new student application |
| `/api/students/:address` | GET | Get vaults for a wallet address |
| `/api/vaults/:address` | GET | Get detailed vault information |

**Note:** The mock store resets on server restart. Replace `lib/mockStore.ts` with a real database for persistence.

## Deploy to Vercel

**Vercel Settings:**
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

**CLI:**
```bash
cd frontend
npx vercel
npx vercel --prod
```

Add `NEXT_PUBLIC_FACTORY_ADDRESS` in Vercel project environment variables before going live.

## Production Build

```bash
cd frontend
npm run build
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org)
- [ethers.js Documentation](https://docs.ethers.org)
