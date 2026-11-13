import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays } from "lucide-react";
import { publicApi } from "../services/api";
import useApiData from "../hooks/useApiData";
import { fallbackEvents } from "../data/fallbackData";
import EventCard from "../components/EventCard";
import SectionHeading from "../components/SectionHeading";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function LatestEvents() {
  const { data: events, loading } = useApiData(
    () => publicApi.events({ status: "upcoming" }),
    fallbackEvents.filter((event) => event.status === "upcoming"),
  );

  return (
    <section className="section bg-white">
      <div className="container-cso">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Upcoming events"
            title="Come and serve with us."
            description="Prayer evenings, volunteer orientations, community outreach, and more. Everyone is welcome."
          />
          <Link to="/events" className="btn-outline shrink-0">
            All events <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading events…" />
        ) : events.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              icon={CalendarDays}
              title="No upcoming events yet"
              description="Check back soon or get involved to hear about the next gathering."
              action={
                <Link to="/get-involved" className="btn-primary">
                  Get Involved
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            {events.slice(0, 2).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
