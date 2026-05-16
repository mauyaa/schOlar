import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";
import { FundingProgress } from "../../../components/FundingProgress";
import { MetricBlock } from "../../../components/MetricBlock";
import { MilestoneTimeline } from "../../../components/MilestoneTimeline";
import { ProofRail } from "../../../components/ProofRail";
import { StatusPill } from "../../../components/StatusPill";
import { fetcher } from "../../../lib/api";
import { compactAddress, formatCurrency } from "../../../lib/format";
import { getSigner, getVaultContract } from "../../../lib/web3";

type Milestone = {
  id: number;
  description: string;
  tuitionAmount: string;
  stipendAmount: string;
  status: "Pending" | "Approved" | "Paid" | "Revoked";
  dueDate?: string;
  proof?: string;
};

type AuditEvent = {
  id: string;
  title: string;
  detail: string;
  actor: string;
  timestamp: string;
  tone: "success" | "info" | "warning" | "danger" | "neutral";
};

type VaultInfo = {
  vaultAddress: string;
  studentAddress: string;
  caseId: string;
  studentName?: string;
  country?: string;
  field?: string;
  institution?: string;
  impactStory?: string;
  committed: number;
  disbursed: number;
  totalCommitted: number;
  totalDisbursed: number;
  targetAmount: number;
  needScore: number;
  completionRate: number;
  stableToken: string;
  activeMilestone: string;
  verifier: string;
  confidence: number;
  riskNote: string;
  learningObjective: string;
  lastVerifiedAt: string;
  milestones: Milestone[];
  auditTrail: AuditEvent[];
};

const milestoneTone = {
  Paid: "success",
  Approved: "info",
  Pending: "warning",
  Revoked: "danger",
} as const;

export default function VaultDetail() {
  const router = useRouter();
  const vault = typeof router.query.vault === "string" ? router.query.vault : "";
  const { data: info, error, isLoading } = useSWR<VaultInfo>(
    vault ? `/api/vaults/${vault}` : null,
    fetcher
  );
  const [amount, setAmount] = useState("100");
  const [fundingState, setFundingState] = useState<string | null>(null);

  async function fund() {
    if (!vault || !info) return;
    setFundingState("Preparing wallet transaction.");

    try {
      const signer = getSigner();
      const contract = getVaultContract(vault, signer);
      const stableToken = new ethers.Contract(
        info.stableToken,
        ["function approve(address spender, uint256 amount) external returns (bool)"],
        signer
      );
      const parsedAmount = ethers.utils.parseUnits(amount || "0", 6);

      setFundingState("Requesting token approval.");
      const approval = await stableToken.approve(vault, parsedAmount);
      await approval.wait?.();

      setFundingState("Sending vault funding transaction.");
      const transaction = await contract.fund(parsedAmount);
      await transaction.wait?.();
      setFundingState("Funding confirmed. Refresh the vault after the indexer updates.");
    } catch (fundingError) {
      console.error(fundingError);
      setFundingState(
        "Funding was not completed. Use a wallet connected to the deployed token and vault network."
      );
    }
  }

  if (isLoading || !vault) {
    return (
      <div className="surface-soft rounded-[var(--radius-lg)] p-8 text-sm text-[color:var(--text-muted)]">
        Loading vault record.
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="surface-soft rounded-[var(--radius-lg)] p-8">
        <h1 className="text-2xl font-semibold">Vault not found.</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--text-muted)]">
          This vault address is not present in the local mock API store.
        </p>
      </div>
    );
  }

  const proofItems = info.milestones.map((milestone) => ({
    id: milestone.id,
    title: milestone.description,
    detail: milestone.proof,
    meta: milestone.status,
    tone: milestoneTone[milestone.status],
  }));

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">{info.caseId}</span>
            <StatusPill tone="success">verified learner</StatusPill>
            <StatusPill tone="info">{info.confidence}/100 confidence</StatusPill>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-6xl">
            {info.studentName} is ready for {info.activeMilestone.toLowerCase()}.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--text-muted)] md:text-lg md:leading-8">
            {info.impactStory}
          </p>
          <dl className="mt-8 grid gap-4 text-sm text-[color:var(--text-muted)] md:grid-cols-3">
            <div className="surface-soft rounded-[var(--radius-md)] p-4">
              <dt className="eyebrow">Student</dt>
              <dd className="mt-3">{compactAddress(info.studentAddress)}</dd>
            </div>
            <div className="surface-soft rounded-[var(--radius-md)] p-4">
              <dt className="eyebrow">Institution</dt>
              <dd className="mt-3">{info.institution}</dd>
            </div>
            <div className="surface-soft rounded-[var(--radius-md)] p-4">
              <dt className="eyebrow">Verifier</dt>
              <dd className="mt-3">{info.verifier}</dd>
            </div>
          </dl>
        </div>

        <aside className="surface rounded-[var(--radius-lg)] p-5">
          <span className="eyebrow">Fund this vault</span>
          <div className="mt-5">
            <FundingProgress
              committed={info.totalCommitted}
              disbursed={info.totalDisbursed}
              target={info.targetAmount}
            />
          </div>
          <label className="mt-6 block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
              Amount in USDC
            </span>
            <input
              className="field mt-2"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              inputMode="decimal"
            />
          </label>
          <button onClick={fund} className="btn-primary mt-4 w-full">
            Fund this learner
          </button>
          {fundingState && (
            <p className="mt-4 text-sm leading-6 text-[color:var(--text-muted)]" role="status">
              {fundingState}
            </p>
          )}
        </aside>
      </section>

      <section className="grid gap-6 md:grid-cols-4">
        <MetricBlock label="Need score" value={`${info.needScore}/10`} />
        <MetricBlock label="Target" value={formatCurrency(info.targetAmount)} />
        <MetricBlock label="Committed" value={formatCurrency(info.totalCommitted)} />
        <MetricBlock label="Released" value={formatCurrency(info.totalDisbursed)} />
      </section>

      <section className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-32">
          <ProofRail title="Milestone proof spine" items={proofItems} />
        </div>
        <div className="space-y-10">
          <section>
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <span className="eyebrow">Milestones</span>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
                  Release schedule
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-[color:var(--warning)]">
                {info.riskNote}
              </p>
            </div>
            <MilestoneTimeline milestones={info.milestones} />
          </section>

          <section>
            <div className="mb-4">
              <span className="eyebrow">Audit trail</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
                Recent evidence
              </h2>
            </div>
            <div className="divide-y divide-[color:var(--line)] overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--line)]">
              {info.auditTrail.map((event) => (
                <article
                  key={event.id}
                  className="grid gap-4 bg-[color:var(--background-raised)] p-4 md:grid-cols-[10rem_1fr_auto] md:p-5"
                >
                  <div className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                    {event.timestamp}
                  </div>
                  <div>
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
                      {event.detail}
                    </p>
                  </div>
                  <StatusPill tone={event.tone}>{event.actor}</StatusPill>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
