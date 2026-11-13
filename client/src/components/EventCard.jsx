import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { resolveImage } from "../services/api";
import { formatDay, formatDateTime, formatMonth } from "../utils/format";

const statusStyles = {
  upcoming: "badge-green",
  completed: "badge-gray",
  cancelled: "badge-red",
};

export default function EventCard({ event }) {
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden sm:flex-row">
      <div className="relative h-48 shrink-0 overflow-hidden bg-secondary sm:h-auto sm:w-52">
        {event.image ? (
          <img
            src={resolveImage(event.image)}
            alt={event.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-primary-700">CSO Event</div>
        )}
        <div className="absolute left-4 top-4 flex flex-col items-center rounded-2xl bg-white/95 px-3 py-2 shadow-sm">
          <span className="text-[10px] font-bold tracking-wider text-accent-dark">{formatMonth(event.event_date)}</span>
          <span className="font-heading text-xl leading-none text-primary-950">{formatDay(event.event_date)}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={statusStyles[event.status] || "badge-gray"}>{event.status}</span>
          <span className="text-xs text-slate-400">{formatDateTime(event.event_date)}</span>
        </div>
        <h3 className="mt-3 font-heading text-xl text-primary-950">{event.title}</h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">{event.description}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            {event.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary-700" /> {event.location}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-primary-700" /> {event.registered_count ?? 0} registered
            </span>
          </div>
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-800 transition group-hover:gap-3"
          >
            Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
