import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Globe2,
  LayoutDashboard,
  Calculator,
  Scale,
  Brain,
  ShieldCheck,
  FileText,
  LogOut,
  Menu,
  LockKeyhole,
  ClipboardEdit,
  BookOpen
} from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';

import Dashboard from './pages/Dashboard';
import Countries from './pages/Countries';
import CalculatorPage from './pages/Calculator';
import Compare from './pages/Compare';
import AI from './pages/AI';
import Decision from './pages/Decision';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import CountryDetails from './pages/CountryDetails';
import Reports from './pages/Reports';
import HiringSetup from './pages/HiringSetup';
import LegalDocuments from './pages/LegalDocuments';

import {
  HiringProfile,
  loadHiringProfile
} from './services/hiringProfile';

const nav = [
  ['/app', 'Dashboard', LayoutDashboard],
  ['/app/countries', 'Global Hiring', Globe2],
  ['/app/setup', 'Hiring Details', ClipboardEdit],
  ['/app/calculator', 'Cost Calculator', Calculator],
  ['/app/compare', 'Compare', Scale],
  ['/app/ai', 'AI Predictions', Brain],
  ['/app/decision', 'Decision Support', ShieldCheck],
  ['/app/reports', 'Reports', FileText],
  ['/app/legal-documents', 'Legal Documents', BookOpen]
] as const;

function Protected({ children }: { children: ReactNode }) {
  return localStorage.getItem('token')
    ? children
    : <Navigate to="/login" replace />;
}

function Shell() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menu, setMenu] = useState(false);
  const [profile, setProfile] = useState<HiringProfile | null>(
    loadHiringProfile()
  );

  const locked = profile === null;

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleComplete = (newProfile: HiringProfile) => {
    setProfile(newProfile);
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-[#f7f8fc]">

      {/* SIDEBAR */}
      <aside
        className={`${menu ? 'block' : 'hidden'} md:block w-64 bg-white border-r fixed h-full z-40`}
      >

        <div className="p-6 text-xl font-extrabold text-brand">
          GlobalTalentLens
        </div>

        <nav className="px-3 space-y-1">

          {nav.map(([path, name, Icon]) => {

            const isSetup = path === '/app/setup';

            return (
              <Link
                key={path}
                to={locked && !isSetup ? '/app' : path}
                onClick={(e) => {
                  if (locked && !isSetup) {
                    e.preventDefault();
                  }
                  setMenu(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                  locked && !isSetup
                    ? 'text-slate-300 cursor-not-allowed'
                    : location.pathname === path
                      ? 'bg-violet-50 text-brand'
                      : 'text-slate-600 hover:bg-slate-50'
                }`}
              >

                <Icon size={18} />

                {name}

                {locked && !isSetup && (
                  <LockKeyhole
                    size={14}
                    className="ml-auto"
                  />
                )}

              </Link>
            );
          })}

        </nav>

        <div className="absolute bottom-5 left-5 right-5">

          <button
            onClick={logout}
            className="w-full flex gap-2 items-center px-4 py-3 text-slate-500"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="md:ml-64 flex-1">

        <header className="sticky top-0 z-20 bg-white/85 backdrop-blur border-b px-4 md:px-8 py-4 flex items-center gap-4">

          <button
            className="md:hidden"
            onClick={() => setMenu(!menu)}
          >
            <Menu />
          </button>

          <div className="font-semibold">
            {nav.find(x => x[0] === location.pathname)?.[1] || 'Workspace'}
          </div>

          <div className="ml-auto text-sm text-slate-500 hidden sm:block">
            Decision intelligence for global hiring
          </div>

        </header>

        <div className="relative min-h-[calc(100vh-73px)] p-4 md:p-8">

          {/* LOCKED BACKGROUND */}
          <div
            className={
              locked
                ? 'blur-md pointer-events-none select-none opacity-40'
                : ''
            }
          >

            <Routes>

              <Route
                index
                element={<Dashboard />}
              />

              <Route
                path="countries"
                element={<Countries />}
              />

              <Route
                path="countries/:id"
                element={<CountryDetails />}
              />

              <Route
                path="setup"
                element={
                  <HiringSetup
                    onComplete={handleComplete}
                  />
                }
              />

              <Route
                path="calculator"
                element={<CalculatorPage />}
              />

              <Route
                path="compare"
                element={<Compare />}
              />

              <Route
                path="ai"
                element={<AI />}
              />

              <Route
                path="decision"
                element={<Decision />}
              />

              <Route
                path="reports"
                element={<Reports />}
              />

              <Route
                path="legal-documents"
                element={<LegalDocuments />}
              />

            </Routes>

          </div>

          {/* LOCK OVERLAY */}
          {locked && (

            <div className="absolute inset-0 z-30 bg-slate-950/25 backdrop-blur-[2px] overflow-y-auto">

              <div className="min-h-full p-4 md:p-8 flex items-start justify-center">

                <div className="w-full max-w-5xl">

                  <div className="mb-5 text-center">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-lg border border-violet-100 text-violet-700 text-sm font-bold">

                      <LockKeyhole size={16} />

                      Workspace locked

                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-4 drop-shadow-lg">

                      Complete your hiring scenario to continue

                    </h2>

                    <p className="text-white/90 mt-2 max-w-2xl mx-auto drop-shadow">

                      Enter your hiring details below. These inputs will
                      become the context for your dashboard, calculator,
                      country analysis, AI predictions and reports.

                    </p>

                  </div>

                  <HiringSetup
                    onComplete={handleComplete}
                  />

                </div>

              </div>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Landing />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/app/*"
        element={
          <Protected>
            <Shell />
          </Protected>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>

  );
}