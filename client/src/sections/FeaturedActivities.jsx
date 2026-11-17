import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { publicApi } from "../services/api";
import useApiData from "../hooks/useApiData";
import { fallbackActivities } from "../data/fallbackData";
import ActivityCard from "../components/ActivityCard";
import SectionHeading from "../components/SectionHeading";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function FeaturedActivities() {
  const translationLanguage = useTranslationLanguage().language;
  const { data: activities, loading } = useApiData(
    () => publicApi.activities({ limit: 3 }),
    fallbackActivities.slice(0, 3),
  );

  return (
    translateNode(<section className="section bg-slate-50">
      <div className="container-cso">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="CSO Family activities"
            title="Mission activities"
            description="Published updates about CSO Family activities will appear here."
          />
          <Link to="/activities" className="btn-outline shrink-0">
            All activities <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading activities…" />
        ) : activities.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No activity updates have been published yet"
              description="Visit the About page to read the CSO Family mission activities."
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.slice(0, 3).map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </section>, translationLanguage)
  );
}
