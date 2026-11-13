import { HandHeart, HeartPulse, Home, Smile, BookOpen, Church } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

const impactAreas = [
  {
    icon: HeartPulse,
    title: "Care for the sick",
    text: "Visiting hospitals and homes to pray, encourage, and support patients and their families.",
  },
  {
    icon: Home,
    title: "Support for the vulnerable",
    text: "Standing with disadvantaged families through practical help and community care.",
  },
  {
    icon: Smile,
    title: "Children and youth",
    text: "Encouraging children through visits, mentorship, games, and learning activities.",
  },
  {
    icon: Church,
    title: "Prayer and worship",
    text: "Gathering the community for prayer, worship, and fellowship.",
  },
  {
    icon: BookOpen,
    title: "The Word of God",
    text: "Teaching and sharing Scripture to strengthen faith and hope.",
  },
  {
    icon: HandHeart,
    title: "Charity and service",
    text: "Mobilizing volunteers and resources to meet real needs with love.",
  },
];

export default function ImpactSection() {
  return (
    <section className="section relative overflow-hidden bg-primary-950 text-white">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-primary-700/30 blur-3xl" />
      <div className="container-cso relative">
        <SectionHeading
          eyebrow="Community impact"
          title="Faith expressed through service."
          description="Our impact is measured in lives touched, hope shared, and a community drawn closer together. These are the areas where CSO serves."
          align="center"
          className="[&_h2]:text-white [&_p]:text-white/65"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {impactAreas.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-accent/40 hover:bg-white/[0.07]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent">
                <Icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-heading text-xl text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{text}</p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs uppercase tracking-[0.2em] text-white/35">
          Verified impact statistics will be published once provided by CSO leadership.
        </p>
      </div>
    </section>
  );
}
