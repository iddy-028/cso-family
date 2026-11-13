import { Link } from "react-router-dom";

export default function Logo({ light = false, compact = false }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-3" aria-label="CSO home">
      <img
        src="/logo.jpeg"
        alt=""
        className={`h-12 w-12 rounded-full bg-white object-contain p-0.5 shadow-sm transition group-hover:scale-105 sm:h-14 sm:w-14 ${
          light ? "ring-1 ring-white/25" : "ring-1 ring-slate-200"
        }`}
      />
      <span className="leading-none">
        <span
          className={`block font-heading text-xl font-bold tracking-wide ${light ? "text-white" : "text-primary-950"}`}
        >
          CSO
        </span>
        {!compact && (
          <span className={`mt-1 block text-[10px] font-medium uppercase tracking-[0.18em] ${light ? "text-white/70" : "text-slate-500"}`}>
            Called to Serve Others
          </span>
        )}
      </span>
    </Link>
  );
}
