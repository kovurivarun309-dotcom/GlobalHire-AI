import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { loadPendingHiringInputs } from '../services/hiringProfile';

export default function Register() {
  const [f, setF] = useState({ fullName: '', email: '', password: '' }), [err, setErr] = useState('');
  const nav = useNavigate();
  async function s(e: FormEvent) {
    e.preventDefault(); setErr('');
    try { await api.post('/auth/register', f); nav(loadPendingHiringInputs() ? '/login?setup=1' : '/login'); }
    catch { setErr('Registration failed. Check the details and try again.'); }
  }
  return <div className="min-h-screen grid place-items-center bg-slate-50 p-5"><form onSubmit={s} className="card w-full max-w-md p-8 space-y-4"><b className="text-brand text-lg">GlobalTalentLens</b><h1 className="text-2xl font-bold">Create your account</h1>{loadPendingHiringInputs() && <p className="text-sm bg-violet-50 rounded-xl p-3 text-slate-600">Your hiring inputs will stay saved while you create your account.</p>}{Object.keys(f).map(k => <input key={k} className="input" type={k === 'password' ? 'password' : 'text'} placeholder={k === 'fullName' ? 'Full name' : k === 'email' ? 'Email' : 'Password'} value={(f as any)[k]} onChange={e => setF({ ...f, [k]: e.target.value })}/>) }{err && <p className="text-red-600 text-sm">{err}</p>}<button className="w-full gradient text-white rounded-xl p-3 font-semibold">Register</button><Link to="/login" className="text-brand text-sm">Already have an account?</Link></form></div>;
}
