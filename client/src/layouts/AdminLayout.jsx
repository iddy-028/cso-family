import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Bell,
  CalendarDays,
  Globe,
  HeartHandshake,
  Images,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  UserCog,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { adminApi } from "../services/api";
import { initials } from "../utils/format";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/activities", label: "Activities", icon: HeartHandshake },
  { to: "/admin/events", label: "Events", icon: CalendarDays },
  { to: "/admin/volunteers", label: "Volunteers", icon: Users },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/messages", label: "Messages", icon: Mail },
  { to: "/admin/users", label: "Users", icon: UserCog, adminOnly: true },
];

const titles = {
  "/admin": "Dashboard",
  "/admin/activities": "Manage Activities",
  "/admin/events": "Manage Events",
  "/admin/volunteers": "Manage Volunteers",
  "/admin/gallery": "Manage Gallery",
  "/admin/messages": "Contact Messages",
  "/admin/users": "Manage Users",
};

export default function AdminLayout() {
  const { user, logout, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    let active = true;
    function refreshUnread() {
      adminApi
        .stats()
        .then((data) => {
          if (active) setUnread(data?.totals?.unreadMessages || 0);
        })
        .catch((error) => {
          if (active) console.error("Failed to refresh the unread message count.", error);
        });
    }

    refreshUnread();
    window.addEventListener("cso:messages-updated", refreshUnread);
    return () => {
      active = false;
      window.removeEventListener("cso:messages-updated", refreshUnread);
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#0d2f1c] via-[#103d27] to-[#0b2419]">
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
        <Link to="/admin" className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="" className="h-10 w-10 rounded-xl bg-white object-contain p-0.5" />
          <span>
            <span className="block font-heading text-lg font-bold text-white">CSO Admin</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-white/45">Management System</span>
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="grid h-9 w-9 place-items-center rounded-full text-white/70 hover:bg-white/10 lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">Manage</p>
        {navItems
          .filter((item) => !item.adminOnly || isAdmin)
          .map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center justify-between gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition ${
                  isActive ? "bg-white text-primary-950 shadow-[0_12px_35px_-18px_rgba(255,255,255,0.7)]" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="flex items-center gap-3">
                <Icon className="h-[18px] w-[18px]" />
                {label}
              </span>
              {label === "Messages" && unread > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-primary-950">{unread}</span>
              )}
            </NavLink>
          ))}
      </nav>

      <div className="space-y-2 border-t border-white/10 px-4 py-5">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <Globe className="h-[18px] w-[18px]" /> View Website
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-white/70 transition hover:bg-red-500/15 hover:text-red-200"
        >
          <LogOut className="h-[18px] w-[18px]" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(220,252,231,0.7),_rgba(248,250,252,1)_30%,_rgba(241,245,249,1)_100%)]">
      <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 bg-primary-950 shadow-2xl shadow-emerald-950/20 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            aria-label="Close sidebar"
          />
          <aside className="relative h-full w-72 animate-fade-in bg-primary-950">{sidebar}</aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200 bg-white/90 px-4 shadow-sm backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-primary-900 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="font-heading text-lg text-primary-950 sm:text-xl">{titles[location.pathname] || "Admin"}</p>
              <p className="hidden text-xs text-slate-400 sm:block">CSO – Called to Serve Others</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/messages"
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-primary/30 hover:text-primary-800"
              aria-label="Messages"
            >
              <Bell className="h-[18px] w-[18px]" />
              {unread > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[10px] font-bold text-primary-950">
                  {unread}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm sm:px-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-sm font-bold text-white">
                {initials(user?.full_name || "CSO")}
              </span>
              <span className="hidden text-left sm:block">
                <span className="block text-sm font-semibold leading-tight text-primary-950">{user?.full_name}</span>
                <span className="block text-[10px] uppercase tracking-wider text-slate-400">{user?.role}</span>
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
