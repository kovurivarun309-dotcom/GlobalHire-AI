import {
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";

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
} from "lucide-react";

import { useState } from "react";

import Dashboard from "./pages/Dashboard";
import Countries from "./pages/Countries";
import CalculatorPage from "./pages/Calculator";
import Compare from "./pages/Compare";
import AI from "./pages/AI";
import Decision from "./pages/Decision";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import CountryDetails from "./pages/CountryDetails";
import Reports from "./pages/Reports";

const nav = [
  ["/app", "Dashboard", LayoutDashboard],
  ["/app/countries", "Global Hiring", Globe2],
  ["/app/calculator", "Cost Calculator", Calculator],
  ["/app/compare", "Compare", Scale],
  ["/app/ai", "AI Predictions", Brain],
  ["/app/decision", "Decision Support", ShieldCheck],
  ["/app/reports", "Reports", FileText],
] as const;

function Shell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-[#f7f8fc]">
      <aside
        className={`${menuOpen ? "block" : "hidden"} md:block w-64 bg-white border-r fixed h-full z-20`}
      >
        <div className="p-6 text-xl font-extrabold text-brand">
          GlobalTalentLens
        </div>

        <nav className="px-3 space-y-1">
          {nav.map(([path, name, Icon]) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                location.pathname === path
                  ? "bg-violet-50 text-brand"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={18} />
              {name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="w-full flex gap-2 items-center px-4 py-3 text-slate-500"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="md:ml-64 flex-1">
        <header className="sticky top-0 z-10 bg-white/85 backdrop-blur border-b px-4 md:px-8 py-4 flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Menu />
          </button>

          <div className="font-semibold">
            {nav.find((item) => item[0] === location.pathname)?.[1] ||
              "GlobalTalentLens"}
          </div>

          <div className="ml-auto text-sm text-slate-500">
            Decision intelligence for global hiring
          </div>
        </header>

        <div className="p-4 md:p-8">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="countries" element={<Countries />} />
            <Route path="countries/:id" element={<CountryDetails />} />
            <Route path="calculator" element={<CalculatorPage />} />
            <Route path="compare" element={<Compare />} />
            <Route path="ai" element={<AI />} />
            <Route path="decision" element={<Decision />} />
            <Route path="reports" element={<Reports />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/countries" element={<Countries />} />
      <Route path="/countries/:id" element={<CountryDetails />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Application */}
      <Route path="/app/*" element={<Shell />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}