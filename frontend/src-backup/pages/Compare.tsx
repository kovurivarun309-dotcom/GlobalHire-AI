import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Compare() {
  const [countries, setCountries] = useState<any[]>([]);
  const [selected, setSelected] = useState<string[]>([
    "India",
    "Germany",
    "Australia",
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCountries() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/countries");
        setCountries(response.data);
      } catch (err: any) {
        console.error("Failed to load countries:", err);
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Unable to load country data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCountries();
  }, []);

  const rows = [
    ["Average salary", "averageSalary"],
    ["Minimum wage", "minimumWage"],
    ["Employer tax", "employerTax"],
    ["Social security", "socialSecurity"],
    ["Working hours", "workingHours"],
    ["Talent availability", "talentAvailability"],
    ["Talent affordability", "talentAffordability"],
    ["Digital infrastructure", "digitalInfrastructure"],
    ["Innovation", "innovation"],
    ["Compliance score", "complianceScore"],
  ];

  function toggleCountry(name: string) {
    setSelected((current) =>
      current.includes(name)
        ? current.filter((country) => country !== name)
        : [...current, name]
    );
  }

  function selectAll() {
    setSelected(countries.map((country) => country.name));
  }

  function clearAll() {
    setSelected([]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Country comparison
        </h1>
        <p className="text-slate-500 mt-2">
          Compare employment, talent, infrastructure, innovation, and
          compliance factors across global hiring markets.
        </p>
      </div>

      <div className="card p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5">
          <div>
            <h2 className="font-bold text-lg text-slate-900">
              Select countries
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {selected.length} of {countries.length} countries selected
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAll}
              disabled={loading || countries.length === 0}
              className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
            >
              Select all
            </button>

            <button
              type="button"
              onClick={clearAll}
              className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-slate-50"
            >
              Clear all
            </button>
          </div>
        </div>

        {loading && (
          <div className="py-8 text-center text-slate-500">
            Loading countries...
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-wrap gap-x-5 gap-y-3">
            {countries.map((country) => (
              <label
                key={country.id ?? country.name}
                className="flex items-center gap-2 text-sm cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(country.name)}
                  onChange={() => toggleCountry(country.name)}
                  className="h-4 w-4"
                />

                <span>{country.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="card overflow-auto">
        {selected.length === 0 ? (
          <div className="py-16 text-center">
            <h3 className="font-bold text-lg text-slate-900">
              No countries selected
            </h3>
            <p className="text-slate-500 mt-2">
              Select one or more countries above to compare them.
            </p>
          </div>
        ) : (
          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left p-4 font-semibold sticky left-0 bg-slate-50">
                  Factor
                </th>

                {selected.map((name) => (
                  <th
                    className="p-4 text-left font-semibold whitespace-nowrap"
                    key={name}
                  >
                    {name}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map(([label, key]) => (
                <tr className="border-b last:border-b-0" key={key}>
                  <td className="p-4 font-medium text-slate-700 sticky left-0 bg-white whitespace-nowrap">
                    {label}
                  </td>

                  {selected.map((name) => {
                    const country = countries.find(
                      (item) => item.name === name
                    );

                    const value = country?.[key];

                    return (
                      <td
                        className="p-4 text-slate-700 whitespace-nowrap"
                        key={`${name}-${key}`}
                      >
                        {value ?? "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="text-sm text-slate-500">
        Comparison values are provided for decision-support purposes. Country
        data should be verified against current official and professional
        sources before making employment decisions.
      </div>
    </div>
  );
}