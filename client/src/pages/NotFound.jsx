import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <section className="section bg-slate-50">
      <div className="container-cso">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-card sm:p-12">
          <p className="font-heading text-6xl text-primary-950">404</p>
          <h1 className="mt-4 font-heading text-2xl text-primary-950">Page not found</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            The page you are looking for may have been moved, removed, or never existed.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link to="/" className="btn-primary">
              <Home className="h-4 w-4" /> Back to home
            </Link>
            <button type="button" onClick={() => window.history.back()} className="btn-outline">
              <ArrowLeft className="h-4 w-4" /> Go back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
