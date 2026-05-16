# ScOlar

ScOlar is a full-stack scholarship funding application for milestone-based education vaults. Donors can review verified students, inspect funding gaps, and open each vault's proof trail before contributing. Students can submit applications and track vault status through a wallet-linked dashboard.

## Product Concept

The interface is built around the idea of **Proof, held in motion**. Instead of treating scholarship profiles as static cards, ScOlar uses a proof rail: a visible operational spine that follows each funding decision from student intake to verification, milestone approval, donor funding, and release.

## Features

- Donor desk with searchable, sortable verified scholarship vaults
- Student application intake with wallet-aware submission
- Student dashboard for wallet-linked vault lookup
- Vault detail pages with milestone release schedules, risk notes, audit events, and funding actions
- Next.js API routes backed by an in-memory mock store for local demos
- Solidity smart contracts for scholarship factory and milestone vault funding logic
- Accessible focus states, semantic page structure, reduced-motion support, and responsive layouts

## Technology Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **API:** Next.js API routes
- **Web3:** ethers.js
- **Smart contracts:** Solidity, Hardhat, OpenZeppelin Contracts
- **Tooling:** TypeScript, npm, Vercel-ready build output

## Project Structure

```text
scolar/
  frontend/
    components/      Shared UI components and wallet shell
    lib/             API helpers, formatting utilities, mock store, Web3 helpers
    pages/           Next.js pages and API routes
    styles/          Global design tokens and Tailwind layers
  contracts/
    contracts/       ScholarshipFactory and ScholarshipVault contracts
    scripts/         Hardhat deployment script
```

## Prerequisites

- Node.js 18 or newer
- npm
- MetaMask or another injected browser wallet for funding flows
- A local or deployed EVM network for real contract transactions

## Installation

Install frontend dependencies:

```bash
cd scolar/frontend
npm install
```

Install contract dependencies:

```bash
cd ../contracts
npm install
```

## Environment Variables

The frontend works with local mock API data by default. To point the Web3 helper at a deployed factory contract, create `frontend/.env.local`:

```bash
NEXT_PUBLIC_FACTORY_ADDRESS=0xYourFactoryAddress
```

The current fallback factory address is Hardhat's default local deployment address.

## Usage

Run the frontend:

```bash
cd scolar/frontend
npm run dev
```

Open:

```text
http://localhost:3000
```

Compile contracts:

```bash
cd scolar/contracts
npm run compile
```

Deploy contracts to a local Hardhat node:

```bash
cd scolar/contracts
npx hardhat node
npm run deploy
```

Build the frontend for production:

```bash
cd scolar/frontend
npm run build
```

## API Routes

- `GET /api/students` returns students and enriched vault summaries
- `POST /api/students` creates an in-memory student application
- `GET /api/students/:address` returns vaults linked to a wallet address
- `GET /api/vaults/:address` returns one enriched vault record

The mock store is in memory, so submitted applications reset when the server restarts or when Vercel serverless instances recycle. Replace `frontend/lib/mockStore.ts` with a database adapter for production persistence.

## Vercel Deployment

Recommended Vercel settings:

- **Root Directory:** `scolar/frontend` if deploying from the current parent repo, or `frontend` if the `scolar` folder is the repository root
- **Install Command:** `npm install`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

CLI deployment:

```bash
cd scolar/frontend
npx vercel
npx vercel --prod
```

If using a deployed contract, add `NEXT_PUBLIC_FACTORY_ADDRESS` in the Vercel project environment variables before production deployment.

## Git Commands

If `scolar` is the repository root:

```bash
git remote add origin https://github.com/mauyaa/schOlar.git
git add .gitignore README.md frontend contracts
git commit -m "Complete ScOlar full-stack application"
git push -u origin main
```

If the remote already exists:

```bash
git remote set-url origin https://github.com/mauyaa/schOlar.git
git push -u origin main
```

If you are committing from the current parent workspace where this project lives in a `scolar/` folder:

```bash
git add scolar/.gitignore scolar/README.md scolar/frontend scolar/contracts
git commit -m "Complete ScOlar full-stack application"
git remote set-url origin https://github.com/mauyaa/schOlar.git
git push -u origin main
```

## Verification

Validated locally with:

```bash
cd scolar/frontend
npm run build

cd ../contracts
npm run compile
```
