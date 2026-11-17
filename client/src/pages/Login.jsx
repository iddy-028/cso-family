import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import Logo from "../components/Logo";
import { ErrorAlert } from "../components/Alerts";
import { TextField } from "../components/FormFields";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";
import LanguageSwitcher from "../components/LanguageSwitcher";

const initialForm = { email: "", password: "", remember: true };

export default function Login() {
  const translationLanguage = useTranslationLanguage().language;
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const user = await login(form);
      const redirectTo = location.state?.from || (user.role === "admin" || user.role === "staff" ? "/admin" : "/");
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    translateNode(<div className="grid min-h-screen bg-slate-100 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-primary-950 lg:block">
        <img
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-950/90 to-primary-900/60" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo light />
          <div className="max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-accent">CSO Management System</p>
            <h1 className="mt-4 font-heading text-4xl leading-tight text-white">
              Serving God by Helping People.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              Sign in to manage CSO activities, events, volunteers, gallery, messages, and user accounts.
            </p>
          </div>
          <p className="text-xs text-white/45">Authorized users only.</p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(220,252,231,0.9),_rgba(255,255,255,0.98)_40%,_rgba(248,250,252,1)_100%)] px-5 py-12 sm:px-10">
        <div className="w-full max-w-md rounded-[30px] border border-emerald-100 bg-white/90 p-6 shadow-[0_25px_80px_-35px_rgba(20,83,45,0.45)] backdrop-blur sm:p-8">
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="mt-8 lg:mt-0">
            <p className="eyebrow">Welcome back</p>
            <h2 className="mt-3 font-heading text-3xl text-primary-950">Sign in to your account</h2>
            <p className="mt-2 text-sm text-slate-500">
              Management accounts only. Contact your administrator if you need access.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <TextField
              label="Email address"
              name="email"
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={(event) => updateField("password", event.target.value)}
              placeholder="Your password"
              autoComplete="current-password"
              required
            />

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(event) => updateField("remember", event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                Remember me
              </label>
              <Link to="/contact" className="font-semibold text-primary-800 hover:underline">
                Forgot password?
              </Link>
            </div>

            <ErrorAlert message={error} />

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? (
                "Signing in..."
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Sign in
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-400">
            Only accounts created by a CSO administrator can sign in.
          </p>
          <Link to="/" className="mt-4 block text-center text-xs font-semibold text-slate-500 hover:text-primary-800">
            Back to website
          </Link>
        </div>
      </div>
    </div>, translationLanguage)
  );
}
