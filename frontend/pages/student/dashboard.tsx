import Link from "next/link";
import useSWR from "swr";
import { FundingProgress } from "../../components/FundingProgress";
import { MetricBlock } from "../../components/MetricBlock";
import { ProofRail } from "../../components/ProofRail";
import { StatusPill } from "../../components/StatusPill";
import { useWallet } from "../../components/WalletProvider";
import { fetcher } from "../../lib/api";
import { compactAddress, formatCurrency } from "../../lib/format";

type StudentVault = {
  vaultAddress: string;
  studentAddress: string;
  studentName?: string;
  country?: string;
  field?: string;
  institution?: string;
  committed: number;
  disbursed: number;
  targetAmount: number;
  activeMilestone?: string;
  confidence?: number;
  caseId?: string;
  riskNote?: string;
};

export default function StudentDashboard() {
  const { address, connect, hasWallet } = useWallet();
  const { data, isLoading } = useSWR<{ vaults: StudentVault[] }>(
    address ? `/api/students/${address}` : null,
    fetcher
  );

  const vaults = data?.vaults ?? [];
  const committed = vaults.reduce((sum, vault) => sum + vault.committed, 0);
  const disbursed = vaults.reduce((sum, vault) => sum + vault.disbursed, 0);

  if (!address) {
    return (
      <div className="grid min-h-[60vh] gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center">
        <section>
          <span className="eyebrow">Student dashboard</span>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-6xl">
            Your vault appears when your wallet and review record meet.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--text-muted)] md:text-lg md:leading-8">
            Connect the wallet used in your application to see verified vaults,
            release progress, and reviewer notes.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={connect} className="btn-primary">
              {hasWallet ? "Connect wallet" : "Wallet unavailable"}
            </button>
            <Link href="/student/apply" className="btn-secondary">
              Submit application
            </Link>
          </div>
        </section>
        <ProofRail
          title="Empty state that still explains the system"
          items={[
            {
              id: "connect",
              title: "Connect wallet",
              detail: "The dashboard uses wallet address as the lookup key.",
              tone: "warning",
            },
            {
              id: "match",
              title: "Match application",
              detail: "A reviewed student record unlocks active vaults.",
              tone: "info",
            },
            {
              id: "operate",
              title: "Track releases",
              detail: "Funding, proof, and disbursement status stay visible.",
              tone: "success",
            },
          ]}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">Student dashboard</span>
            <StatusPill tone="success">{compactAddress(address)}</StatusPill>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-6xl">
            See what donors and verifiers see.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--text-muted)] md:text-lg md:leading-8">
            Your dashboard compresses the important parts: funding assigned,
            capital released, next proof item, and whether anything needs your attention.
          </p>
        </div>
        <ProofRail
          title="Current student state"
          items={[
            {
              id: "wallet",
              title: "Wallet connected",
              detail: compactAddress(address),
              tone: "success",
            },
            {
              id: "vaults",
              title: isLoading ? "Loading vaults" : `${vaults.length} vaults found`,
              detail: vaults.length ? "Active scholarship records are ready for review." : "No verified vault exists for this wallet yet.",
              tone: vaults.length ? "success" : "warning",
            },
            {
              id: "next",
              title: vaults[0]?.activeMilestone ?? "Next action pending",
              detail: vaults[0]?.riskNote ?? "If your application is new, wait for verifier review.",
              tone: vaults[0] ? "info" : "neutral",
            },
          ]}
          compact
        />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <MetricBlock label="Vaults" value={isLoading ? "Loading" : String(vaults.length)} />
        <MetricBlock label="Committed" value={formatCurrency(committed)} />
        <MetricBlock label="Released" value={formatCurrency(disbursed)} />
      </section>

      {vaults.length > 0 ? (
        <section className="grid gap-4">
          {vaults.map((vault) => (
            <article
              key={vault.vaultAddress}
              className="surface grid gap-5 rounded-[var(--radius-lg)] p-5 md:grid-cols-[1fr_18rem] md:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="eyebrow">{vault.caseId ?? "Vault"}</span>
                  <StatusPill tone="success">active</StatusPill>
                </div>
                <h2 className="mt-4 text-2xl font-semibold">{vault.activeMilestone}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--text-muted)]">
                  {vault.riskNote}
                </p>
                <Link
                  href={`/donor/student/${vault.vaultAddress}`}
                  className="btn-secondary mt-5"
                >
                  Open vault record
                </Link>
              </div>
              <FundingProgress
                committed={vault.committed}
                disbursed={vault.disbursed}
                target={vault.targetAmount}
              />
            </article>
          ))}
        </section>
      ) : (
        <section className="surface-soft rounded-[var(--radius-lg)] p-8">
          <h2 className="text-2xl font-semibold">No vault has been created for this wallet.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--text-muted)]">
            This usually means the application is still under review or was submitted with
            a different wallet. Submit a new application if this wallet should be reviewed.
          </p>
          <Link href="/student/apply" className="btn-primary mt-6">
            Apply with this wallet
          </Link>
        </section>
      )}
    </div>
  );
}
