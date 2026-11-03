import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Globe2, Brain, Calculator, ShieldCheck, Plus, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { savePendingHiringInputs } from '../services/hiringProfile';

const fallbackCountries = ['Australia','Brazil','Canada','Denmark','Estonia','Finland','France','Germany','India','Indonesia','Ireland','Italy','Japan','Mexico','Netherlands','New Zealand','Norway','Philippines','Poland','Portugal','Singapore','South Africa','South Korea','Spain','Sweden','Switzerland','United Arab Emirates','United Kingdom','United States','Vietnam'];

const defaults = { companyCountry: 'Singapore', hiringCountry: 'India', comparisonCountry: '', annualSalary: 80000, employees: 1, jobRole: 'Software Engineer', experience: 3, employmentType: 'FULL_TIME', workMode: 'REMOTE', benefits: 10, visaRequired: false, sponsorship: false };

export default function Landing() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<any[]>([]);
  const [form, setForm] = useState<any>(defaults);
  const [compare, setCompare] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { api.get('/countries').then(r => setCountries(r.data)).catch(() => setCountries(fallbackCountries.map(name => ({ name })))); }, []);
  const names = useMemo(() => countries.length ? countries.map(x => x.name) : fallbackCountries, [countries]);
  const currency = countries.find(x => x.name === form.companyCountry)?.currencySymbol || countries.find(x => x.name === form.companyCountry)?.currency || '$';
  const update = (key: string, value: any) => setForm((x: any) => ({ ...x, [key]: value }));

  function submit(e: FormEvent) {
    e.preventDefault(); setError('');
    if (!form.companyCountry || !form.hiringCountry || !form.jobRole || Number(form.annualSalary) <= 0 || Number(form.employees) <= 0) { setError('Please complete the required hiring inputs before continuing.'); return; }
    savePendingHiringInputs({ ...form, annualSalary: Number(form.annualSalary), employees: Number(form.employees), comparisonCountry: compare ? form.comparisonCountry : undefined });
    navigate('/login?setup=1');
  }

  return <div className="min-h-screen bg-white">
    <nav className="h-20 flex items-center justify-between px-6 md:px-16 border-b bg-white/95 backdrop-blur sticky top-0 z-20"><b className="text-xl text-brand">GlobalTalentLens</b><div className="flex gap-3"><Link to="/login" className="px-4 py-2">Login</Link><button onClick={() => document.getElementById('hiring-inputs')?.scrollIntoView({ behavior: 'smooth' })} className="px-5 py-2 rounded-xl gradient text-white">Start analysis</button></div></nav>

    <section className="px-6 md:px-20 py-20 bg-gradient-to-br from-violet-50 via-white to-blue-50"><div className="max-w-5xl mx-auto text-center"><span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border text-sm text-brand"><Sparkles size={15}/> AI-powered workforce intelligence</span><h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mt-6">Make global hiring decisions with your scenario in context.</h1><p className="text-lg md:text-xl text-slate-600 mt-6 max-w-3xl mx-auto">Enter your hiring inputs first. Then GlobalTalentLens unlocks the dashboard, cost intelligence, country comparison, AI predictions, compliance context and reports around your scenario.</p></div></section>

    <section id="hiring-inputs" className="px-4 md:px-8 -mt-10 pb-14 relative z-10"><form onSubmit={submit} className="card max-w-6xl mx-auto overflow-hidden border-violet-100 shadow-2xl shadow-violet-100">
      <div className="px-6 md:px-8 py-6 border-b bg-white"><div className="flex items-center gap-3"><div className="h-10 w-10 rounded-xl bg-violet-100 grid place-items-center text-brand"><Calculator size={20}/></div><div><h2 className="text-xl md:text-2xl font-extrabold">Hiring inputs</h2><p className="text-sm text-slate-500 mt-1">Set the scenario that will power your entire workspace.</p></div></div></div>
      <div className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-6">
          <Field label="STEP 1 · Where is your company based?"><select className="input" value={form.companyCountry} onChange={e => update('companyCountry', e.target.value)}>{names.map(x => <option key={x}>{x}</option>)}</select><p className="hint">We'll use this as your employer-side context.</p></Field>
          <Field label="STEP 2 · Where do you want to hire?"><select className="input" value={form.hiringCountry} onChange={e => update('hiringCountry', e.target.value)}>{names.map(x => <option key={x}>{x}</option>)}</select><p className="hint">This becomes your primary hiring market.</p></Field>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Field label={`STEP 3 · Annual base salary (${currency})`}><div className="relative"><span className="absolute left-3 top-3 text-slate-400">{currency}</span><input className="input pl-12" type="number" min="1" value={form.annualSalary} onChange={e => update('annualSalary', e.target.value)}/></div><p className="hint">Annualised base salary before statutory additional payments.</p></Field>
          <Field label="Number of employees"><input className="input" type="number" min="1" value={form.employees} onChange={e => update('employees', e.target.value)}/><p className="hint">Used by cost and workforce scenario calculations.</p></Field>
        </div>
        <button type="button" onClick={() => setCompare(v => !v)} className="mt-5 inline-flex items-center gap-2 px-4 py-3 rounded-xl border bg-white font-semibold hover:bg-slate-50"><Plus size={18}/> {compare ? 'Remove comparison country' : 'Compare with another country'}</button>
        {compare && <div className="mt-4 max-w-xl"><Field label="Comparison country"><select className="input" value={form.comparisonCountry} onChange={e => update('comparisonCountry', e.target.value)}><option value="">Select a country</option>{names.filter(x => x !== form.hiringCountry).map(x => <option key={x}>{x}</option>)}</select></Field></div>}

        <div className="border-t mt-7 pt-7"><h3 className="font-bold text-brand mb-4">Scenario details</h3><div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5"><Field label="Job role"><input className="input" value={form.jobRole} onChange={e => update('jobRole', e.target.value)}/></Field><Field label="Experience (years)"><input className="input" type="number" min="0" value={form.experience} onChange={e => update('experience', e.target.value)}/></Field><Field label="Employment type"><select className="input" value={form.employmentType} onChange={e => update('employmentType', e.target.value)}><option value="FULL_TIME">Full time</option><option value="PART_TIME">Part time</option><option value="CONTRACT">Contract</option></select></Field><Field label="Work mode"><select className="input" value={form.workMode} onChange={e => update('workMode', e.target.value)}><option value="REMOTE">Remote</option><option value="HYBRID">Hybrid</option><option value="ONSITE">On-site</option></select></Field></div></div>
        {error && <div className="mt-5 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">{error}</div>}
        <div className="mt-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl bg-slate-50 border p-5"><div><p className="font-bold">Continue to your workspace</p><p className="text-sm text-slate-500 mt-1">Submit these inputs, then sign in. Your scenario will be ready for the final unlock step.</p></div><button className="gradient text-white rounded-xl px-7 py-3.5 font-bold flex items-center gap-2">Submit inputs <ArrowRight size={18}/></button></div>
      </div>
    </form></section>

    <section className="max-w-6xl mx-auto grid md:grid-cols-4 gap-5 px-6 pb-16"><Feature I={Globe2} t="Global market data" d="Explore country-level employment, talent and legal information."/><Feature I={Calculator} t="Cost intelligence" d="Calculate employer-side hiring costs with transparent formulas."/><Feature I={Brain} t="Predictive models" d="Estimate acceptance, hiring time, cost and retention."/><Feature I={ShieldCheck} t="Compliance context" d="Surface requirements and areas needing professional verification."/></section>
  </div>;
}
function Field({ label, children }: any) { return <label className="block text-sm font-semibold text-slate-700">{label}<div className="mt-1.5">{children}</div></label>; }
function Feature({ I, t, d }: any) { return <div className="card p-6"><I className="text-brand"/><h3 className="font-bold mt-4">{t}</h3><p className="text-sm text-slate-500 mt-2">{d}</p></div>; }
