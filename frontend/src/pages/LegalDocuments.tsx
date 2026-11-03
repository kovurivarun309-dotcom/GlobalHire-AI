import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { ExternalLink, FileText, Search, ShieldCheck } from 'lucide-react';

type LegalDocument = {
  id: number; countryCode: string; countryName: string; category: string;
  documentTitle: string; jurisdiction?: string; issuingAuthority?: string;
  officialUrl?: string; sourcePortal?: string; documentStatus?: string;
  effectiveDate?: string; summary?: string; notes?: string;
};

const flags: Record<string,string> = {
  IN:'🇮🇳', SG:'🇸🇬', US:'🇺🇸', GB:'🇬🇧', DE:'🇩🇪', FR:'🇫🇷', AU:'🇦🇺',
  CA:'🇨🇦', JP:'🇯🇵', KR:'🇰🇷', PL:'🇵🇱', NL:'🇳🇱', EE:'🇪🇪', FI:'🇫🇮',
  DK:'🇩🇰', SE:'🇸🇪', NO:'🇳🇴', IE:'🇮🇪', PT:'🇵🇹', ES:'🇪🇸', BR:'🇧🇷',
  MX:'🇲🇽', AE:'🇦🇪', SA:'🇸🇦', ZA:'🇿🇦', NZ:'🇳🇿', VN:'🇻🇳', PH:'🇵🇭',
  MY:'🇲🇾', ID:'🇮🇩'
};

export default function LegalDocuments() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [countries, setCountries] = useState<{code:string;name:string}[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/legal-documents'),
      api.get('/legal-documents/countries'),
      api.get('/legal-documents/categories')
    ]).then(([docs, cs, cats]) => {
      setDocuments(docs.data); setCountries(cs.data); setCategories(cats.data);
    }).catch(() => setError('Could not load legal documents. Check that the SQL migration has been executed and the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => documents.filter(d =>
    (!country || d.countryCode === country) &&
    (!category || d.category === category) &&
    (!query || [d.documentTitle,d.countryName,d.category,d.summary].join(' ').toLowerCase().includes(query.toLowerCase()))
  ), [documents,country,category,query]);

  return <div className="space-y-6">
    <div>
      <div className="flex items-center gap-2 text-violet-700 font-semibold"><ShieldCheck size={19}/> Legal intelligence</div>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">Global employment legal documents</h1>
      <p className="text-slate-500 mt-2">Browse legislation references for the 30 countries in your GlobalTalentLens dataset.</p>
    </div>

    <div className="grid sm:grid-cols-3 gap-3">
      <div className="card p-4"><p className="text-sm text-slate-500">Catalogue entries</p><p className="text-2xl font-bold mt-1">{documents.length}</p></div>
      <div className="card p-4"><p className="text-sm text-slate-500">Countries covered</p><p className="text-2xl font-bold mt-1">{countries.length}</p></div>
      <div className="card p-4"><p className="text-sm text-slate-500">Legal categories</p><p className="text-2xl font-bold mt-1">{categories.length}</p></div>
    </div>

    <div className="card p-4 grid md:grid-cols-3 gap-3">
      <label className="text-sm text-slate-600">Search legal documents
        <div className="relative mt-1"><Search size={17} className="absolute left-3 top-3 text-slate-400"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search law, country or keyword..." className="w-full border rounded-xl pl-9 pr-3 py-2.5"/></div>
      </label>
      <label className="text-sm text-slate-600">Country
        <select value={country} onChange={e=>setCountry(e.target.value)} className="w-full mt-1 border rounded-xl p-2.5 bg-white"><option value="">All countries</option>{countries.map(c=><option key={c.code} value={c.code}>{c.name}</option>)}</select>
      </label>
      <label className="text-sm text-slate-600">Legal category
        <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full mt-1 border rounded-xl p-2.5 bg-white"><option value="">All categories</option>{categories.map(c=><option key={c}>{c}</option>)}</select>
      </label>
    </div>

    {error && <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800 text-sm">{error}</div>}
    {loading ? <div className="card p-8 text-center text-slate-500">Loading legal catalogue...</div> :
      <div className="space-y-3">
        <p className="text-sm text-slate-500">Showing {filtered.length} of {documents.length} references</p>
        {filtered.map(d=><article key={d.id} className="card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500"><span>{flags[d.countryCode] || '🌐'} {d.countryName}</span><span>·</span><span>{d.category}</span></div>
              <h2 className="font-bold text-lg text-slate-900 mt-2">{d.documentTitle}</h2>
              <p className="text-sm text-slate-500 mt-1">{d.jurisdiction}</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">Source verification required</span>
          </div>
          <p className="text-sm text-slate-600 mt-3">{d.summary}</p>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t">
            <span className="text-xs text-slate-500">Authority: {d.issuingAuthority || 'Official government source'}</span>
            {d.officialUrl && <a href={d.officialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700 hover:underline">Open official source <ExternalLink size={14}/></a>}
          </div>
        </article>)}
        {!filtered.length && !error && <div className="card p-10 text-center text-slate-500"><FileText className="mx-auto mb-2"/>No legal references match these filters.</div>}
      </div>
    }
    <div className="rounded-xl bg-slate-100 p-4 text-xs leading-5 text-slate-600">
      <b>Legal data quality notice:</b> This is an initial legislation discovery catalogue, not a verified legal opinion or a complete repository of consolidated laws. Confirm current wording, commencement dates, amendments, territorial coverage, collective agreements and applicability with the official authority or qualified local counsel before using a rule for hiring decisions.
    </div>
  </div>;
}
