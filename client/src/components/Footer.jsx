import { Link } from "react-router-dom";
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import Logo from "./Logo";

const quickLinks = [
  { to: "/about", label: "About Us" },
  { to: "/activities", label: "Our Activities" },
  { to: "/events", label: "Events" },
  { to: "/gallery", label: "Gallery" },
  { to: "/get-involved", label: "Get Involved" },
  { to: "/contact", label: "Contact Us" },
];

const socials = [
  { label: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { label: "Twitter", icon: Twitter, href: "https://x.com" },
  { label: "YouTube", icon: Youtube, href: "https://youtube.com" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-primary-950 text-white">
      <div className="container-cso grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <Logo light />
          <p className="max-w-xs text-sm leading-relaxed text-white/65">
            A Christian organization serving God by helping people through community service, prayer, charity, and
            sharing the Word of God.
          </p>
          <div className="flex gap-2">
            {socials.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/75 transition hover:bg-accent hover:text-primary-950"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-heading text-lg text-white">Quick Links</h3>
          <ul className="mt-5 space-y-3 text-sm">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-white/65 transition hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg text-white">Our Focus</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/65">
            <li>Visiting the sick</li>
            <li>Helping vulnerable people</li>
            <li>Supporting children</li>
            <li>Prayer and worship</li>
            <li>Teaching the Word of God</li>
            <li>Charity and community service</li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg text-white">Contact</h3>
          <ul className="mt-5 space-y-4 text-sm text-white/65">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>Kigali, Rwanda (exact address pending verification)</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <span>+250 784 747 387</span>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <a href="mailto:cso@gmail.com" className="transition hover:text-accent">
                cso@gmail.com
              </a>
            </li>
          </ul>
          <Link to="/get-involved" className="btn-accent btn-sm mt-6">
            Become a Volunteer
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-cso flex flex-col gap-3 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CSO – Called to Serve Others. All rights reserved.</p>
          <p>Contact details and leadership information are placeholders until verified.</p>
        </div>
      </div>
    </footer>
  );
}
