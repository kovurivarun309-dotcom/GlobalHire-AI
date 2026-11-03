
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  LabelList
} from 'recharts';
import { loadHiringProfile } from '../services/hiringProfile';
import { api } from '../services/api';
import { Pencil, TrendingUp, Globe2, Clock, Users, ShieldCheck } from 'lucide-react';

const formatMoney = (value: number) =>
  '$' + value.toLocaleString('en-US', {
    maximumFractionDigits: 0
  });

export default function Dashboard() {
  const p = loadHiringProfile();

  const [d, setD] = useState<any>(null);
  const [cost, setCost] = useState<any>(null);

  useEffect(() => {
    api.get('/dashboard/summary')
      .then(r => setD(r.data))
      .catch(() => setD({
        countriesAnalyzed: 0,
        avgHiringCost: 0,
        avgHiringTime: 0,
        avgRetention: 0,
        avgAcceptance: 0,
        complianceAlerts: 0,
        countryCosts: []
      }));

    if (p) {
      api.post('/cost/calculate', {
        companyCountry: p.companyCountry,
        hiringCountry: p.hiringCountry,
        annualSalary: p.annualSalary,
        employees: p.employees,
        employmentType: p.employmentType,
        benefits: p.benefits,
        visaRequired: p.visaRequired,
        relocationCost: 0,
        recruitmentCost: 0
      })
        .then(r => setCost(r.data))
        .catch(() => {});
    }
  }, []);

  const data = useMemo(() => {
    return (d?.countryCosts || [])
      .map((item: any) => ({
        country: item.country,
        cost: Number(item.cost)
      }))
      .filter((item: any) =>
        item.country &&
        Number.isFinite(item.cost) &&
        item.cost > 0
      )
      .sort((a: any, b: any) => b.cost - a.cost);
  }, [d]);

  const selectedCountry = p?.hiringCountry;

  const highestCost = data.length
    ? data[0].cost
    : 0;

  const lowestCost = data.length
    ? data[data.length - 1].cost
    : 0;

  const averageCost = data.length
    ? data.reduce((sum: number, item: any) => sum + item.cost, 0) / data.length
    : 0;

  const metrics = [
    {
      title: 'Countries analyzed',
      value: d?.countriesAnalyzed ?? '—',
      icon: Globe2,
      color: 'text-violet-600',
      bg: 'bg-violet-50'
    },
    {
      title: 'Scenario annual cost',
      value: cost
        ? formatMoney(Number(cost.totalAnnual || 0))
        : '—',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Avg hiring time',
      value: d?.avgHiringTime != null
        ? `${Math.round(Number(d.avgHiringTime))} days`
        : '—',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: 'Avg retention',
      value: d?.avgRetention != null
        ? `${Math.round(Number(d.avgRetention) * 100)}%`
        : '—',
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Compliance alerts',
      value: d?.complianceAlerts ?? '—',
      icon: ShieldCheck,
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    }
  ];

  return (
    <div className="space-y-7 pb-8">

      {/* Dashboard heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Global hiring dashboard
        </h1>
        <p className="text-slate-500 mt-2">
          Your submitted scenario is the context for this workspace.
        </p>
      </div>

      {/* Hiring scenario */}
      <div className="card p-6 border border-violet-100 bg-gradient-to-r from-violet-50 via-white to-blue-50">
        <div className="flex flex-wrap items-center justify-between gap-5">

          <div className="flex flex-wrap gap-x-10 gap-y-5">
            {[
              ['Company', p?.companyCountry],
              ['Hiring market', p?.hiringCountry],
              ['Role', p?.jobRole],
              ['Salary', p?.annualSalary != null
                ? Number(p.annualSalary).toLocaleString()
                : '—'],
              ['Employees', p?.employees]
            ].map(([label, value]) => (
              <div key={String(label)}>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="font-bold mt-1 text-slate-900">
                  {value || '—'}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/app/setup"
            className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white border border-violet-200 text-violet-700 font-semibold text-sm hover:bg-violet-50 shadow-sm"
          >
            <Pencil size={16} />
            Edit Hiring Details
          </Link>
        </div>
      </div>

      {/* KPI metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <div
              key={index}
              className="card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {metric.title}
                </p>
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <Icon size={18} className={metric.color} />
                </div>
              </div>

              <p className="text-2xl font-bold mt-4 text-slate-900">
                {metric.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Country cost analytics */}
      <div className="card p-6 md:p-7">

        <div className="flex flex-wrap justify-between items-start gap-4 mb-7">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Global hiring cost analysis
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Compare annual hiring costs across international markets.
            </p>
          </div>

          <div className="px-3 py-2 rounded-lg bg-violet-50 text-violet-700 text-xs font-semibold">
            {data.length} countries
          </div>
        </div>

        {/* Summary cards */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Highest annual cost
              </p>
              <p className="text-xl font-bold mt-2 text-slate-900">
                {formatMoney(highestCost)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {data[0].country}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Lowest annual cost
              </p>
              <p className="text-xl font-bold mt-2 text-slate-900">
                {formatMoney(lowestCost)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {data[data.length - 1].country}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Average annual cost
              </p>
              <p className="text-xl font-bold mt-2 text-slate-900">
                {formatMoney(averageCost)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Across displayed countries
              </p>
            </div>

          </div>
        )}

        {/* Chart */}
        {data.length > 0 ? (
          <div style={{ width: '100%', height: Math.max(380, data.length * 54) }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{
                  top: 10,
                  right: 85,
                  left: 15,
                  bottom: 10
                }}
                barCategoryGap="32%"
              >
                <CartesianGrid
                  strokeDasharray="3 5"
                  horizontal={false}
                  stroke="#e2e8f0"
                />

                <XAxis
                  type="number"
                  scale="sqrt"
                  domain={[0, 'dataMax']}
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `$${(value / 1000000).toFixed(1)}M`;
                    }
                    if (value >= 1000) {
                      return `$${(value / 1000).toFixed(0)}K`;
                    }
                    return `$${value}`;
                  }}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="country"
                  width={125}
                  tick={{ fill: '#334155', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  formatter={(value: any) => [
                    formatMoney(Number(value)),
                    'Annual hiring cost'
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 8px 25px rgba(15,23,42,0.08)',
                    padding: 12
                  }}
                  labelStyle={{
                    color: '#0f172a',
                    fontWeight: 700,
                    marginBottom: 5
                  }}
                />

                <Bar
                  dataKey="cost"
                  name="Annual cost"
                  radius={[0, 7, 7, 0]}
                  maxBarSize={27}
                >
                  {data.map((item: any, index: number) => (
                    <Cell
                      key={item.country}
                      fill={
                        item.country === selectedCountry
                          ? '#16a34a'
                          : index === 0
                            ? '#635bdb'
                            : '#8b83ee'
                      }
                    />
                  ))}

                  <LabelList
                    dataKey="cost"
                    position="right"
                    formatter={(value: any) => formatMoney(Number(value))}
                    style={{
                      fill: '#475569',
                      fontSize: 11,
                      fontWeight: 600
                    }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-16 text-center">
            <Globe2 size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="font-semibold text-slate-700">
              No country cost data available
            </h3>
            <p className="text-sm text-slate-500 mt-2">
              Country comparison data will appear here when the backend returns valid cost records.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-5 mt-5 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-violet-500" />
            Other countries
          </span>

          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-green-600" />
            Selected hiring country
          </span>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Square-root scale is used to make differences between countries
          easier to see. Exact values are available on hover.
        </p>
      </div>

    </div>
  );
}
