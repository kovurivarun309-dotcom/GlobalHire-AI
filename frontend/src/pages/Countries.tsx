import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function Countries() {
  const [countries, setCountries] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    api.get('/countries').then((response) => {
      setCountries(response.data);
    });
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="font-sans">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">
        Global hiring markets
      </h1>

      <p className="text-slate-500 mt-1">
        Country profiles use demonstration seed data unless a source is explicitly shown.
      </p>

      <input
        className="mt-6 w-full md:w-96 border border-slate-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
        placeholder="Search country..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {filteredCountries.map((country) => (
          <Link
            to={`/app/countries/${country.id}`}
            className="card p-5 hover:-translate-y-0.5 transition"
            key={country.id}
          >
            <div className="text-4xl leading-none">
              {countryFlags[country.name] || '🌐'}
            </div>

            <h3 className="font-bold text-lg mt-3 text-slate-900">
              {country.name}
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {country.currency} · Avg salary $
              {Number(country.averageSalary || 0).toLocaleString()}
            </p>

            <div className="flex gap-2 mt-4 text-xs">
              <span className="bg-violet-50 text-brand px-2 py-1 rounded">
                Talent {country.talentAvailability}
              </span>

              <span className="bg-slate-100 px-2 py-1 rounded">
                Innovation {country.innovation}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
