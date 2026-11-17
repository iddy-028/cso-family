import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import PageHero from "../components/PageHero";
import ActivityCard from "../components/ActivityCard";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { activityCategories, fallbackActivities } from "../data/fallbackData";
import { publicApi } from "../services/api";
import useApiData from "../hooks/useApiData";
import { useSiteContent } from "../context/SiteContentContext.jsx";

export default function Activities() {
  const translationLanguage = useTranslationLanguage().language;
  const getContent = useSiteContent();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredFallback = useMemo(() => {
    const term = search.toLowerCase();
    return fallbackActivities.filter((activity) => {
      const matchesCategory = !category || activity.category === category;
      const matchesSearch =
        !term ||
        activity.title.toLowerCase().includes(term) ||
        activity.description.toLowerCase().includes(term) ||
        (activity.location || "").toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const {
    data: activities,
    loading,
    error,
  } = useApiData(
    () => publicApi.activities({ search, category }),
    filteredFallback,
    [search, category],
  );

  const categories = ["", ...activityCategories];

  return (
    translateNode(<>
      <PageHero
        eyebrow={getContent("activities.cso.hero.eyebrow", "CSO Family mission activities")}
        title={getContent("activities.cso.hero.title", "CSO Family mission activities")}
        description={getContent("activities.cso.hero.description", "Our mission includes hospital visits, student support for school fees and supplies, helping people in need, sharing God's Word, and encouraging those who need support.")}
        image="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80"
        breadcrumb="Activities"
      />

      <section className="section bg-slate-50">
        <div className="container-cso">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search activities by title, description, or location…"
                className="input pl-11"
                aria-label="Search activities"
              />
            </div>
            <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-slate-400">
              <SlidersHorizontal className="h-4 w-4" />
              {activities.length} {activities.length === 1 ? "activity" : "activities"}
            </p>
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item || "all"}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  category === item
                    ? "bg-primary text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-primary/30 hover:text-primary-900"
                }`}
              >
                {item || "All categories"}
              </button>
            ))}
          </div>

          {loading ? (
            <Loader label="Loading activities…" />
          ) : activities.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                title="No activities found"
                description="Published CSO activity updates will appear here. See the About page for the full mission activities."
              />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          )}

          {error && (
            <p className="mt-8 text-center text-xs text-slate-400">
              Activity updates are temporarily unavailable.
            </p>
          )}
        </div>
      </section>
    </>, translationLanguage)
  );
}
