import { Link } from "react-router-dom";
import { ArrowRight, CalendarDays, HeartHandshake, Mail, Users } from "lucide-react";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import EmptyState from "../../components/EmptyState";
import { ErrorAlert } from "../../components/Alerts";
import useApiData from "../../hooks/useApiData";
import { adminApi } from "../../services/api";
import { formatDate } from "../../utils/format";

const fallbackStats = {
  totals: {
    volunteers: 0,
    pendingVolunteers: 0,
    activities: 0,
    events: 0,
    upcomingEvents: 0,
    messages: 0,
    unreadMessages: 0,
  },
  recentVolunteers: [],
  recentActivities: [],
  recentMessages: [],
};

const statusStyles = {
  pending: "badge-gold",
  approved: "badge-green",
  rejected: "badge-red",
  unread: "badge-gold",
  read: "badge-gray",
};

export default function AdminDashboard() {
  const { data, loading, error } = useApiData(() => adminApi.stats(), fallbackStats);
  const stats = data || fallbackStats;
  const totals = stats.totals || fallbackStats.totals;

  if (loading) return <Loader label="Loading dashboard..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-primary-950">Dashboard overview</h1>
          <p className="mt-1 text-sm text-slate-500">A summary of CSO activities, people, and messages.</p>
        </div>
        <Link to="/" className="btn-outline btn-sm">
          View website <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ErrorAlert message={error} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Volunteers"
          value={totals.volunteers}
          hint={`${totals.pendingVolunteers} pending review`}
          icon={Users}
          tone="green"
        />
        <StatCard
          label="Activities"
          value={totals.activities}
          hint="Community service records"
          icon={HeartHandshake}
          tone="gold"
        />
        <StatCard
          label="Events"
          value={totals.events}
          hint={`${totals.upcomingEvents} upcoming`}
          icon={CalendarDays}
          tone="blue"
        />
        <StatCard
          label="Messages"
          value={totals.messages}
          hint={`${totals.unreadMessages} unread`}
          icon={Mail}
          tone="red"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="admin-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg text-primary-950">Recent volunteer applications</h2>
            <Link to="/admin/volunteers" className="text-xs font-semibold text-primary-800 hover:underline">
              View all
            </Link>
          </div>
          {stats.recentVolunteers?.length ? (
            <ul className="mt-4 divide-y divide-slate-100">
              {stats.recentVolunteers.map((volunteer) => (
                <li key={volunteer.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-primary-950">{volunteer.full_name}</p>
                    <p className="truncate text-xs text-slate-500">{volunteer.email}</p>
                  </div>
                  <span className={statusStyles[volunteer.status] || "badge-gray"}>{volunteer.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4">
              <EmptyState title="No volunteer applications yet" description="New applications will appear here." />
            </div>
          )}
        </section>

        <section className="admin-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-lg text-primary-950">Recent activities</h2>
            <Link to="/admin/activities" className="text-xs font-semibold text-primary-800 hover:underline">
              Manage
            </Link>
          </div>
          {stats.recentActivities?.length ? (
            <ul className="mt-4 divide-y divide-slate-100">
              {stats.recentActivities.map((activity) => (
                <li key={activity.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-primary-950">{activity.title}</p>
                    <p className="truncate text-xs text-slate-500">
                      {activity.category} | {formatDate(activity.activity_date)}
                    </p>
                  </div>
                  <span className="badge-gray">{activity.location || "Location pending"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4">
              <EmptyState title="No activities yet" description="Create your first activity to get started." />
            </div>
          )}
        </section>
      </div>

      <section className="admin-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-lg text-primary-950">Recent messages</h2>
          <Link to="/admin/messages" className="text-xs font-semibold text-primary-800 hover:underline">
            Inbox
          </Link>
        </div>
        {stats.recentMessages?.length ? (
          <div className="table-wrap mt-4">
            <table className="data-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Received</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentMessages.map((message) => (
                  <tr key={message.id}>
                    <td>
                      <p className="font-medium text-primary-950">{message.full_name}</p>
                      <p className="text-xs text-slate-400">{message.email}</p>
                    </td>
                    <td className="max-w-xs truncate">{message.subject}</td>
                    <td>
                      <span className={statusStyles[message.status] || "badge-gray"}>{message.status}</span>
                    </td>
                    <td className="text-xs text-slate-500">{formatDate(message.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-4">
            <EmptyState title="No messages yet" description="Contact messages will appear here." />
          </div>
        )}
      </section>
    </div>
  );
}
