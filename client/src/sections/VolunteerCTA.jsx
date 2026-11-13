import { Link } from "react-router-dom";
import { ArrowRight, HeartHandshake, Megaphone, Sparkles } from "lucide-react";

export default function VolunteerCTA() {
  return (
    <section className="section bg-white">
      <div className="container-cso">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-secondary px-6 py-14 sm:px-12 lg:px-16">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-2xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="eyebrow">
                <Sparkles className="h-3.5 w-3.5" /> Get involved
              </p>
              <h2 className="mt-3 font-heading text-3xl leading-tight text-primary-950 sm:text-4xl lg:text-5xl">
                Your hands can carry hope to someone today.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Whether you can visit, pray, share a skill, or give your time, there is a place for you at CSO. Join a
                community that serves God by helping people.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/get-involved" className="btn-primary">
                  Become a Volunteer <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="btn-outline">
                  Talk to us
                </Link>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: HeartHandshake, title: "Serve", text: "Join a team and take part in community activities." },
                { icon: Megaphone, title: "Share", text: "Invite others and help spread the word about CSO." },
                { icon: Sparkles, title: "Support", text: "Pray for the work and support activities as able." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-heading text-lg text-primary-950">{title}</p>
                    <p className="text-xs leading-relaxed text-slate-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
