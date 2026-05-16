import { useMemo, useState } from "react";
import useSWR from "swr";
import { MetricBlock } from "../../components/MetricBlock";
import { ProofRail, type ProofRailItem } from "../../components/ProofRail";
import { StatusPill } from "../../components/StatusPill";
import { VaultCard } from "../../components/VaultCard";
import { fetcher } from "../../lib/api";
import { formatCurrency } from "../../lib/format";
import { listEnrichedVaults } from "../../lib/mockStore";

type VaultSummary = {
  vaultAddress: string;
  studentAddress: string;
  studentName?: string;
  country?: string;
  field?: string;
  institution?: string;
  impactStory?: string;
  committed: number;
  disbursed: number;
  targetAmount: number;
  needScore: number;
  completionRate: number;
  activeMilestone?: string;
  confidence?: number;
  caseId?: string;
  riskNote?: string;
};

export default function Explore({
  initialVaults,
}: {
  initialVaults: VaultSummary[];
}) {
  const { data, error, isLoading } = useSWR<{ vaults: VaultSummary[] }>(
    "/api/students",
    fetcher,
    { fallbackData: { vaults: initialVaults } }
  );
  const [query, setQuery] = useState("");
  const [minimumNeed, setMinimumNeed] = useState(0);
  const [sort, setSort] = useState<"priority" | "confidence" | "gap">("priority");

  const vaults = data?.vaults ?? [];
  const filteredVaults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return vaults
      .filter((vault) => {
        const searchable = [
          vault.studentName,
          vault.country,
          vault.field,
          vault.institution,
          vault.caseId,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return (
          (!normalizedQuery || searchable.includes(normalizedQuery)) &&
          vault.needScore >= minimumNeed
        );
      })
      .sort((a, b) => {
        if (sort === "confidence") return (b.confidence ?? 0) - (a.confidence ?? 0);
        if (sort === "gap") {
          return (
            b.targetAmount - b.committed - (a.targetAmount - a.committed)
          );
        }
        return b.needScore * 10 + (b.confidence ?? 0) - (a.needScore * 10 + (a.confidence ?? 0));
      });
  }, [minimumNeed, query, sort, vaults]);

  const committed = filteredVaults.reduce((sum, vault) => sum + vault.committed, 0);
  const openGap = filteredVaults.reduce(
    (sum, vault) => sum + Math.max(0, vault.targetAmount - vault.committed),
    0
  );
  const priorityItems: ProofRailItem[] = filteredVaults.slice(0, 3).map((vault) => ({
    id: vault.vaultAddress,
    title: `${vault.caseId}: ${vault.studentName}`,
    detail: vault.riskNote ?? vault.activeMilestone,
    meta: `${vault.country} / ${formatCurrency(Math.max(0, vault.targetAmount - vault.committed))} gap`,
    tone: vault.needScore >= 9 ? "warning" : "info",
  }));

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">Donor desk</span>
            <StatusPill tone="success">live mock API</StatusPill>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-6xl">
            Fund the next clear release, not the loudest story.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--text-muted)] md:text-lg md:leading-8">
            This desk prioritizes verified scholarship vaults by need, proof confidence,
            and funding gap. Every card opens into the same audit spine used by verifiers.
          </p>
        </div>

        <ProofRail
          title="Today's triage"
          items={
            priorityItems.length
              ? priorityItems
              : [
                  {
                    id: "loading",
                    title: isLoading ? "Loading verified vaults" : "No vaults match the filters",
                    detail: "Adjust search or need threshold to widen the desk.",
                    tone: "neutral",
                  },
                ]
          }
          compact
        />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <MetricBlock
          label="Visible vaults"
          value={isLoading ? "Loading" : String(filteredVaults.length)}
          detail="Vaults currently matching the desk filters."
        />
        <MetricBlock
          label="Committed here"
          value={formatCurrency(committed)}
          detail="Funds already assigned to this filtered operating view."
        />
        <MetricBlock
          label="Open gap"
          value={formatCurrency(openGap)}
          detail="Capital still needed to finish the displayed vault targets."
        />
      </section>

      <section className="surface rounded-[var(--radius-lg)] p-4 md:p-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_12rem_13rem]">
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
              Search case, country, field
            </span>
            <input
              className="field mt-2"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try Kenya, engineering, SC-2601"
              type="search"
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
              Minimum need
            </span>
            <select
              className="field mt-2"
              value={minimumNeed}
              onChange={(event) => setMinimumNeed(Number(event.target.value))}
            >
              <option value={0}>Any need</option>
              <option value={7}>7 and above</option>
              <option value={8}>8 and above</option>
              <option value={9}>9 and above</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
              Sort by
            </span>
            <select
              className="field mt-2"
              value={sort}
              onChange={(event) =>
                setSort(event.target.value as "priority" | "confidence" | "gap")
              }
            >
              <option value="priority">Operational priority</option>
              <option value="confidence">Proof confidence</option>
              <option value="gap">Funding gap</option>
            </select>
          </label>
        </div>
      </section>

      {error && (
        <div className="rounded-[var(--radius-md)] border border-[color:var(--danger)] p-4 text-sm text-[color:var(--danger)]">
          The donor desk could not load. Check the local API route and try again.
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredVaults.map((vault) => (
          <VaultCard key={vault.vaultAddress} {...vault} />
        ))}
      </section>

      {!isLoading && filteredVaults.length === 0 && (
        <section className="surface-soft rounded-[var(--radius-lg)] p-8">
          <h2 className="text-2xl font-semibold">No vaults in this view.</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[color:var(--text-muted)]">
            The filter set is too narrow. Widen the need threshold or search by a broader
            field such as country, discipline, or case ID.
          </p>
        </section>
      )}
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
