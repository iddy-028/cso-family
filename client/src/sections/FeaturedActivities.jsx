import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { publicApi } from "../services/api";
import useApiData from "../hooks/useApiData";
import { fallbackActivities } from "../data/fallbackData";
import ActivityCard from "../components/ActivityCard";
import SectionHeading from "../components/SectionHeading";
import Loader from "../components/Loader";

export default function FeaturedActivities() {
  const { data: activities, loading } = useApiData(
    () => publicApi.activities({ limit: 3 }),
    fallbackActivities.slice(0, 3),
  );

  return (
    <section className="section bg-slate-50">
      <div className="container-cso">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Our activities"
            title="Serving people, one act of love at a time."
            description="From hospital visits to children's encouragement days, every activity is an opportunity to reflect God's love."
          />
          <Link to="/activities" className="btn-outline shrink-0">
            All activities <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading activities…" />
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activities.slice(0, 3).map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
