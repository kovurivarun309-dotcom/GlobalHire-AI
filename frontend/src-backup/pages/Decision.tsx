import { useState } from "react";
import { api } from "../services/api";
import { CheckCircle2, SlidersHorizontal, Loader2 } from "lucide-react";

type Weights = {
  cost: number;
  talent: number;
  speed: number;
  retention: number;
  compliance: number;
};

export default function Decision() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [weights, setWeights] = useState<Weights>({
    cost: 30,
    talent: 25,
    speed: 15,
    retention: 15,
    compliance: 15,
  });

  function updateWeight(key: keyof Weights, value: number) {
    setWeights((current) => ({
      ...current,
      [key]: value,
    }));
    setSuccess(false);
  }

  const totalWeight = Object.values(weights).reduce(
    (sum, value) => sum + value,
    0
  );

  async function analyzeScenario() {
    if (totalWeight !== 100) {
      setError(
        `Weights must total 100%. Current total is ${totalWeight}%.`
      );
      setSuccess(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const response = await api.post("/decision-support/analyze", {
        jobRole: "Software Engineer",
        experience: 3,
        salaryBudget: 50000,
        employees: 5,
        employmentType: "FULL_TIME",
        companyCountry: "India",
        preferredCountries: [
          "India",
          "Germany",
          "Australia",
          "Poland",
        ],
        weights: {
          cost: weights.cost / 100,
          talent: weights.talent / 100,
          speed: weights.speed / 100,
          retention: weights.retention / 100,
          compliance: weights.compliance / 100,
        },
      });

      setResult(response.data);
      setSuccess(true);
    } catch (err: any) {
      console.error("Decision support failed:", err);

      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Unable to analyze the hiring scenario. Make sure the Spring Boot backend is running on port 8080."
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  const weightItems: {
    key: keyof Weights;
    label: string;
    description: string;
  }[] = [
    {
      key: "cost",
      label: "Hiring cost",
      description: "Importance of total employer cost",
    },
    {
      key: "talent",
      label: "Talent availability",
      description: "Importance of available talent",
    },
    {
      key: "speed",
      label: "Hiring speed",
      description: "Importance of faster hiring",
    },
    {
      key: "retention",
      label: "Retention",
      description: "Importance of expected retention",
    },
    {
      key: "compliance",
      label: "Compliance",
      description: "Importance of compliance context",
    },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Decision support
        </h1>

        <p className="text-slate-500 mt-1">
          Configure your hiring priorities and compare the resulting trade-offs.
        </p>
      </div>

      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <SlidersHorizontal className="text-brand" size={20} />
          </div>

          <div>
            <h2 className="font-bold text-lg text-slate-900">
              Decision criteria
            </h2>

            <p className="text-sm text-slate-500">
              Adjust the importance of each factor. Total weight must equal 100%.
            </p>
          </div>

          <div
            className={`ml-auto px-3 py-1.5 rounded-full text-sm font-semibold ${
              totalWeight === 100
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {totalWeight}%
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 mt-6">
          {weightItems.map((item) => (
            <div
              key={item.key}
              className="rounded-xl border border-slate-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {item.label}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {item.description}
                  </p>
                </div>

                <span className="font-bold text-brand">
                  {weights[item.key]}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                value={weights[item.key]}
                onChange={(e) =>
                  updateWeight(item.key, Number(e.target.value))
                }
                className="w-full mt-4 accent-violet-600"
              />
            </div>
          ))}
        </div>

        {totalWeight !== 100 && (
          <div className="mt-5 rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-700">
            Adjust the sliders so the total weight equals exactly 100%.
          </div>
        )}

        <button
          type="button"
          onClick={analyzeScenario}
          disabled={loading || totalWeight !== 100}
          className="gradient text-white rounded-xl px-6 py-3 mt-6 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing scenario...
            </>
          ) : (
            <>
              <SlidersHorizontal size={18} />
              Analyze scenario
            </>
          )}
        </button>

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
            <CheckCircle2 size={18} />
            <span>
              Analysis completed successfully using your selected weights.
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="card border border-red-200 bg-red-50 p-5">
          <p className="font-semibold text-red-700">
            Decision analysis failed
          </p>

          <p className="text-sm text-red-600 mt-1">
            {error}
          </p>
        </div>
      )}

      {result && (
        <div className="card overflow-auto">
          <div className="p-5 border-b">
            <h2 className="text-lg font-bold text-slate-900">
              Scenario analysis
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Transparent trade-off results based on the selected criteria.
            </p>
          </div>

          <table className="min-w-[900px] w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b">
                {[
                  "Country",
                  "Cost",
                  "Hiring time",
                  "Acceptance",
                  "Retention",
                  "Compliance",
                  "Index",
                ].map((heading) => (
                  <th
                    className="text-left p-4 font-semibold"
                    key={heading}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {result.countries?.map((country: any) => (
                <tr
                  className="border-b last:border-b-0"
                  key={country.country}
                >
                  <td className="p-4 font-semibold">
                    {country.country}
                  </td>

                  <td className="p-4">
                    ${Math.round(country.totalCost).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {Math.round(country.hiringTime)} days
                  </td>

                  <td className="p-4">
                    {Math.round(country.acceptance * 100)}%
                  </td>

                  <td className="p-4">
                    {Math.round(country.retention * 100)}%
                  </td>

                  <td className="p-4">
                    {country.compliance}
                  </td>

                  <td className="p-4 font-semibold">
                    {Number(country.score).toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {result.explanation && (
            <div className="p-5 bg-slate-50 border-t">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">
                  Explanation:
                </span>{" "}
                {result.explanation}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="text-sm text-slate-500">
        This analysis presents configurable trade-offs rather than an objective
        “best country” verdict. Country, legal, tax, immigration, and employment
        information should be independently verified before making decisions.
      </div>
    </div>
  );
}