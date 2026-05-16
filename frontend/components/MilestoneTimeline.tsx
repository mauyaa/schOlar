import { formatCurrency, formatDate } from "../lib/format";
import { StatusPill } from "./StatusPill";

type Milestone = {
  id: number;
  description: string;
  tuitionAmount: string;
  stipendAmount: string;
  status: "Pending" | "Approved" | "Paid" | "Revoked";
  dueDate?: string;
  proof?: string;
};

const statusTone = {
  Paid: "success",
  Approved: "info",
  Pending: "warning",
  Revoked: "danger",
} as const;

export function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="divide-y divide-[color:var(--line)] overflow-hidden rounded-[var(--radius-lg)] border border-[color:var(--line)]">
      {milestones.map((milestone) => {
        const total =
          Number(milestone.tuitionAmount || 0) + Number(milestone.stipendAmount || 0);
        return (
          <article
            key={milestone.id}
            className="grid gap-4 bg-[color:var(--background-raised)] p-4 md:grid-cols-[8rem_1fr_auto] md:items-start md:p-5"
          >
            <div>
              <div className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[color:var(--text-soft)]">
                Milestone {milestone.id + 1}
              </div>
              <div className="mt-2 text-sm text-[color:var(--text-muted)]">
                {formatDate(milestone.dueDate)}
              </div>
            </div>
            <div>
              <h3 className="text-base font-semibold text-[color:var(--text)]">
                {milestone.description}
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--text-muted)]">
                {milestone.proof ?? "Verifier proof will appear here when this milestone is reviewed."}
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 text-sm md:max-w-md">
                <div>
                  <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                    Tuition
                  </dt>
                  <dd className="mt-1 text-[color:var(--text)]">
                    {formatCurrency(Number(milestone.tuitionAmount))}
                  </dd>
                </div>
                <div>
                  <dt className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                    Stipend
                  </dt>
                  <dd className="mt-1 text-[color:var(--text)]">
                    {formatCurrency(Number(milestone.stipendAmount))}
                  </dd>
                </div>
              </dl>
            </div>
            <div className="flex items-center justify-between gap-3 md:flex-col md:items-end">
              <StatusPill tone={statusTone[milestone.status]}>
                {milestone.status}
              </StatusPill>
              <div className="text-sm font-semibold text-[color:var(--text)]">
                {formatCurrency(total)}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
