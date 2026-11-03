import { useState } from "react";
import {
  Brain,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  TrendingUp,
  Clock3,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { api } from "../services/api";

type ModelType =
  | "offer-acceptance"
  | "hiring-cost"
  | "time-to-hire"
  | "retention"
  | "compliance";

const models: {
  id: ModelType;
  name: string;
  description: string;
  icon: any;
}[] = [
  {
    id: "offer-acceptance",
    name: "Offer Acceptance",
    description: "Predict the probability that a candidate will accept an offer.",
    icon: TrendingUp,
  },
  {
    id: "hiring-cost",
    name: "Hiring Cost",
    description: "Estimate the expected employer-side hiring cost.",
    icon: DollarSign,
  },
  {
    id: "time-to-hire",
    name: "Time to Hire",
    description: "Estimate the number of days required to fill a role.",
    icon: Clock3,
  },
  {
    id: "retention",
    name: "Employee Retention",
    description: "Estimate the likelihood of employee retention.",
    icon: Brain,
  },
  {
    id: "compliance",
    name: "Compliance Risk",
    description: "Estimate employment compliance risk.",
    icon: ShieldCheck,
  },
];

export default function AI() {
  const [type, setType] = useState<ModelType>("offer-acceptance");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedModel = models.find((m) => m.id === type)!;

  async function runModel() {
    setLoading(true);
    setError("");
    setResult(null);

    const bodies: Record<ModelType, any> = {
      "offer-acceptance": {
        experience: 3,
        salary: 60000,
        marketSalary: 55000,
        country: "Germany",
        jobRole: "Software Engineer",
        workMode: "REMOTE",
        benefits: 10,
        hiringTime: 28,
        companySize: 500,
        candidateLocation: "India",
      },

      "hiring-cost": {
        country: "Germany",
        jobRole: "Software Engineer",
        experience: 3,
        salary: 60000,
        employees: 2,
        employmentType: "FULL_TIME",
      },

      "time-to-hire": {
        country: "Germany",
        jobRole: "Software Engineer",
        experience: 3,
        hiringVolume: 5,
        employmentType: "FULL_TIME",
        talentAvailability: 78,
      },

      retention: {
        salaryCompetitiveness: 1.08,
        experience: 3,
        benefits: 10,
        country: "Germany",
        jobRole: "Software Engineer",
        workingHours: 40,
        employeeHistory: 3,
      },

      compliance: {
        country: "Germany",
        employmentType: "FULL_TIME",
        salary: 60000,
        workingHours: 40,
        visaRequired: true,
        sponsorship: true,
        benefits: 10,
        contractType: "PERMANENT",
      },
    };

    try {
      const response = await api.post(`/ml/${type}`, bodies[type]);
      setResult(response.data);
    } catch (err: any) {
      console.error("ML request failed:", err);

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to connect to the AI service.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function formatPrediction(value: any) {
    if (typeof value !== "number") return String(value ?? "—");

    if (
      type === "offer-acceptance" ||
      type === "retention" ||
      type === "compliance"
    ) {
      return `${Math.round(value * 100)}%`;
    }

    if (type === "hiring-cost") {
      return `$${Math.round(value).toLocaleString()}`;
    }

    if (type === "time-to-hire") {
      return `${value.toFixed(1)} days`;
    }

    return value.toString();
  }

  function formatMetric(value: any) {
    if (typeof value !== "number") return String(value ?? "—");
    return value.toFixed(3);
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient flex items-center justify-center">
            <Brain className="text-white" size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              AI Predictions
            </h1>
            <p className="text-slate-500 mt-1">
              Use trained machine-learning models to analyze hiring outcomes.
            </p>
          </div>
        </div>
      </div>

      {/* Model selector */}
      <div className="grid lg:grid-cols-5 gap-4">
        {models.map((model) => {
          const Icon = model.icon;
          const active = type === model.id;

          return (
            <button
              key={model.id}
              type="button"
              onClick={() => {
                setType(model.id);
                setResult(null);
                setError("");
              }}
              className={`text-left card p-5 transition-all border-2 ${
                active
                  ? "border-violet-400 bg-violet-50/60 shadow-md"
                  : "border-transparent hover:border-slate-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  active ? "gradient text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <Icon size={19} />
              </div>

              <h3 className="font-bold mt-4 text-slate-900">
                {model.name}
              </h3>

              <p className="text-xs text-slate-500 mt-2 leading-5">
                {model.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Selected model */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="text-violet-600" size={19} />
              <h2 className="text-xl font-bold">{selectedModel.name}</h2>
            </div>

            <p className="text-sm text-slate-500 mt-2">
              {selectedModel.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-700 text-xs font-medium">
                Machine Learning
              </span>

              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium">
                Trained Model
              </span>

              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                Demo Scenario
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={runModel}
            disabled={loading}
            className="gradient text-white rounded-xl px-7 py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed min-w-40"
          >
            {loading ? (
              <>
                <Loader2 size={19} className="animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Brain size={19} />
                Run Model
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="card border border-red-200 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 mt-0.5" size={21} />

            <div>
              <h3 className="font-bold text-red-800">
                AI prediction failed
              </h3>

              <p className="text-sm text-red-700 mt-1">
                {error}
              </p>

              <p className="text-xs text-red-600 mt-3">
                Make sure the Spring Boot backend is running on port 8080 and
                the ML service is running on port 8001.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Main prediction */}
          <div className="lg:col-span-2 card p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Model Prediction
                </p>

                <h2 className="text-5xl font-extrabold text-slate-900 mt-2">
                  {formatPrediction(result.prediction)}
                </h2>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="text-emerald-600" size={30} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-7">
              <div className="bg-slate-50 rounded-2xl p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Probability
                </p>

                <p className="text-2xl font-bold mt-2">
                  {typeof result.probability === "number"
                    ? `${Math.round(result.probability * 100)}%`
                    : "—"}
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Confidence
                </p>

                <p className="text-2xl font-bold mt-2">
                  {typeof result.confidence === "number"
                    ? `${Math.round(result.confidence * 100)}%`
                    : "—"}
                </p>
              </div>
            </div>

            {/* Important factors */}
            <div className="mt-7">
              <h3 className="font-bold text-lg">Important Factors</h3>

              <div className="grid sm:grid-cols-2 gap-3 mt-4">
                {(result.importantFactors || []).map(
                  (factor: string, index: number) => (
                    <div
                      key={`${factor}-${index}`}
                      className="flex items-center gap-3 p-4 rounded-xl bg-violet-50 border border-violet-100"
                    >
                      <div className="w-7 h-7 rounded-full gradient text-white flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>

                      <span className="text-sm font-medium text-slate-700">
                        {factor}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="card p-6">
            <h3 className="font-bold text-lg">Model Metrics</h3>

            <p className="text-xs text-slate-500 mt-1">
              Evaluation metrics from the trained model.
            </p>

            {result.metrics ? (
              <div className="space-y-3 mt-5">
                {Object.entries(result.metrics)
                  .filter(
                    ([key]) =>
                      key !== "confusion_matrix" &&
                      typeof result.metrics[key] === "number"
                  )
                  .map(([key, value]: [string, any]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between border-b pb-3"
                    >
                      <span className="text-sm text-slate-600 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>

                      <span className="font-bold text-slate-900">
                        {formatMetric(value)}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 mt-5">
                Metrics were not returned by this model.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-50 flex items-center justify-center">
            <Brain className="text-violet-600" size={30} />
          </div>

          <h3 className="text-xl font-bold mt-5">
            Ready to run an AI prediction
          </h3>

          <p className="text-slate-500 max-w-lg mx-auto mt-2">
            Select a model above and click <b>Run Model</b> to generate a
            prediction using the trained GlobalTalentLens machine-learning
            service.
          </p>
        </div>
      )}
    </div>
  );
}
