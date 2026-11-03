import { Link } from "react-router-dom";
import {
  ArrowRight,
  Globe2,
  Brain,
  Calculator,
  ShieldCheck,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">

      {/* ================= NAVBAR ================= */}
      <nav className="h-20 flex items-center justify-between px-6 md:px-16 border-b bg-white">
        
        <Link
          to="/"
          className="text-xl font-extrabold text-brand"
        >
          GlobalTalentLens
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-slate-700 hover:text-brand transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2 rounded-xl gradient text-white hover:opacity-90 transition"
          >
            Get started
          </Link>
        </div>
      </nav>


      {/* ================= HERO SECTION ================= */}
      <section className="px-6 md:px-20 py-24 bg-gradient-to-br from-violet-50 via-white to-blue-50">
        
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <span className="inline-flex px-4 py-2 rounded-full bg-white border text-sm text-brand shadow-sm">
            AI-powered workforce intelligence
          </span>


          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mt-6 text-slate-900">
            Make smarter global hiring decisions with AI.
          </h1>


          {/* Description */}
          <p className="text-lg md:text-xl text-slate-600 mt-6 max-w-3xl mx-auto leading-relaxed">
            Compare hiring markets, estimate employment costs, understand
            compliance requirements, and predict workforce outcomes — all in
            one platform.
          </p>


          {/* ================= MAIN BUTTONS ================= */}
          <div className="mt-9 flex flex-wrap justify-center gap-3">

            {/* Protected feature */}
            <Link
              to="/login"
              className="gradient text-white px-6 py-3 rounded-xl flex gap-2 items-center hover:opacity-90 transition"
            >
              Analyze hiring markets
              <ArrowRight size={18} />
            </Link>


            {/* Public feature */}
            <Link
              to="/countries"
              className="px-6 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition"
            >
              Explore countries
            </Link>

          </div>

        </div>
      </section>


      {/* ================= FEATURE CARDS ================= */}
      <section className="max-w-6xl mx-auto grid md:grid-cols-4 gap-5 p-8 -mt-10">

        <Feature
          I={Globe2}
          t="Global market data"
          d="Explore country-level talent, salary, innovation, and employment information."
        />

        <Feature
          I={Calculator}
          t="Cost intelligence"
          d="Calculate employer-side hiring costs with transparent formulas."
        />

        <Feature
          I={Brain}
          t="Predictive models"
          d="Estimate offer acceptance, hiring time, cost, and retention."
        />

        <Feature
          I={ShieldCheck}
          t="Compliance context"
          d="Surface employment and compliance requirements with professional verification guidance."
        />

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="px-6 md:px-20 py-20 bg-white">

        <div className="max-w-6xl mx-auto">

          <div className="text-center mb-12">

            <p className="text-sm font-semibold text-brand uppercase tracking-wide">
              How it works
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2">
              From market research to hiring decisions
            </h2>

            <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
              GlobalTalentLens brings hiring-market intelligence, cost
              analysis, compliance context, and AI predictions together.
            </p>

          </div>


          <div className="grid md:grid-cols-3 gap-6">

            {/* Step 1 */}
            <div className="card p-7">

              <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center text-brand font-bold">
                01
              </div>

              <h3 className="font-bold text-lg mt-5">
                Explore hiring markets
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Review country-level information including salaries, talent
                availability, innovation, infrastructure, and employment
                conditions.
              </p>

              <Link
                to="/countries"
                className="inline-flex items-center gap-2 text-brand text-sm font-semibold mt-5"
              >
                Explore countries
                <ArrowRight size={15} />
              </Link>

            </div>


            {/* Step 2 */}
            <div className="card p-7">

              <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center text-brand font-bold">
                02
              </div>

              <h3 className="font-bold text-lg mt-5">
                Analyze hiring costs
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Estimate employer-side costs using salary, taxes, social
                security, benefits, recruitment, relocation, and visa inputs.
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-brand text-sm font-semibold mt-5"
              >
                Open calculator
                <ArrowRight size={15} />
              </Link>

            </div>


            {/* Step 3 */}
            <div className="card p-7">

              <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center text-brand font-bold">
                03
              </div>

              <h3 className="font-bold text-lg mt-5">
                Make informed decisions
              </h3>

              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Use AI predictions and configurable decision criteria to
                understand trade-offs across potential hiring markets.
              </p>

              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-brand text-sm font-semibold mt-5"
              >
                Analyze scenario
                <ArrowRight size={15} />
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* ================= CTA ================= */}
      <section className="px-6 md:px-20 py-20 bg-gradient-to-br from-violet-50 to-blue-50">

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Ready to explore global hiring markets?
          </h2>

          <p className="text-slate-600 mt-4">
            Explore country information publicly or create an account to
            access the full decision-support platform.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-7">

            <Link
              to="/countries"
              className="gradient text-white px-6 py-3 rounded-xl"
            >
              Explore countries
            </Link>

            <Link
              to="/register"
              className="px-6 py-3 rounded-xl border border-slate-200 bg-white"
            >
              Create account
            </Link>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t bg-white">

        <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">

          <div>
            <div className="font-bold text-brand">
              GlobalTalentLens
            </div>

            <p className="text-sm text-slate-500 mt-1">
              Decision intelligence for global hiring.
            </p>
          </div>


          <div className="flex gap-5 text-sm text-slate-500">

            <Link
              to="/countries"
              className="hover:text-brand"
            >
              Countries
            </Link>

            <Link
              to="/login"
              className="hover:text-brand"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="hover:text-brand"
            >
              Register
            </Link>

          </div>

        </div>

      </footer>

    </div>
  );
}


/* ================= FEATURE COMPONENT ================= */

function Feature({ I, t, d }: any) {
  return (
    <div className="card p-6">

      <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
        <I className="text-brand" size={21} />
      </div>

      <h3 className="font-bold mt-4">
        {t}
      </h3>

      <p className="text-sm text-slate-500 mt-2 leading-relaxed">
        {d}
      </p>

    </div>
  );
}