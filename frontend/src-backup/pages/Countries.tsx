import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Globe2 } from "lucide-react";
import { api } from "../services/api";

const countryFlags: Record<string, string> = {
  India: "🇮🇳",
  Singapore: "🇸🇬",
  "United States": "🇺🇸",
  "United Kingdom": "🇬🇧",
  Germany: "🇩🇪",
  France: "🇫🇷",
  Australia: "🇦🇺",
  Canada: "🇨🇦",
  Japan: "🇯🇵",
  Netherlands: "🇳🇱",
  Switzerland: "🇨🇭",
  Ireland: "🇮🇪",
  Sweden: "🇸🇪",
  Norway: "🇳🇴",
  Denmark: "🇩🇰",
  Finland: "🇫🇮",
  "New Zealand": "🇳🇿",
  "United Arab Emirates": "🇦🇪",
  "Saudi Arabia": "🇸🇦",
  "South Korea": "🇰🇷",
  China: "🇨🇳",
  Brazil: "🇧🇷",
  Mexico: "🇲🇽",
  "South Africa": "🇿🇦",
  Israel: "🇮🇱",
  Spain: "🇪🇸",
  Italy: "🇮🇹",
  Belgium: "🇧🇪",
  Austria: "🇦🇹",
  Poland: "🇵🇱",
  Portugal: "🇵🇹",
};

export default function Countries() {
  const [countries, setCountries] = useState<any[]>([]);
  const [query, setQuery] = useState("");
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

  const filteredCountries = countries.filter((country) =>
    country.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient flex items-center justify-center">
            <Globe2 className="text-white" size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Global Hiring Markets
            </h1>

            <p className="text-slate-500 mt-1">
              Explore country-level talent, salary, innovation, and employment
              information.
            </p>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
          Demonstration seed data unless a source is explicitly shown
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full md:w-[420px]">
        <Search
          size={19}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          className="w-full border border-slate-200 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 bg-white"
          placeholder="Search country..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="card border border-red-200 bg-red-50 p-5 text-red-700">
          <b>Unable to load countries</b>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="card p-6 h-48 animate-pulse bg-white"
            >
              <div className="w-12 h-10 bg-slate-100 rounded-lg" />
              <div className="w-32 h-5 bg-slate-100 rounded mt-5" />
              <div className="w-48 h-4 bg-slate-100 rounded mt-3" />
            </div>
          ))}
        </div>
      )}

      {/* Country Cards */}
      {!loading && !error && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredCountries.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {countries.length}
              </span>{" "}
              countries
            </p>
          </div>

          {filteredCountries.length === 0 ? (
            <div className="card p-12 text-center">
              <Globe2
                size={35}
                className="mx-auto text-slate-300"
              />

              <h3 className="font-bold text-lg mt-4">
                No countries found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Try a different country name.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCountries.map((country) => {
                const flag = countryFlags[country.name] || "🌍";

                return (
                  <Link
                    key={country.id}
                    to={`/countries/${country.id}`}
                    className="card p-6 hover:-translate-y-1 hover:shadow-lg transition-all bg-white"
                  >
                    <div className="flex items-start justify-between">
                      <div className="text-4xl leading-none">
                        {flag}
                      </div>

                      <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
                        {country.dataStatus || "DEMO"}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg mt-5 text-slate-900">
                      {country.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {country.currency || "Local currency"}{" "}
                      <span className="mx-1">·</span>
                      Avg salary{" "}
                      <span className="font-medium text-slate-700">
                        {Number(
                          country.averageSalary || 0
                        ).toLocaleString()}
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-2 mt-5">
                      <span className="bg-violet-50 text-violet-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                        Talent{" "}
                        {country.talentAvailability ?? "—"}
                      </span>

                      <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-medium">
                        Innovation{" "}
                        {country.innovation ?? "—"}
                      </span>
                    </div>

                    <div className="mt-5 text-sm font-medium text-violet-600">
                      View country profile →
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}