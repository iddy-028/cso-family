import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { resolveImage } from "../services/api";
import { formatDate } from "../utils/format";

export default function ActivityCard({ activity }) {
  const translationLanguage = useTranslationLanguage().language;
  return (
    translateNode(<article className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {activity.image ? (
          <img
            src={resolveImage(activity.image)}
            alt={activity.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-primary-700">CSO Activity</div>
        )}
        <span className="absolute left-4 top-4 badge-gold bg-white/95">{activity.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-primary-700" /> {formatDate(activity.activity_date)}
          </span>
          {activity.location && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary-700" /> {activity.location}
            </span>
          )}
        </div>
        <h3 className="mt-3 font-heading text-xl text-primary-950">{activity.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">{activity.description}</p>
        <Link
          to={`/activities/${activity.id}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-800 transition group-hover:gap-3"
        >
          View Details <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>, translationLanguage)
  );
}
