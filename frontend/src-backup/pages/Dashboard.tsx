import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Globe2,
  Calculator,
  Brain,
  ShieldCheck,
  ArrowRight,
  Users,
  DollarSign,
  Lightbulb,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";

import { api } from "../services/api";

type Country = {
  id: number;
  name: string;
  code?: string;
  currency?: string;
  averageSalary?: number;
  minimumWage?: number;
  employerTax?: number;
  socialSecurity?: number;
  talentAvailability?: number;
  talentAffordability?: number;
  digitalInfrastructure?: number;
  innovation?: number;
  complianceScore?: number;
  dataStatus?: string;
};

function number(value: any) {
  const n = Number(value);

  if (!Number.isFinite(n)) {
    return 0;
  }

  return n;
}

function formatNumber(value: any) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(number(value));
}

function shortNumber(value: any) {
  const n = number(value);

  if (n >= 10000000) {
    return `${(n / 10000000).toFixed(1)}Cr`;
  }

  if (n >= 100000) {
    return `${(n / 100000).toFixed(1)}L`;
  }

  if (n >= 1000) {
    return `${(n / 1000).toFixed(0)}K`;
  }

  return `${n}`;
}

export default function Dashboard() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/countries");

        setCountries(Array.isArray(response.data) ? response.data : []);
      } catch (err: any) {
        console.error("Dashboard loading failed:", err);

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const statistics = useMemo(() => {
    if (!countries.length) {
      return {
        averageSalary: 0,
        talent: 0,
        innovation: 0,
        compliance: 0,
      };
    }

    const salary =
      countries.reduce(
        (sum, country) => sum + number(country.averageSalary),
        0
      ) / countries.length;

    const talent =
      countries.reduce(
        (sum, country) => sum + number(country.talentAvailability),
        0
      ) / countries.length;

    const innovation =
      countries.reduce(
        (sum, country) => sum + number(country.innovation),
        0
      ) / countries.length;

    const compliance =
      countries.reduce(
        (sum, country) => sum + number(country.complianceScore),
        0
      ) / countries.length;

    return {
      averageSalary: salary,
      talent,
      innovation,
      compliance,
    };
  }, [countries]);

  const salaryData = useMemo(() => {
    return [...countries]
      .sort(
        (a, b) =>
          number(b.averageSalary) - number(a.averageSalary)
      )
      .slice(0, 10)
      .map((country) => ({
        name:
          country.name.length > 13
            ? `${country.name.substring(0, 13)}...`
            : country.name,
        salary: number(country.averageSalary),
      }));
  }, [countries]);

  const talentData = useMemo(() => {
    return [...countries]
      .sort(
        (a, b) =>
          number(b.talentAvailability) -
          number(a.talentAvailability)
      )
      .slice(0, 10)
      .map((country) => ({
        name:
          country.name.length > 13
            ? `${country.name.substring(0, 13)}...`
            : country.name,
        talent: number(country.talentAvailability),
        innovation: number(country.innovation),
      }));
  }, [countries]);

  const complianceData = useMemo(() => {
    return [...countries]
      .sort(
        (a, b) =>
          number(b.complianceScore) -
          number(a.complianceScore)
      )
      .slice(0, 10)
      .map((country) => ({
        name:
          country.name.length > 13
            ? `${country.name.substring(0, 13)}...`
            : country.name,
        compliance: number(country.complianceScore),
      }));
  }, [countries]);

  const topMarkets = useMemo(() => {
    return [...countries]
      .sort(
        (a, b) =>
          number(b.talentAvailability) +
          number(b.innovation) -
          (number(a.talentAvailability) +
            number(a.innovation))
      )
      .slice(0, 5);
  }, [countries]);

  if (loading) {
    return (
      <div className="space-y-7">
        <div>
          <div className="w-72 h-9 bg-slate-200 rounded-lg animate-pulse" />
          <div className="w-96 h-5 bg-slate-100 rounded mt-3 animate-pulse" />
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="card p-6 h-32 animate-pulse"
            >
              <div className="w-10 h-10 bg-slate-100 rounded-xl" />
              <div className="w-28 h-4 bg-slate-100 rounded mt-4" />
              <div className="w-20 h-6 bg-slate-100 rounded mt-2" />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card h-96 animate-pulse bg-white" />
          <div className="card h-96 animate-pulse bg-white" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Global hiring dashboard
          </h1>

          <p className="text-slate-500 mt-1">
            A live workspace for comparing markets and workforce scenarios.
          </p>
        </div>

        <div className="card border border-red-200 bg-red-50 p-6 text-red-700">
          <div className="flex items-center gap-3">
            <AlertTriangle size={22} />

            <div>
              <h2 className="font-bold">
                Dashboard data unavailable
              </h2>

              <p className="text-sm mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient flex items-center justify-center">
              <BarChart3
                size={25}
                className="text-white"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Global hiring dashboard
              </h1>

              <p className="text-slate-500 mt-1">
                Analyze global talent, salary, innovation, and compliance signals.
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-slate-500">
          {countries.length} countries available
        </div>
      </div>

      {/* DATA NOTICE */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
        <AlertTriangle
          size={20}
          className="text-amber-600 mt-0.5"
        />

        <div>
          <p className="font-semibold text-amber-900">
            Demonstration dataset
          </p>

          <p className="text-sm text-amber-800 mt-1">
            Country metrics are demonstration seed data unless a source is
            explicitly shown. Verify legal, tax, immigration, and employment
            information before making real hiring decisions.
          </p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <StatCard
          icon={<Globe2 size={21} />}
          title="Countries analyzed"
          value={countries.length}
          description="Markets available"
        />

        <StatCard
          icon={<DollarSign size={21} />}
          title="Average salary"
          value={formatNumber(statistics.averageSalary)}
          description="Across available countries"
        />

        <StatCard
          icon={<Users size={21} />}
          title="Avg talent availability"
          value={`${statistics.talent.toFixed(1)}/100`}
          description="Talent supply indicator"
        />

        <StatCard
          icon={<ShieldCheck size={21} />}
          title="Avg compliance score"
          value={`${statistics.compliance.toFixed(1)}/100`}
          description="Compliance context indicator"
        />

      </div>

      {/* SECONDARY KPI ROW */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <MiniMetric
          icon={<Lightbulb size={19} />}
          title="Innovation"
          value={`${statistics.innovation.toFixed(1)}/100`}
        />

        <MiniMetric
          icon={<TrendingUp size={19} />}
          title="Top talent market"
          value={topMarkets[0]?.name || "—"}
        />

        <MiniMetric
          icon={<Brain size={19} />}
          title="AI predictions"
          value="5 models"
        />

        <MiniMetric
          icon={<Calculator size={19} />}
          title="Cost calculator"
          value="Available"
        />

      </div>

      {/* CHART ROW 1 */}
      <div className="grid xl:grid-cols-2 gap-6">

        {/* SALARY CHART */}
        <div className="card p-6 bg-white">

          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Average salary by market
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Top 10 countries by seeded average salary.
              </p>
            </div>

            <DollarSign
              size={20}
              className="text-brand"
            />
          </div>

          <div className="h-[360px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={salaryData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 35,
                  bottom: 60,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={70}
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  width={70}
                  tick={{
                    fontSize: 12,
                  }}
                  tickFormatter={(value) =>
                    shortNumber(value)
                  }
                />

                <Tooltip
                  formatter={(value: any) => [
                    formatNumber(value),
                    "Average salary",
                  ]}
                />

                <Bar
                  dataKey="salary"
                  fill="#6d4aff"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TALENT / INNOVATION */}
        <div className="card p-6 bg-white">

          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Talent & innovation
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Comparison of two workforce indicators.
              </p>
            </div>

            <Users
              size={20}
              className="text-brand"
            />
          </div>

          <div className="h-[360px] w-full">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={talentData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 15,
                  bottom: 60,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={70}
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  domain={[0, 100]}
                  width={45}
                  tick={{
                    fontSize: 12,
                  }}
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="talent"
                  name="Talent"
                  fill="#7c3aed"
                  radius={[5, 5, 0, 0]}
                />

                <Bar
                  dataKey="innovation"
                  name="Innovation"
                  fill="#3b82f6"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* CHART ROW 2 */}
      <div className="grid xl:grid-cols-2 gap-6">

        {/* COMPLIANCE */}
        <div className="card p-6 bg-white">

          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Compliance context
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Seeded compliance indicators across selected markets.
              </p>
            </div>

            <ShieldCheck
              size={20}
              className="text-brand"
            />
          </div>

          <div className="h-[330px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <AreaChart
                data={complianceData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 50,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                  height={65}
                  tick={{
                    fontSize: 12,
                  }}
                />

                <YAxis
                  domain={[0, 100]}
                  width={45}
                />

                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="compliance"
                  name="Compliance"
                  fill="#8b5cf6"
                  stroke="#6d4aff"
                  fillOpacity={0.18}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TOP MARKETS */}
        <div className="card p-6 bg-white">

          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Market overview
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Countries with strong combined talent and innovation signals.
              </p>
            </div>

            <Globe2
              size={20}
              className="text-brand"
            />
          </div>

          <div className="space-y-3">
            {topMarkets.map((country, index) => {
              const talent = number(
                country.talentAvailability
              );

              const innovation = number(
                country.innovation
              );

              const combined =
                (talent + innovation) / 2;

              return (
                <Link
                  key={country.id}
                  to={`/app/countries/${country.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-violet-50 transition"
                >
                  <div className="w-9 h-9 rounded-xl bg-white border flex items-center justify-center font-bold text-brand">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900">
                      {country.name}
                    </div>

                    <div className="text-xs text-slate-500 mt-1">
                      Talent {talent} · Innovation {innovation}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold text-slate-900">
                      {combined.toFixed(1)}
                    </div>

                    <div className="text-xs text-slate-400">
                      indicator
                    </div>
                  </div>

                  <ArrowRight
                    size={17}
                    className="text-slate-400"
                  />
                </Link>
              );
            })}
          </div>

        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Quick actions
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Jump directly into the main decision-support tools.
        </p>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-5">

          <QuickAction
            to="/app/countries"
            icon={<Globe2 size={22} />}
            title="Explore countries"
            description="Review salary, talent, employment and legal context."
          />

          <QuickAction
            to="/app/calculator"
            icon={<Calculator size={22} />}
            title="Calculate hiring cost"
            description="Estimate employer-side annual and monthly hiring costs."
          />

          <QuickAction
            to="/app/ai"
            icon={<Brain size={22} />}
            title="Run AI prediction"
            description="Explore acceptance, hiring time, cost and retention models."
          />

          <QuickAction
            to="/app/decision"
            icon={<ShieldCheck size={22} />}
            title="Decision support"
            description="Configure priorities and compare hiring-market trade-offs."
          />

        </div>
      </div>

      {/* FOOTER NOTE */}
      <div className="text-sm text-slate-500 border-t pt-6">
        GlobalTalentLens provides decision-support information. Country,
        employment, tax, immigration, compliance, and legal information should
        be independently verified before real-world hiring decisions.
      </div>

    </div>
  );
}


/* =========================
   STAT CARD
========================= */

function StatCard({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
  description: string;
}) {
  return (
    <div className="card p-6 bg-white hover:shadow-md transition">

      <div className="flex items-start justify-between">

        <div className="w-11 h-11 rounded-xl bg-violet-50 text-brand flex items-center justify-center">
          {icon}
        </div>

        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
          LIVE
        </span>

      </div>

      <div className="text-sm text-slate-500 mt-5">
        {title}
      </div>

      <div className="text-2xl font-extrabold text-slate-900 mt-1">
        {value}
      </div>

      <div className="text-xs text-slate-400 mt-1">
        {description}
      </div>

    </div>
  );
}


/* =========================
   MINI METRIC
========================= */

function MiniMetric({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="card p-5 bg-white">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-slate-50 text-brand flex items-center justify-center">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="text-xs text-slate-500">
            {title}
          </div>

          <div className="font-bold text-slate-900 truncate">
            {value}
          </div>
        </div>

      </div>

    </div>
  );
}


/* =========================
   QUICK ACTION
========================= */

function QuickAction({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="card p-5 bg-white hover:-translate-y-1 hover:shadow-lg transition-all group"
    >

      <div className="flex items-start justify-between">

        <div className="w-11 h-11 rounded-xl gradient text-white flex items-center justify-center">
          {icon}
        </div>

        <ArrowRight
          size={18}
          className="text-slate-300 group-hover:text-brand transition"
        />

      </div>

      <h3 className="font-bold text-slate-900 mt-5">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mt-2 leading-6">
        {description}
      </p>

    </Link>
  );
}