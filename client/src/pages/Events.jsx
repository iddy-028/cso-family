import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { useMemo, useState } from "react";
import { CalendarDays, Search } from "lucide-react";
import PageHero from "../components/PageHero";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { fallbackEvents } from "../data/fallbackData";
import { publicApi } from "../services/api";
import useApiData from "../hooks/useApiData";
import { useSiteContent } from "../context/SiteContentContext.jsx";

const tabs = [
  { value: "upcoming", label: "Upcoming events" },
  { value: "past", label: "Past events" },
];

export default function Events() {
  const translationLanguage = useTranslationLanguage().language;
  const getContent = useSiteContent();
  const [status, setStatus] = useState("upcoming");
  const [search, setSearch] = useState("");

  const filteredFallback = useMemo(() => {
    const term = search.toLowerCase();
    return fallbackEvents.filter((event) => {
      const matchesStatus = status === "upcoming" ? event.status === "upcoming" : event.status !== "upcoming";
      const matchesSearch =
        !term ||
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        (event.location || "").toLowerCase().includes(term);
      return matchesStatus && matchesSearch;
    });
  }, [status, search]);

  const { data: events, loading, error } = useApiData(
    () => publicApi.events({ status, search }),
    filteredFallback,
    [status, search],
  );

  return (
    translateNode(<>
      <PageHero
        eyebrow={getContent("events.cso.hero.eyebrow", "CSO Family events")}
        title={getContent("events.cso.hero.title", "Official CSO Family events")}
        description={getContent("events.cso.hero.description", "Events, dates, and locations will be shown here when they are officially published by CSO Family.")}
        image="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80"
        breadcrumb="Events"
      />

      <section className="section bg-slate-50">
        <div className="container-cso">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setStatus(tab.value)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                    status === tab.value
                      ? "bg-primary text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-primary/30"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search events…"
                className="input pl-11"
                aria-label="Search events"
              />
            </div>
          </div>

          {loading ? (
            <Loader label="Loading events…" />
          ) : events.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                icon={CalendarDays}
                title={status === "upcoming" ? "No upcoming events" : "No past events to display"}
                description="Official CSO Family events will appear here when they are published."
              />
            </div>
          ) : (
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {error && (
            <p className="mt-8 text-center text-xs text-slate-400">
              Event information is temporarily unavailable.
            </p>
          )}
        </div>
      </section>
    </>, translationLanguage)
  );
}
