import { useState } from "react";
import { MetricBlock } from "../../components/MetricBlock";
import { ProofRail } from "../../components/ProofRail";
import { StatusPill } from "../../components/StatusPill";
import { useWallet } from "../../components/WalletProvider";
import { formatCurrency } from "../../lib/format";
import { postJSON } from "../../lib/api";

type FormState = {
  name: string;
  country: string;
  field: string;
  institution: string;
  impactStory: string;
  requestedAmount: number;
  needLevel: number;
};

const initialForm: FormState = {
  name: "",
  country: "",
  field: "",
  institution: "",
  impactStory: "",
  requestedAmount: 12000,
  needLevel: 7,
};

export default function Apply() {
  const { address, connect } = useWallet();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setSubmitted(false);

    try {
      await postJSON("/api/students", {
        ...form,
        address: address ?? undefined,
      });
      setSubmitted(true);
      setForm(initialForm);
      setMessage("Application received. Verification can now review the record.");
    } catch (error) {
      console.error(error);
      setMessage("The application could not be submitted. Check the fields and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow">Student intake</span>
            <StatusPill tone={address ? "success" : "warning"}>
              {address ? "wallet linked" : "wallet optional"}
            </StatusPill>
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[0.98] tracking-[-0.04em] md:text-6xl">
            Apply with the evidence a verifier needs on day one.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--text-muted)] md:text-lg md:leading-8">
            A ScOlar application is short by design. It captures the learner, the
            institution, the funding target, and the reason a milestone vault should exist.
          </p>
        </div>

        <ProofRail
          title="What happens after submit"
          items={[
            {
              id: "record",
              title: "Application record opens",
              detail: "Your profile enters the verification queue with a wallet if connected.",
              tone: "info",
            },
            {
              id: "review",
              title: "Verifier checks proof",
              detail: "Institution, need level, and learning objective are reviewed together.",
              tone: "warning",
            },
            {
              id: "vault",
              title: "Vault is created",
              detail: "Approved applications become milestone vaults that donors can fund.",
              tone: "success",
            },
          ]}
          compact
        />
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <MetricBlock label="Form intent" value="6 fields" detail="Enough to start review without burying the student." />
        <MetricBlock label="Need signal" value={`${form.needLevel}/10`} detail="Used for donor triage, not automatic approval." />
        <MetricBlock label="Request" value={formatCurrency(form.requestedAmount)} detail="A target for review before a vault is opened." />
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <form className="surface rounded-[var(--radius-lg)] p-5 md:p-7" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                Full name
              </span>
              <input
                className="field mt-2"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                Country
              </span>
              <input
                className="field mt-2"
                value={form.country}
                onChange={(event) => setForm({ ...form, country: event.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                Field of study
              </span>
              <input
                className="field mt-2"
                value={form.field}
                onChange={(event) => setForm({ ...form, field: event.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                Institution
              </span>
              <input
                className="field mt-2"
                value={form.institution}
                onChange={(event) => setForm({ ...form, institution: event.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                Requested amount
              </span>
              <input
                className="field mt-2"
                min={1}
                value={form.requestedAmount}
                onChange={(event) =>
                  setForm({ ...form, requestedAmount: Number(event.target.value) })
                }
                type="number"
                required
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                Need level
              </span>
              <select
                className="field mt-2"
                value={form.needLevel}
                onChange={(event) => setForm({ ...form, needLevel: Number(event.target.value) })}
              >
                {[5, 6, 7, 8, 9, 10].map((level) => (
                  <option key={level} value={level}>
                    {level}/10
                  </option>
                ))}
              </select>
            </label>
            <label className="block md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                Impact story
              </span>
              <textarea
                className="field mt-2 min-h-40 resize-y"
                value={form.impactStory}
                onChange={(event) => setForm({ ...form, impactStory: event.target.value })}
                placeholder="State the work this scholarship makes possible. Keep it concrete."
                required
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-[color:var(--line)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[color:var(--text-muted)]">
              {address ? "Wallet will be attached to this application." : "Connect a wallet now or submit without one."}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {!address && (
                <button type="button" onClick={connect} className="btn-secondary">
                  Connect wallet
                </button>
              )}
              <button disabled={loading} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? "Submitting" : "Submit application"}
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`mt-5 rounded-[var(--radius-md)] border p-4 text-sm ${
                submitted
                  ? "border-[color:var(--success)] text-[color:var(--success)]"
                  : "border-[color:var(--danger)] text-[color:var(--danger)]"
              }`}
              role="status"
            >
              {message}
            </div>
          )}
        </form>

        <aside className="surface-soft rounded-[var(--radius-lg)] p-5">
          <span className="eyebrow">Application preview</span>
          <div className="mt-5 space-y-5">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                Learner
              </div>
              <p className="mt-2 text-xl font-semibold">
                {form.name || "Unnamed applicant"}
              </p>
              <p className="mt-1 text-sm text-[color:var(--text-muted)]">
                {form.field || "Field"} / {form.country || "Country"}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                Institution
              </div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
                {form.institution || "Institution will appear here."}
              </p>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-[color:var(--text-soft)]">
                Review note
              </div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--text-muted)]">
                {form.impactStory || "The verifier needs a specific learning outcome and a clear reason funding matters now."}
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
