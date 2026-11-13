import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Eye, Flag, Target, UserRound } from "lucide-react";
import PageHero from "../components/PageHero";
import SectionHeading from "../components/SectionHeading";
import { coreValues } from "../data/fallbackData";

const goals = [
  "Promote CSO and its Christian mission online.",
  "Share information about the organization's activities.",
  "Publish upcoming events and announcements.",
  "Showcase community service through photographs.",
  "Invite and register volunteers.",
  "Improve communication between CSO and the community.",
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About CSO"
        title="Called to Serve Others"
        description="A Christian organization in Rwanda, serving God by helping people through community service, prayer, charity, and the Word of God."
        image="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80"
        breadcrumb="About Us"
      />

      <section className="section bg-white">
        <div className="container-cso grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Our identity"
              title="A community called to reflect God's love."
              description="CSO – Called to Serve Others exists to serve God by helping people. We believe faith is best expressed through action: caring for the sick, standing with vulnerable families, encouraging children, praying together, and sharing the hope of the Gospel."
            />
            <p className="mt-5 body-muted">
              Our work is rooted in the example of Christ, who came not to be served but to serve. Every activity is an
              invitation to the community to experience God's love in a practical way.
            </p>
            <div className="mt-7 rounded-2xl border border-secondary bg-secondary/40 p-5">
              <p className="text-sm font-semibold text-primary-900">Note about our history</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">
                The organization's official history, founding details, contact information, and leadership names will
                be published once verified by CSO leadership. This website currently uses clearly marked placeholders.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80"
              alt="Volunteers serving the community"
              className="col-span-2 aspect-[16/10] w-full rounded-3xl object-cover shadow-card"
              loading="lazy"
            />
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80"
              alt="Children in the community"
              className="aspect-square w-full rounded-3xl object-cover shadow-card"
              loading="lazy"
            />
            <img
              src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=600&q=80"
              alt="Prayer and worship"
              className="aspect-square w-full rounded-3xl object-cover shadow-card"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-cso">
          <SectionHeading
            eyebrow="Mission & vision"
            title="Why we serve."
            description="Our mission and vision guide every activity, partnership, and act of service."
            align="center"
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="card p-8">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-accent">
                <Target className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-heading text-2xl text-primary-950">Mission Statement</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                To serve God by helping people through community service, Christian activities, charity, prayer, and
                spreading the Word of God.
              </p>
            </article>
            <article className="card p-8">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-primary-950">
                <Eye className="h-7 w-7" />
              </span>
              <h3 className="mt-5 font-heading text-2xl text-primary-950">Vision Statement</h3>
              <p className="mt-3 leading-relaxed text-slate-600">
                A caring community where the love of God is seen in service, where vulnerable people find support, and
                where faith is shared with compassion and unity.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-cso">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <SectionHeading
              eyebrow="Core values"
              title="The values that shape us."
              description="These values guide how we serve God and how we treat every person we meet."
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {coreValues.map((value, index) => (
                <div
                  key={value.title}
                  className={`rounded-3xl p-6 ${index === 4 ? "bg-primary-950 text-white sm:col-span-2" : "bg-secondary/50"}`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-[0.22em] ${index === 4 ? "text-accent" : "text-primary-700"}`}>
                    0{index + 1}
                  </p>
                  <h3 className={`mt-3 font-heading text-xl ${index === 4 ? "text-white" : "text-primary-950"}`}>
                    {value.title}
                  </h3>
                  <p className={`mt-2 text-sm leading-relaxed ${index === 4 ? "text-white/65" : "text-slate-600"}`}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-slate-50">
        <div className="container-cso grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our goals" title="What we are working toward." />
            <ul className="mt-7 space-y-4">
              {goals.map((goal) => (
                <li key={goal} className="flex gap-3 text-sm leading-relaxed text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
                  {goal}
                </li>
              ))}
            </ul>
            <Link to="/get-involved" className="btn-primary mt-8">
              Join the mission <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div>
            <SectionHeading eyebrow="Leadership & team" title="The people behind the service." />
            <div className="mt-7 space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white/60 p-5">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-secondary text-primary-700">
                    <UserRound className="h-7 w-7" />
                  </span>
                  <div>
                    <p className="font-heading text-lg text-primary-950">Team member name pending verification</p>
                    <p className="text-xs uppercase tracking-wider text-slate-400">Role and biography to be provided by CSO</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-accent/10 p-5 text-sm text-slate-600">
              <Flag className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark" />
              <p>
                CSO will provide verified leadership names, roles, photographs, and history. No official details have
                been invented for this website.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
