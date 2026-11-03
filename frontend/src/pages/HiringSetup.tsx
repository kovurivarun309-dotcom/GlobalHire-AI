
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Globe2, LockKeyhole, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import {
  HiringProfile,
  loadHiringProfile,
  loadPendingHiringInputs,
  profileCurrency,
  saveHiringProfile,
} from '../services/hiringProfile';

type Props = { onComplete: (profile: HiringProfile) => void };

const fallbackCountries = [
  'Australia', 'Brazil', 'Canada', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'India', 'Indonesia',
  'Ireland', 'Italy', 'Japan', 'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Philippines', 'Poland', 'Portugal',
  'Singapore', 'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland', 'United Arab Emirates', 'United Kingdom', 'United States', 'Vietnam'
];

const emptyForm = {
  companyCountry: 'Singapore',
  hiringCountry: 'India',
  comparisonCountry: '',
  annualSalary: 80000,
  employees: 1,
  jobRole: 'Software Engineer',
  experience: 3,
  employmentType: 'FULL_TIME',
  workMode: 'REMOTE',
  benefits: 10,
  visaRequired: false,
  sponsorship: false,
};

export default function HiringSetup({ onComplete }: Props) {
  const [countries, setCountries] = useState<any[]>([]);
  const [form, setForm] = useState<any>(emptyForm);
  const [showCompare, setShowCompare] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/countries')
      .then((r) => setCountries(r.data))
      .catch(() => setCountries(fallbackCountries.map((name) => ({ name }))));

    const existing = loadHiringProfile();
    const pending = loadPendingHiringInputs();

    if (existing) setForm({ ...emptyForm, ...existing });
    else if (pending) setForm({ ...emptyForm, ...pending });

    if (pending?.comparisonCountry) setShowCompare(true);
  }, []);

  const countryNames = useMemo(() => {
    const names = countries.map((x) => x.name).filter(Boolean);
    return names.length ? names : fallbackCountries;
  }, [countries]);

  const companyCurrency = profileCurrency(countries, form.companyCountry);

  const update = (key: string, value: any) =>
    setForm((old: any) => ({ ...old, [key]: value }));

  function submit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.companyCountry || !form.hiringCountry || !form.jobRole) {
      setError('Please complete the company country, hiring country, and job role.');
      return;
    }

    if (Number(form.annualSalary) <= 0 || Number(form.employees) <= 0) {
      setError('Salary and employee count must be greater than zero.');
      return;
    }

    setSaving(true);

    const profile: HiringProfile = {
      companyCountry: form.companyCountry,
      hiringCountry: form.hiringCountry,
      comparisonCountry: showCompare ? form.comparisonCountry || undefined : undefined,
      annualSalary: Number(form.annualSalary),
      employees: Number(form.employees),
      jobRole: form.jobRole,
      experience: Number(form.experience),
      employmentType: form.employmentType,
      workMode: form.workMode,
      benefits: Number(form.benefits),
      visaRequired: Boolean(form.visaRequired),
      sponsorship: Boolean(form.sponsorship),
      submittedAt: new Date().toISOString(),
    };

    saveHiringProfile(profile);
    setTimeout(() => onComplete(profile), 250);
  }

  return (
    <div className="relative z-30 max-w-5xl mx-auto">
      <div className="card overflow-hidden border-violet-200 shadow-2xl shadow-violet-100">
        <div className="px-6 md:px-8 pt-7 pb-5 bg-gradient-to-r from-violet-50 via-white to-blue-50 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-100 grid place-items-center text-brand">
              <LockKeyhole size={20} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand">
                Workspace setup
              </p>
              <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
                Tell us about your hiring scenario
              </h1>
            </div>
          </div>
          <p className="text-slate-600 mt-3 max-w-3xl">
            Submit these inputs first. GlobalTalentLens will use them across the dashboard,
            cost calculator, country comparison, AI predictions, compliance and reports.
          </p>
        </div>

        <form onSubmit={submit} className="p-6 md:p-8 space-y-7">
          <section>
            <div className="flex items-center gap-2 text-brand font-bold mb-3">
              <Globe2 size={18} /> Hiring inputs
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <Field label="STEP 1 · Where is your company based?">
                <select
                  value={form.companyCountry}
                  onChange={(e) => update('companyCountry', e.target.value)}
                  className="input"
                >
                  {countryNames.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                <p className="hint">
                  Your employer-side location and salary currency context.
                </p>
              </Field>

              <Field label="STEP 2 · Where do you want to hire?">
                <select
                  value={form.hiringCountry}
                  onChange={(e) => update('hiringCountry', e.target.value)}
                  className="input"
                >
                  {countryNames.map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
                <p className="hint">
                  The primary market used throughout your workspace.
                </p>
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-5">
              <Field label={`STEP 3 · Annual base salary (${companyCurrency})`}>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400">
                    {companyCurrency}
                  </span>
                  <input
                    className="input pl-12"
                    type="number"
                    min="1"
                    value={form.annualSalary}
                    onChange={(e) => update('annualSalary', e.target.value)}
                  />
                </div>
                <p className="hint">
                  Enter the annualised base salary before additional statutory payments.
                </p>
              </Field>

              <Field label="Number of employees">
                <input
                  className="input"
                  type="number"
                  min="1"
                  value={form.employees}
                  onChange={(e) => update('employees', e.target.value)}
                />
                <p className="hint">
                  Used by the hiring-cost and workforce scenario calculations.
                </p>
              </Field>
            </div>

            <button
              type="button"
              onClick={() => setShowCompare((v) => !v)}
              className="mt-5 inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold"
            >
              <span className="text-lg">+</span>
              {showCompare ? 'Remove comparison country' : 'Compare with another country'}
            </button>

            {showCompare && (
              <div className="mt-4 max-w-xl">
                <Field label="Comparison country">
                  <select
                    value={form.comparisonCountry || ''}
                    onChange={(e) => update('comparisonCountry', e.target.value)}
                    className="input"
                  >
                    <option value="">Select a country</option>
                    {countryNames
                      .filter((x) => x !== form.hiringCountry)
                      .map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                  </select>
                </Field>
              </div>
            )}
          </section>

          <section className="border-t pt-7">
            <div className="flex items-center gap-2 text-brand font-bold mb-4">
              <Sparkles size={18} /> Scenario details
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              <Field label="Job role">
                <input
                  className="input"
                  value={form.jobRole}
                  onChange={(e) => update('jobRole', e.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </Field>

              <Field label="Experience (years)">
                <input
                  className="input"
                  type="number"
                  min="0"
                  value={form.experience}
                  onChange={(e) => update('experience', e.target.value)}
                />
              </Field>

              <Field label="Employment type">
                <select
                  className="input"
                  value={form.employmentType}
                  onChange={(e) => update('employmentType', e.target.value)}
                >
                  <option value="FULL_TIME">Full time</option>
                  <option value="PART_TIME">Part time</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </Field>

              <Field label="Work mode">
                <select
                  className="input"
                  value={form.workMode}
                  onChange={(e) => update('workMode', e.target.value)}
                >
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">On-site</option>
                </select>
              </Field>

              <Field label="Benefits budget (%)">
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="100"
                  value={form.benefits}
                  onChange={(e) => update('benefits', e.target.value)}
                />
              </Field>

              <div className="space-y-3 pt-1">
                <Check
                  label="Visa required"
                  checked={form.visaRequired}
                  onChange={(v: boolean) => update('visaRequired', v)}
                />
                <Check
                  label="Employer sponsorship"
                  checked={form.sponsorship}
                  onChange={(v: boolean) => update('sponsorship', v)}
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-2xl bg-slate-50 border p-5">
            <div>
              <p className="font-bold">Ready to unlock your workspace?</p>
              <p className="text-sm text-slate-500 mt-1">
                Your submitted scenario becomes the default context for every feature.
              </p>
            </div>
            <button
              disabled={saving}
              className="gradient text-white rounded-xl px-7 py-3.5 font-bold disabled:opacity-60"
            >
              {saving ? 'Saving scenario…' : 'Submit & unlock workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: any) {
  return (
    <label className="block text-sm font-semibold text-slate-700">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 text-sm font-medium">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-violet-600"
      />
      {label}
    </label>
  );
}
