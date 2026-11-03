import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

const countryFlags: Record<string, string> = {
  Australia: '🇦🇺',
  Brazil: '🇧🇷',
  Canada: '🇨🇦',
  Denmark: '🇩🇰',
  Estonia: '🇪🇪',
  Finland: '🇫🇮',
  France: '🇫🇷',
  Germany: '🇩🇪',
  India: '🇮🇳',
  Indonesia: '🇮🇩',
  Ireland: '🇮🇪',
  Italy: '🇮🇹',
  Japan: '🇯🇵',
  Mexico: '🇲🇽',
  Netherlands: '🇳🇱',
  'New Zealand': '🇳🇿',
  Norway: '🇳🇴',
  Philippines: '🇵🇭',
  Poland: '🇵🇱',
  Portugal: '🇵🇹',
  Singapore: '🇸🇬',
  'South Africa': '🇿🇦',
  'South Korea': '🇰🇷',
  Spain: '🇪🇸',
  Sweden: '🇸🇪',
  Switzerland: '🇨🇭',
  'United Arab Emirates': '🇦🇪',
  'United Kingdom': '🇬🇧',
  'United States': '🇺🇸',
  Vietnam: '🇻🇳',
};

const getFlag = (country: string) => countryFlags[country] || '🌐';

export default function CountryDetails() {
  const { id } = useParams();
  const [country, setCountry] = useState<any>();

  useEffect(() => {
    api.get(`/countries/${id}`).then((response) => {
      setCountry(response.data);
    });
  }, [id]);

  if (!country) {
    return <div className="card p-8">Loading country profile...</div>;
  }

  const metrics = [
    ['Average salary', `$${Number(country.averageSalary || 0).toLocaleString()}`],
    ['Minimum wage', `$${Number(country.minimumWage || 0).toLocaleString()}`],
    ['Employer tax', `${country.employerTax ?? 0}%`],
    ['Social security', `${country.socialSecurity ?? 0}%`],
    ['Working hours', country.workingHours ?? '—'],
    ['Payroll cycle', country.payrollCycle || '—'],
    ['Talent availability', country.talentAvailability ?? '—'],
    ['Talent affordability', country.talentAffordability ?? '—'],
    ['Digital infrastructure', country.digitalInfrastructure ?? '—'],
  ];

  return (
    <div>
      <div className="card p-7 gradient text-white">
        <div className="text-5xl leading-none">
          {getFlag(country.name)}
        </div>

        <h1 className="text-3xl font-bold mt-3">
          {country.name}
        </h1>

        <p>
          {country.currency} · {country.timezone}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mt-6">
        {metrics.map(([label, value]) => (
          <div className="card p-5" key={label}>
            <div className="text-sm text-slate-500">
              {label}
            </div>

            <div className="text-xl font-bold mt-2">
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 mt-6">
        <h2 className="font-bold text-lg">
          Legal & compliance context
        </h2>

        <p className="text-sm text-slate-600 mt-3">
          Visa: {country.visaRequirement ? 'Required' : 'Generally not required'}
          {' · '}
          Work permit: {country.workPermit ? 'Required' : 'Not indicated'}
          {' · '}
          Sponsorship: {country.sponsorship ? 'Required' : 'Not indicated'}
        </p>

        <p className="mt-4 text-sm bg-amber-50 p-4 rounded-xl">
          Information is for decision-support purposes and should be verified
          with qualified legal/payroll professionals.
        </p>
      </div>
    </div>
  );
}
