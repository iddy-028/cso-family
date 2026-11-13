import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import PageHero from "../components/PageHero";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import ActivityCard from "../components/ActivityCard";
import { fallbackActivities } from "../data/fallbackData";
import { publicApi, resolveImage } from "../services/api";
import useApiData from "../hooks/useApiData";
import { formatDate } from "../utils/format";

export default function ActivityDetails() {
  const { id } = useParams();
  const fallback = fallbackActivities.find((activity) => String(activity.id) === String(id)) || null;

  const { data: activity, loading } = useApiData(() => publicApi.activity(id), fallback, [id]);
  const { data: related } = useApiData(
    () => publicApi.activities({ limit: 4 }),
    fallbackActivities,
  );

  if (loading) return <Loader full label="Loading activity…" />;

  if (!activity) {
    return (
      <div className="container-cso py-20">
        <EmptyState
          title="Activity not found"
          description="This activity may have been removed or the link may be incorrect."
          action={
            <Link to="/activities" className="btn-primary">
              Back to activities
            </Link>
          }
        />
      </div>
    );
  }

  const relatedItems = related.filter((item) => String(item.id) !== String(activity.id)).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={activity.category}
        title={activity.title}
        description={activity.location ? `Serving in ${activity.location}` : "An activity of CSO – Called to Serve Others"}
        image={resolveImage(activity.image)}
        breadcrumb="Activity Details"
      />

      <section className="section bg-white">
        <div className="container-cso grid gap-10 lg:grid-cols-[1.6fr_0.9fr]">
          <article>
            <Link to="/activities" className="inline-flex items-center gap-2 text-sm font-semibold text-primary-800">
              <ArrowLeft className="h-4 w-4" /> All activities
            </Link>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="badge-gold">{activity.category}</span>
              <span className="badge-green inline-flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" /> {formatDate(activity.activity_date)}
              </span>
              {activity.location && (
                <span className="badge-gray inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {activity.location}
                </span>
              )}
            </div>
            <h2 className="mt-6 font-heading text-3xl text-primary-950">About this activity</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-slate-600">{activity.description}</p>

            <div className="mt-8 rounded-3xl bg-secondary/50 p-6">
              <h3 className="font-heading text-xl text-primary-950">Want to be part of the next one?</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Volunteers make this work possible. Register your interest and the CSO team will contact you about
                upcoming activities.
              </p>
              <Link to="/get-involved" className="btn-primary mt-5">
                Become a volunteer <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>

          <aside className="space-y-4">
            {activity.image && (
              <img
                src={resolveImage(activity.image)}
                alt={activity.title}
                className="w-full rounded-3xl object-cover shadow-card"
                loading="lazy"
              />
            )}
            <div className="card p-6">
              <h3 className="font-heading text-lg text-primary-950">Activity details</h3>
              <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Category</dt>
                  <dd className="text-right font-medium text-primary-900">{activity.category}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Date</dt>
                  <dd className="text-right font-medium text-primary-900">{formatDate(activity.activity_date)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Location</dt>
                  <dd className="text-right font-medium text-primary-900">{activity.location || "To be confirmed"}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </section>

      {relatedItems.length > 0 && (
        <section className="section-tight bg-slate-50">
          <div className="container-cso">
            <h2 className="font-heading text-2xl text-primary-950">More ways we serve</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedItems.map((item) => (
                <ActivityCard key={item.id} activity={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
