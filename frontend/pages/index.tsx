import Link from "next/link";
import useSWR from "swr";
import { MetricBlock } from "../components/MetricBlock";
import { ProofRail } from "../components/ProofRail";
import { StatusPill } from "../components/StatusPill";
import { VaultCard } from "../components/VaultCard";
import { fetcher } from "../lib/api";
import { formatCurrency } from "../lib/format";
import { listEnrichedVaults } from "../lib/mockStore";

type VaultSummary = {
  vaultAddress: string;
  studentAddress: string;
  studentName?: string;
  country?: string;
  field?: string;
  institution?: string;
  committed: number;
  disbursed: number;
  targetAmount: number;
  needScore: number;
  completionRate: number;
  activeMilestone?: string;
  confidence?: number;
  caseId?: string;
};

export default function Home({
  initialVaults,
}: {
  initialVaults: VaultSummary[];
}) {
  const { data } = useSWR<{ vaults: VaultSummary[] }>("/api/students", fetcher, {
    fallbackData: { vaults: initialVaults },
  });
  const vaults = data?.vaults ?? [];
  const committed = vaults.reduce((sum, vault) => sum + vault.committed, 0);
  const disbursed = vaults.reduce((sum, vault) => sum + vault.disbursed, 0);
  const averageConfidence =
    vaults.length === 0
      ? 0
      : Math.round(
          vaults.reduce((sum, vault) => sum + (vault.confidence ?? 0), 0) / vaults.length
        );

  return (
    <div className="space-y-20 md:space-y-28">
      <section className="grid min-h-[70vh] gap-10 pt-6 md:grid-cols-[minmax(0,1.1fr)_minmax(24rem,0.9fr)] md:items-end">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">Operational scholarship funding</span>
            <StatusPill tone="success">verified flow</StatusPill>
          </div>
          <h1 className="mt-8 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.04em] text-[color:var(--text)] md:text-7xl lg:text-8xl">
            Scholarship funding that makes every release explain itself.
          </h1>
         
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/donor/explore" className="btn-primary">
              Open donor desk
            </Link>
            <Link href="/student/apply" className="btn-secondary">
              Start an application
            </Link>
          </div>
        </div>

        <ProofRail
          eyebrow="Signature mechanic"
          title="The proof rail keeps the decision path visible."
          items={[
            {
              id: "intake",
              title: "Student profile captured",
              detail: "Identity, institution, need, and learning objective enter review together.",
              meta: "Intake",
              tone: "info",
            },
            {
              id: "vault",
              title: "Vault opened after verification",
              detail: "Funding is separated from release authority, so donors see commitment and control.",
              meta: "Verification",
              tone: "success",
            },
            {
              id: "release",
              title: "Milestones release against proof",
              detail: "Tuition and stipends move only when the next proof item clears.",
              meta: "Audit",
              tone: "warning",
            },
          ]}
        />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <MetricBlock
          label="Committed"
          value={vaults.length ? formatCurrency(committed) : "Loading"}
          detail="Funds currently allocated across verified scholarship vaults."
        />
        <MetricBlock
          label="Released"
          value={vaults.length ? formatCurrency(disbursed) : "Loading"}
          detail="Capital already moved through milestone proof."
        />
        <MetricBlock
          label="Average confidence"
          value={vaults.length ? `${averageConfidence}/100` : "Loading"}
          detail="A reviewer-readable signal assembled from proof completeness."
        />
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <span className="eyebrow">Why this exists</span>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">
            Donors should not have to choose between empathy and evidence.
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-[color:var(--text-muted)]">
            The app removes vague scholarship updates and replaces them with a small
            operating system: who needs funding, what is approved, what is still at risk,
            and which action should happen next.
          </p>
          <div className="mt-8 grid gap-3 text-sm text-[color:var(--text-muted)]">
            <div className="surface-soft rounded-[var(--radius-md)] p-4">
              Donors get a triage desk, not a gallery.
            </div>
            <div className="surface-soft rounded-[var(--radius-md)] p-4">
              Students get a clear path from application to vault review.
            </div>
            <div className="surface-soft rounded-[var(--radius-md)] p-4">
              Verifiers get a common language for proof, risk, and release.
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {vaults.slice(0, 2).map((vault) => (
            <VaultCard key={vault.vaultAddress} {...vault} />
          ))}
        </div>
      </section>

      <section className="border-t border-[color:var(--line)] pt-10">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <span className="eyebrow">Next action</span>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.03em] md:text-5xl">
              Choose the side of the system you need to operate.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
            <Link href="/donor/explore" className="btn-primary">
              Review vaults
            </Link>
            <Link href="/student/dashboard" className="btn-secondary">
              Check my status
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export function getStaticProps() {
  return {
    props: {
      initialVaults: listEnrichedVaults(),
    },
  };
}
