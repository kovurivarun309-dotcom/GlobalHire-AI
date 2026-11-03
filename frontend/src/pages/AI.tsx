
import { useState } from 'react';
import { api } from '../services/api';
import { loadHiringProfile } from '../services/hiringProfile';

type ModelType =
  | 'offer-acceptance'
  | 'hiring-cost'
  | 'time-to-hire'
  | 'retention'
  | 'compliance';

export default function AI() {
  const p = loadHiringProfile();

  const [type, setType] = useState<ModelType>('offer-acceptance');
  const [r, setR] = useState<any>(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const bodies: Record<ModelType, any> = {
    'offer-acceptance': {
      experience: p?.experience || 3,
      salary: Number(p?.annualSalary || 60000),
      marketSalary: Number(p?.annualSalary || 60000) * 0.92,
      country: p?.hiringCountry || 'Germany',
      jobRole: p?.jobRole || 'Software Engineer',
      workMode: p?.workMode || 'REMOTE',
      benefits: p?.benefits || 10,
      hiringTime: 28,
      companySize: 500,
      candidateLocation: p?.companyCountry || 'India'
    },

    'hiring-cost': {
      country: p?.hiringCountry || 'Germany',
      jobRole: p?.jobRole || 'Software Engineer',
      experience: p?.experience || 3,
      salary: Number(p?.annualSalary || 60000),
      employees: p?.employees || 1,
      employmentType: p?.employmentType || 'FULL_TIME'
    },

    'time-to-hire': {
      country: p?.hiringCountry || 'Germany',
      jobRole: p?.jobRole || 'Software Engineer',
      experience: p?.experience || 3,
      hiringVolume: p?.employees || 1,
      employmentType: p?.employmentType || 'FULL_TIME',
      talentAvailability: 78
    },

    retention: {
      salaryCompetitiveness: 1.08,
      experience: p?.experience || 3,
      benefits: p?.benefits || 10,
      country: p?.hiringCountry || 'Germany',
      jobRole: p?.jobRole || 'Software Engineer',
      workingHours: 40,
      employeeHistory: p?.experience || 3
    },

    compliance: {
      country: p?.hiringCountry || 'Germany',
      employmentType: p?.employmentType || 'FULL_TIME',
      salary: Number(p?.annualSalary || 60000),
      workingHours: 40,
      visaRequired: p?.visaRequired || false,
      sponsorship: p?.sponsorship || false,
      benefits: p?.benefits || 10,
      contractType: 'PERMANENT'
    }
  };

  function formatPrediction(value: any, model: ModelType) {
    if (value === null || value === undefined) return 'Not available';

    if (model === 'compliance') {
      return String(value);
    }

    const number = Number(value);

    if (!Number.isFinite(number)) return 'Invalid prediction';

    switch (model) {
      case 'offer-acceptance':
      case 'retention':
        return `${(Math.max(0, Math.min(1, number)) * 100).toFixed(1)}%`;

      case 'hiring-cost':
        return number.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });

      case 'time-to-hire':
        return `${number.toFixed(1)} days`;

      default:
        return String(value);
    }
  }

  function getPredictionLabel(model: ModelType) {
    const labels: Record<ModelType, string> = {
      'offer-acceptance': 'Offer acceptance probability',
      'hiring-cost': 'Estimated hiring cost',
      'time-to-hire': 'Estimated time to hire',
      retention: 'Employee retention probability',
      compliance: 'Compliance classification'
    };

    return labels[model];
  }

  async function run() {
    setErr('');
    setR(null);
    setLoading(true);

    try {
      const response = await api.post(`/ml/${type}`, bodies[type]);
      setR(response.data);
    } catch (error: any) {
      setErr(
        error?.response?.data?.message ||
        'Prediction failed. Check whether the ML service is running.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">AI predictions</h1>

      <p className="text-slate-500 mt-1">
        Predictions use your submitted {p?.jobRole} / {p?.hiringCountry} scenario.
      </p>

      <div className="card p-6 mt-6 flex flex-col md:flex-row gap-3">
        <select
          className="input md:w-auto"
          value={type}
          onChange={e => {
            setType(e.target.value as ModelType);
            setR(null);
            setErr('');
          }}
        >
          {[
            'offer-acceptance',
            'hiring-cost',
            'time-to-hire',
            'retention',
            'compliance'
          ].map(model => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        <button
          onClick={run}
          disabled={loading}
          className="gradient text-white rounded-xl px-5 py-3 font-semibold disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Run model'}
        </button>
      </div>

      {err && (
        <p className="text-red-600 mt-4">{err}</p>
      )}

      {r && (
        <div className="card p-7 mt-6">
          <div className="text-sm text-slate-500">
            {getPredictionLabel(type)}
          </div>

          <div className="text-4xl font-bold mt-2 break-words">
            {formatPrediction(r.prediction, type)}
          </div>

          {r.confidence != null && (
            <p className="mt-4 text-slate-600">
              Model confidence indicator: {(Number(r.confidence) * 100).toFixed(1)}%
            </p>
          )}

          <div className="mt-5">
            <b>Important factors</b>

            <ul className="list-disc ml-5 mt-2">
              {(r.importantFactors || []).map(
                (factor: string, index: number) => (
                  <li key={index}>{factor}</li>
                )
              )}
            </ul>
          </div>

          <p className="text-xs text-slate-500 mt-5">
            Predictions are estimates based on the available training data,
            not guaranteed hiring outcomes or legal advice.
          </p>
        </div>
      )}
    </div>
  );
}
