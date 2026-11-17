import { translateNode, translateText, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/activities", label: "Activities" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/get-involved", label: "Get Involved" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const translationLanguage = useTranslationLanguage().language;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, canManage, logout } = useAuth();
  const translatedLinks = links.map((link) => ({
    ...link,
    label: translateText(link.label, translationLanguage),
  }));
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    translateNode(<header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-[0_16px_32px_-22px_rgba(15,23,42,0.28)]" : ""
      }`}
    >
      <div className="bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 text-white">
        <div className="container-cso flex h-auto flex-wrap items-center justify-between gap-2 py-2 text-[11px] sm:text-xs">
          <p className="truncate font-medium uppercase tracking-[0.14em] text-white/90">Serving God by Helping People.</p>
          <p className="hidden shrink-0 text-white/70 sm:block">CSO Family · Called to Serve Others</p>
        </div>
      </div>

      <div className={`${scrolled ? "bg-white/85 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)] backdrop-blur-md" : "bg-white/90"}`}>
        <nav className="container-cso flex h-auto flex-wrap items-center justify-between gap-4 py-3" aria-label="Main navigation">
          <div className="flex items-center gap-4">
            <Logo />
          </div>

          <ul className="hidden items-center gap-1 rounded-full border border-primary/10 bg-slate-50/80 p-1.5 shadow-inner shadow-slate-200/60 lg:flex">
            {translatedLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `rounded-full px-3.5 py-2 text-sm font-medium transition-all ${
                      isActive ? "bg-primary text-white shadow-[0_8px_20px_-12px_rgba(20,83,45,0.8)]" : "text-slate-600 hover:bg-white hover:text-primary-900"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher />
            {canManage && (
              <Link to="/admin" className="btn-primary btn-sm">
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </Link>
            )}
            {user && (
              <button type="button" onClick={handleLogout} className="btn-outline btn-sm">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            )}
            <Link to="/get-involved" className="btn-accent btn-sm">
              Join Us
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-primary-900 shadow-sm lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {open && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <ul className="container-cso flex flex-col gap-1 py-4">
            <li className="px-4 pb-2">
              <LanguageSwitcher className="w-full justify-between" />
            </li>
            {translatedLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/"}
                  className={({ isActive }) =>
                    `block rounded-2xl px-4 py-3 text-sm font-medium ${
                      isActive ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-50"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="mt-3 flex gap-2">
              {canManage && (
                <Link to="/admin" className="btn-outline flex-1">
                  <LayoutDashboard className="mr-2 inline h-4 w-4" /> Dashboard
                </Link>
              )}
              {user && (
                <button type="button" onClick={handleLogout} className="btn-outline flex-1">
                  <LogOut className="mr-2 inline h-4 w-4" /> Sign out
                </button>
              )}
              <Link to="/get-involved" className="btn-primary flex-1">
                Join Us
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>, translationLanguage)
  );
}
