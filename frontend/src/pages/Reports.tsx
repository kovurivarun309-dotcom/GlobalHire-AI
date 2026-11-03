
import { useState } from 'react';
import { api } from '../services/api';
import { loadHiringProfile } from '../services/hiringProfile';

export default function Reports() {
  const p = loadHiringProfile();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function make() {
    setLoading(true);
    setError('');

    try {
      const countries = [
        p?.hiringCountry,
        p?.comparisonCountry,
      ].filter((country): country is string => Boolean(country));

      const response = await api.post('/reports/generate', {
        title: `${p?.jobRole || 'Global Hiring'} Decision Report`,
        companyCountry: p?.companyCountry || 'India',
        jobRole: p?.jobRole || 'Software Engineer',
        countries,
      });

      setReport(response.data);
    } catch (e) {
      setError('Unable to generate report. Please check the backend connection.');
    } finally {
      setLoading(false);
    }
  }

  const generatedDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const reportCountries = [
    ...new Set([
      p?.hiringCountry,
      p?.comparisonCountry,
    ].filter((country): country is string => Boolean(country))),
  ];

  return (
    <div className="reports-page">

      {/* Screen heading */}
      <div className="no-print">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-slate-500 mt-1">
          Generate a professional report from your global hiring scenario.
        </p>

        <div className="card p-5 mt-5 grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Company country</span>
            <b className="block mt-1">{p?.companyCountry || 'India'}</b>
          </div>

          <div>
            <span className="text-slate-500">Hiring market</span>
            <b className="block mt-1">{p?.hiringCountry || 'Not specified'}</b>
          </div>

          <div>
            <span className="text-slate-500">Role</span>
            <b className="block mt-1">{p?.jobRole || 'Not specified'}</b>
          </div>

          <div>
            <span className="text-slate-500">Employees</span>
            <b className="block mt-1">{p?.employees || 1}</b>
          </div>
        </div>

        <button
          onClick={make}
          disabled={loading}
          className="gradient text-white rounded-xl px-6 py-3 mt-6 font-semibold disabled:opacity-60"
        >
          {loading ? 'Generating report...' : 'Generate decision report'}
        </button>

        {error && (
          <p className="text-red-600 mt-4">{error}</p>
        )}
      </div>

      {/* Printable report */}
      {report && (
        <div className="report-print-root">

          <header className="report-header">
            <div>
              <h2 className="report-brand">GlobalTalentLens</h2>
              <p>GLOBAL HIRING INTELLIGENCE</p>
            </div>

            <div className="report-date">
              <span>REPORT GENERATED</span>
              <strong>{generatedDate}</strong>
            </div>
          </header>

          <div className="report-line" />

          <section className="report-title-section">
            <p className="report-eyebrow">
              HIRING ANALYSIS &amp; DECISION SUPPORT
            </p>
            <h1>{report.title || 'Global Hiring Decision Report'}</h1>
            <p>
              International employment scenario and country-level
              hiring assessment.
            </p>
          </section>

          <section className="report-section">
            <h2>01. Hiring Scenario</h2>

            <div className="report-grid">
              <div>
                <span>Company country</span>
                <strong>{p?.companyCountry || 'India'}</strong>
              </div>

              <div>
                <span>Hiring country</span>
                <strong>{p?.hiringCountry || 'Not specified'}</strong>
              </div>

              <div>
                <span>Job role</span>
                <strong>{p?.jobRole || 'Not specified'}</strong>
              </div>

              <div>
                <span>Number of employees</span>
                <strong>{p?.employees || 1}</strong>
              </div>

              <div>
                <span>Annual base salary</span>
                <strong>
                  {p?.annualSalary
                    ? Number(p.annualSalary).toLocaleString()
                    : 'Not provided'}
                </strong>
              </div>

              <div>
                <span>Employment type</span>
                <strong>{p?.employmentType || 'Not provided'}</strong>
              </div>

              <div>
                <span>Work arrangement</span>
                <strong>{p?.workMode || 'Not provided'}</strong>
              </div>
            </div>
          </section>

          <section className="report-section">
            <h2>02. Decision Analysis</h2>
            <div className="report-content">
              {report.summary || 'No decision summary was returned by the backend.'}
            </div>
          </section>

          <section className="report-section">
            <h2>03. Country Assessment</h2>
            <p>Countries included in this report:</p>

            <ul className="report-list">
              {reportCountries.map((country) => (
                <li key={country}>{country}</li>
              ))}
            </ul>
          </section>

          <section className="report-section">
            <h2>04. Legal Compliance Verification</h2>
            <p>
              Country-specific employment laws, statutory regulations,
              payroll obligations, immigration requirements and employee
              protection rules must be reviewed before hiring.
            </p>
            <p>
              Consult the Legal Documents section for the applicable
              legislation and official source references. This report
              does not certify legal compliance.
            </p>
          </section>

          <section className="report-section">
            <h2>05. Important Notice</h2>
            <p>
              This report is generated using the information submitted
              to GlobalTalentLens. Estimates and analytical outputs
              should be independently verified before operational,
              financial or legal decisions are made.
            </p>
          </section>

          <footer className="report-footer">
            <div>
              <strong>GlobalTalentLens</strong>
              <p>Decision Intelligence for Global Hiring</p>
            </div>
            <span>CONFIDENTIAL REPORT</span>
          </footer>

          <div className="no-print mt-6">
            <button
              onClick={() => window.print()}
              className="gradient text-white rounded-xl px-6 py-3 font-semibold"
            >
              Print / Save as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
