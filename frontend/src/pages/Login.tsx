import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { api } from '../services/api';
import { loadHiringProfile, loadPendingHiringInputs } from '../services/hiringProfile';

export default function Login() {
  const [e, setE] = useState('hr@globalhire.local');
  const [p, setP] = useState('HrManager@123');
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const location = useLocation();
  const hasPending = Boolean(loadPendingHiringInputs());
  const setupRequested = new URLSearchParams(location.search).get('setup') === '1';

  async function submit(x: FormEvent) {
    x.preventDefault(); setErr('');
    try {
      const r = await api.post('/auth/login', { email: e, password: p });
      localStorage.setItem('token', r.data.token);
      nav(loadHiringProfile() || hasPending || setupRequested ? '/app' : '/app');
    } catch { setErr('Invalid credentials or server unavailable.'); }
  }

  return <Auth title="Welcome back">
    {(hasPending || setupRequested) && <div className="mb-5 rounded-xl bg-violet-50 border border-violet-100 p-4 flex gap-3"><LockKeyhole className="text-brand shrink-0" size={18}/><div><p className="font-semibold text-slate-800">Your hiring scenario is waiting</p><p className="text-sm text-slate-600 mt-1">Sign in to complete the final setup step and unlock your GlobalTalentLens workspace.</p></div></div>}
    <form onSubmit={submit} className="space-y-4"><input className="input" value={e} onChange={x => setE(x.target.value)} placeholder="Email"/><input className="input" value={p} onChange={x => setP(x.target.value)} type="password" placeholder="Password"/>{err && <p className="text-red-600 text-sm">{err}</p>}<button className="w-full gradient text-white rounded-xl p-3 font-semibold">Sign in</button><Link className="text-brand text-sm" to="/register">Create account</Link></form>
  </Auth>;
}
function Auth({ title, children }: any) { return <div className="min-h-screen grid place-items-center bg-slate-50 p-5"><div className="card w-full max-w-md p-8"><div className="text-brand font-bold text-lg">GlobalTalentLens</div><h1 className="text-2xl font-bold mt-6 mb-6">{title}</h1>{children}</div></div>; }
