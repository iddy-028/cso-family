import { Link } from "react-router-dom";
import { ArrowRight, Eye, Target } from "lucide-react";
import SectionHeading from "../components/SectionHeading";

export default function MissionVision() {
  return (
    <section className="section bg-white">
      <div className="container-cso grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            eyebrow="Who we are"
            title="A community shaped by faith and compassion."
            description="CSO brings people together to serve God through practical love — visiting the sick, standing with vulnerable families, supporting children, praying with the community, and sharing the hope of the Gospel."
          />
          <Link to="/about" className="btn-outline mt-7">
            Discover our story <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <article className="card card-hover bg-secondary/50 p-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-accent">
              <Target className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-heading text-2xl text-primary-950">Our Mission</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              To serve God by helping people through community service, Christian activities, charity, prayer, and
              spreading the Word of God.
            </p>
          </article>
          <article className="card card-hover p-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-primary-950">
              <Eye className="h-6 w-6" />
            </span>
            <h3 className="mt-5 font-heading text-2xl text-primary-950">Our Vision</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              A community where faith is lived out in love, where people are cared for, and where every act of service
              points to the hope we have in Christ.
            </p>
          </article>
          <div className="card bg-primary-950 p-7 text-white sm:col-span-2">
            <p className="font-heading text-2xl leading-snug">
              “Whatever you did for one of the least of these brothers and sisters of mine, you did for me.”
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-accent">Matthew 25:40</p>
          </div>
        </div>
      </div>
    </section>
  );
}
