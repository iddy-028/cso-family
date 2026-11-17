import { translateNode, useLanguage as useTranslationLanguage } from "../../context/LanguageContext.jsx";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
  Clock3,
  HeartHandshake,
  Mail,
  Play,
  Users,
} from "lucide-react";
import Loader from "../../components/Loader";
import useApiData from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
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

const shortcuts = [
  { to: "/admin/activities", label: "Activities", icon: HeartHandshake },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/videos", label: "Videos", icon: Play },
];

const panelClass = "rounded-[26px] border border-white/[0.08] bg-[#111013]/90 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl";
const mutedClass = "text-white/45";

export default function AdminDashboard() {
  const translationLanguage = useTranslationLanguage().language;
  const { user } = useAuth();
  const { data, loading, error } = useApiData(() => adminApi.stats(), fallbackStats);
  const stats = data || fallbackStats;
  const totals = stats.totals || fallbackStats.totals;

  if (loading) {
    return translateNode(
      <div className={`${panelClass} text-white`}>
        <Loader label="Loading dashboard..." />
      </div>,
      translationLanguage,
    );
  }

  return (
    translateNode(<div className="space-y-5 text-white">
      {error && (
        <div className="rounded-2xl border border-red-300/20 bg-red-950/40 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-medium text-white/45">CSO · Called to Serve Others</p>
          <h1 className="mt-1 font-heading text-3xl tracking-tight text-white sm:text-4xl">
            Welcome, <span className="text-[#d6afd0]">{user?.full_name?.split(" ")[0] || "Admin"}</span>
          </h1>
          <p className="mt-1 text-sm text-white/45">Here&apos;s your community service overview.</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-white/75 transition hover:border-[#c08bb8]/40 hover:bg-white/[0.08] hover:text-white"
        >
          View website <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <nav aria-label="Dashboard shortcuts" className="flex flex-wrap gap-2">
        {shortcuts.map(({ to, label, icon: Icon }, index) => (
          <Link
            key={to}
            to={to}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
              index === 0
                ? "bg-gradient-to-r from-[#694d69] to-[#3c2d40] text-white shadow-[0_8px_24px_-12px_rgba(202,144,191,0.65)]"
                : "border border-white/10 bg-white/[0.035] text-white/65 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" /> {label}
          </Link>
        ))}
      </nav>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="grid gap-4 sm:grid-cols-2 xl:col-span-4 xl:grid-cols-1">
          <section className={`${panelClass} relative min-h-[168px] overflow-hidden`}>
            <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#a66d9d]/15 blur-3xl" />
            <div className="relative flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-white/65">Volunteers</p>
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.045] text-[#d7b4d2]">
                <Users className="h-4 w-4" />
              </span>
            </div>
            <p className="relative mt-5 font-heading text-4xl tracking-tight text-white">{totals.volunteers}</p>
            <p className="relative mt-2 inline-flex items-center gap-1.5 text-xs text-[#b8dfa9]">
              <Clock3 className="h-3.5 w-3.5" /> {totals.pendingVolunteers} pending review
            </p>
          </section>

          <Link
            to="/admin/volunteers"
            className="group relative flex min-h-[168px] flex-col justify-between overflow-hidden rounded-[26px] border border-[#bd86b2]/20 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(167,101,156,0.35),_transparent_60%),linear-gradient(145deg,#29202b,#171519_70%)] p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] transition hover:border-[#d3a2ca]/40"
          >
            <div>
              <p className="font-heading text-xl text-white">People make the mission.</p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
                Review volunteer applications and welcome people ready to serve.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#b276a9] to-[#79547e] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#9c6795]/20">
              Manage volunteers <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>

        <section className={`${panelClass} xl:col-span-5`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg text-white">Recent volunteers</h2>
              <p className={`mt-1 text-xs ${mutedClass}`}>Latest community applications</p>
            </div>
            <Link to="/admin/volunteers" className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/65 transition hover:bg-white/10 hover:text-white">
              See all <ArrowRight className="ml-1 inline h-3 w-3" />
            </Link>
          </div>
          {stats.recentVolunteers?.length ? (
            <ul className="mt-4 divide-y divide-white/[0.07]">
              {stats.recentVolunteers.slice(0, 4).map((volunteer) => (
                <li key={volunteer.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#4c394e] to-[#29232d] text-xs font-semibold text-[#e2c8df]">
                      {(volunteer.full_name || "V").trim().charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white/90">{volunteer.full_name}</p>
                      <p className={`truncate text-xs ${mutedClass}`}>{volunteer.email}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                    volunteer.status === "approved"
                      ? "bg-emerald-400/10 text-emerald-300"
                      : volunteer.status === "rejected"
                        ? "bg-red-400/10 text-red-300"
                        : "bg-amber-300/10 text-amber-200"
                  }`}>
                    {volunteer.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`mt-6 rounded-2xl border border-dashed border-white/10 p-4 text-sm ${mutedClass}`}>
              New volunteer applications will appear here.
            </p>
          )}
        </section>

        <section className={`${panelClass} xl:col-span-3`}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg text-white">At a glance</h2>
              <p className={`mt-1 text-xs ${mutedClass}`}>Your CSO workspace</p>
            </div>
            <ArrowDownRight className="h-4 w-4 text-[#bd91b7]" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { label: "Activities", value: totals.activities, icon: HeartHandshake, to: "/admin/activities" },
              { label: "Events", value: totals.events, icon: CalendarDays, to: "/admin/events" },
              { label: "Upcoming", value: totals.upcomingEvents, icon: Clock3, to: "/admin/events" },
              { label: "Unread messages", value: totals.unreadMessages, icon: Mail, to: "/admin/messages" },
            ].map(({ label, value, icon: Icon, to }) => (
              <Link key={label} to={to} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3 transition hover:border-[#bd86b2]/30 hover:bg-white/[0.06]">
                <Icon className="h-4 w-4 text-[#c394bb]" />
                <p className="mt-3 font-heading text-2xl text-white">{value}</p>
                <p className={`mt-0.5 text-[11px] ${mutedClass}`}>{label}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className={panelClass}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg text-white">Recent activities</h2>
              <p className={`mt-1 text-xs ${mutedClass}`}>Community service records</p>
            </div>
            <Link to="/admin/activities" className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/65 transition hover:bg-white/10 hover:text-white">
              Manage <ArrowRight className="ml-1 inline h-3 w-3" />
            </Link>
          </div>
          {stats.recentActivities?.length ? (
            <ul className="mt-4 divide-y divide-white/[0.07]">
              {stats.recentActivities.slice(0, 4).map((activity) => (
                <li key={activity.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white/90">{activity.title}</p>
                    <p className={`mt-1 truncate text-xs ${mutedClass}`}>
                      {activity.category} <span className="px-1 text-white/20">·</span> {formatDate(activity.activity_date)}
                    </p>
                  </div>
                  <span className="max-w-[40%] truncate rounded-full border border-white/[0.08] px-2.5 py-1 text-[10px] text-white/45">
                    {activity.location || "Location pending"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`mt-6 rounded-2xl border border-dashed border-white/10 p-4 text-sm ${mutedClass}`}>
              Create an activity to start sharing service updates.
            </p>
          )}
        </section>

        <section className={panelClass}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg text-white">Recent messages</h2>
              <p className={`mt-1 text-xs ${mutedClass}`}>Messages from the community</p>
            </div>
            <Link to="/admin/messages" className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/65 transition hover:bg-white/10 hover:text-white">
              Inbox <ArrowRight className="ml-1 inline h-3 w-3" />
            </Link>
          </div>
          {stats.recentMessages?.length ? (
            <ul className="mt-4 divide-y divide-white/[0.07]">
              {stats.recentMessages.slice(0, 4).map((message) => (
                <li key={message.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white/90">{message.full_name}</p>
                    <p className={`mt-1 truncate text-xs ${mutedClass}`}>{message.subject}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-white/40">{formatDate(message.created_at)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`mt-6 rounded-2xl border border-dashed border-white/10 p-4 text-sm ${mutedClass}`}>
              Contact messages will appear here.
            </p>
          )}
        </section>
      </div>
    </div>, translationLanguage)
  );
}
