import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Globe2, ShieldCheck } from "lucide-react";
import { api } from "../services/api";

function countryMark(country: any) {
  const code = String(country?.code || "").toUpperCase();

  if (code) {
    return code;
  }

  const name = String(country?.name || "").toLowerCase();

  if (name === "india") return "IN";
  if (name === "singapore") return "SG";
  if (name === "united states") return "US";
  if (name === "united kingdom") return "GB";
  if (name === "germany") return "DE";
  if (name === "france") return "FR";

  return "GL";
}

function formatNumber(value: any) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "-";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(number);
}

export default function CountryDetails() {
  const { id } = useParams();

  const [country, setCountry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCountry() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/countries/${id}`);

        setCountry(response.data);
      } catch (err: any) {
        console.error("Failed to load country:", err);

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Unable to load this country profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCountry();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="card p-8 bg-white">
            <p className="text-slate-600">
              Loading country profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !country) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-5">

          <Link
            to="/countries"
            className="inline-flex items-center gap-2 text-brand font-medium hover:underline"
          >
            <ArrowLeft size={18} />
            Back to countries
          </Link>

          <div className="card p-8 bg-white">
            <h2 className="text-xl font-bold text-slate-900">
              Country profile unavailable
            </h2>

            <p className="text-slate-500 mt-2">
              {error ||
                "The requested country could not be found."}
            </p>
          </div>

        </div>
      </div>
    );
  }

  const currency = country.currency || "";
  const mark = countryMark(country);

  const metrics = [
    [
      "Average salary",
      `${currency}${formatNumber(country.averageSalary)}`,
    ],
    [
      "Minimum wage",
      `${currency}${formatNumber(country.minimumWage)}`,
    ],
    [
      "Employer tax",
      `${formatNumber(country.employerTax)}%`,
    ],
    [
      "Social security",
      `${formatNumber(country.socialSecurity)}%`,
    ],
    [
      "Working hours",
      country.workingHours || "-",
    ],
    [
      "Payroll cycle",
      country.payrollCycle || "-",
    ],
    [
      "Talent availability",
      formatNumber(country.talentAvailability),
    ],
    [
      "Talent affordability",
      formatNumber(country.talentAffordability),
    ],
    [
      "Digital infrastructure",
      formatNumber(country.digitalInfrastructure),
    ],
    [
      "Innovation",
      formatNumber(country.innovation),
    ],
    [
      "Compliance score",
      formatNumber(country.complianceScore),
    ],
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fc]">

      {/* Public Navbar */}
      <nav className="h-20 bg-white border-b flex items-center justify-between px-6 md:px-16">

        <Link
          to="/"
          className="text-xl md:text-2xl font-extrabold text-brand"
        >
          GlobalTalentLens
        </Link>

        <div className="flex items-center gap-3">

          <Link
            to="/login"
            className="px-4 py-2 text-slate-700 hover:text-brand"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-xl gradient text-white font-medium"
          >
            Get started
          </Link>

        </div>
      </nav>

      {/* Main */}
      <main className="px-5 md:px-10 py-8">

        <div className="max-w-7xl mx-auto space-y-6">

          {/* Back */}
          <Link
            to="/countries"
            className="inline-flex items-center gap-2 text-brand font-medium hover:underline"
          >
            <ArrowLeft size={18} />
            Back to countries
          </Link>

          {/* Country Header */}
          <div className="card p-8 gradient text-white">

            <div className="flex items-start gap-5">

              <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center text-2xl font-bold border border-white/20">
                {mark}
              </div>

              <div>

                <div className="text-sm uppercase tracking-widest text-white/70">
                  {country.dataStatus || "DEMO"} country profile
                </div>

                <h1 className="text-4xl font-extrabold mt-2">
                  {country.name}
                </h1>

                <p className="mt-2 text-white/85">
                  {country.currency || "-"} |{" "}
                  {country.timezone ||
                    "Timezone not available"}
                </p>

              </div>

            </div>

          </div>

          {/* Metrics */}
          <div className="grid md:grid-cols-3 gap-5">

            {metrics.map(([label, value]) => (
              <div
                className="card p-5 bg-white"
                key={label}
              >

                <div className="text-sm text-slate-500">
                  {label}
                </div>

                <div className="text-xl font-bold mt-2 text-slate-900">
                  {value}
                </div>

              </div>
            ))}

          </div>

          {/* Legal & Compliance */}
          <div className="card p-6 bg-white">

            <div className="flex items-center gap-3">

              <ShieldCheck
                className="text-brand"
                size={22}
              />

              <h2 className="font-bold text-lg">
                Legal & compliance context
              </h2>

            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-5">

              <div className="rounded-xl bg-slate-50 p-4">

                <div className="text-sm text-slate-500">
                  Visa
                </div>

                <div className="font-semibold mt-1">
                  {country.visaRequirement
                    ? "Required"
                    : "Generally not required"}
                </div>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <div className="text-sm text-slate-500">
                  Work permit
                </div>

                <div className="font-semibold mt-1">
                  {country.workPermit
                    ? "Required"
                    : "Not indicated"}
                </div>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <div className="text-sm text-slate-500">
                  Sponsorship
                </div>

                <div className="font-semibold mt-1">
                  {country.sponsorship
                    ? "Required"
                    : "Not indicated"}
                </div>

              </div>

            </div>

            <div className="mt-5 text-sm bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-900">

              Information is provided for decision-support
              purposes and should be verified with qualified
              legal, tax, payroll, and immigration professionals
              before making employment decisions.

            </div>

          </div>

          {/* Employment Information */}
          <div className="card p-6 bg-white">

            <div className="flex items-center gap-3">

              <Globe2
                className="text-brand"
                size={22}
              />

              <h2 className="font-bold text-lg">
                Employment information
              </h2>

            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-5">

              <div>
                <div className="text-sm text-slate-500">
                  Paid leave
                </div>

                <div className="font-semibold mt-1">
                  {country.paidLeave || "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500">
                  Sick leave
                </div>

                <div className="font-semibold mt-1">
                  {country.sickLeave || "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500">
                  Maternity leave
                </div>

                <div className="font-semibold mt-1">
                  {country.maternityLeave || "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500">
                  Paternity leave
                </div>

                <div className="font-semibold mt-1">
                  {country.paternityLeave || "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500">
                  Public holidays
                </div>

                <div className="font-semibold mt-1">
                  {country.publicHolidays || "-"}
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-500">
                  Languages
                </div>

                <div className="font-semibold mt-1">
                  {country.languages || "-"}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom navigation */}
          <div className="flex justify-between items-center pt-2 pb-8">

            <Link
              to="/countries"
              className="inline-flex items-center gap-2 text-brand font-medium hover:underline"
            >
              <ArrowLeft size={18} />
              All countries
            </Link>

            <Link
              to="/register"
              className="gradient text-white px-5 py-3 rounded-xl font-medium"
            >
              Create an account
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}