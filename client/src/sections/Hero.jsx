import { Link } from "react-router-dom";
import { ArrowRight, HeartHandshake, Sparkles } from "lucide-react";

const values = ["Faith", "Love", "Compassion", "Unity", "Service"];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-hero-pattern">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.25),transparent_30%)]" />
      <div className="container-cso relative grid min-h-[620px] items-center gap-10 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
        <div className="max-w-2xl animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/85 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> Christian Organization · Rwanda
          </span>
          <h1 className="mt-6 font-heading text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Serving God by <span className="text-accent">Helping People.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            CSO – Called to Serve Others is a Christian community committed to showing God’s love through service,
            prayer, charity, and care for people in need.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/about" className="btn-accent">
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/get-involved" className="btn border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20">
              <HeartHandshake className="h-4 w-4" /> Join Us
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-2">
            {values.map((value) => (
              <span
                key={value}
                className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/70"
              >
                {value}
              </span>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="animate-float rounded-[2rem] border border-white/20 bg-white/10 p-2 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.6)] backdrop-blur-md">
            <div className="rounded-[1.6rem] bg-white p-7 shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-700">Our calling</p>
              <h2 className="mt-3 font-heading text-3xl leading-tight text-primary-950">
                Faith in action,
                <br /> love in service.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                We visit the sick, support vulnerable families, encourage children, pray together, teach the Word of
                God, and serve our community.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["Community", "Service"],
                  ["Prayer", "& Worship"],
                  ["Children", "Support"],
                  ["Word of", "God"],
                ].map(([top, bottom]) => (
                  <div key={top} className="rounded-2xl bg-secondary/70 px-4 py-3 ring-1 ring-primary/5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-primary-700">{top}</p>
                    <p className="font-heading text-sm text-primary-950">{bottom}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/activities"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-800 transition hover:gap-3"
              >
                Explore our activities <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-8 rounded-2xl bg-accent px-5 py-4 text-primary-950 shadow-[0_18px_40px_-18px_rgba(212,175,55,0.9)]">
            <p className="font-heading text-lg leading-tight">Called to serve</p>
            <p className="text-xs font-medium">Serving God by Helping People</p>
          </div>
        </div>
      </div>
    </section>
  );
}
