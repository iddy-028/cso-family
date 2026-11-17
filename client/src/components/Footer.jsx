import { translateNode, translateText, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Link } from "react-router-dom";
import Logo from "./Logo";
import { useSiteContent } from "../context/SiteContentContext.jsx";

const quickLinks = [
  { to: "/about", label: "About Us" },
  { to: "/activities", label: "Our Activities" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/get-involved", label: "Get Involved" },
  { to: "/contact", label: "Contact Us" },
];

export default function Footer() {
  const translationLanguage = useTranslationLanguage().language;
  const getContent = useSiteContent();
  const translatedQuickLinks = quickLinks.map((link) => ({
    ...link,
    label: translateText(link.label, translationLanguage),
  }));
  const missionItems = getContent("about.family.mission.items", "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
  return (
    translateNode(<footer className="mt-auto bg-primary-950 text-white">
      <div className="container-cso grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-5">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed text-white/65">
            {getContent("about.family.introduction", "CSO Family was founded by 15 students to serve God by helping people.")}
          </p>
        </div>

        <div>
          <h3 className="font-heading text-lg text-white">Quick Links</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {translatedQuickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-white/65 transition hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg text-white">Our mission</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/65">
            {missionItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <Link to="/get-involved" className="btn-accent btn-sm mt-6">
            {translateText("Get involved", translationLanguage)}
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-cso flex flex-col gap-3 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CSO – Called to Serve Others. All rights reserved.</p>
          <p>CSO Family · Called to Serve Others</p>
        </div>
      </div>
    </footer>, translationLanguage)
  );
}
