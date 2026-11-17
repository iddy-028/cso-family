import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
export default function StatCard({ label, value, hint, icon: Icon, tone = "green" }) {
  const translationLanguage = useTranslationLanguage().language;
  const tones = {
    green: "bg-secondary text-primary-800",
    gold: "bg-accent/15 text-accent-dark",
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-600",
  };

  return (
    translateNode(<div className="admin-card flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="mt-2 font-heading text-3xl text-primary-950">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>
      {Icon && (
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tones[tone] || tones.green}`}>
          <Icon className="h-6 w-6" />
        </span>
      )}
    </div>, translationLanguage)
  );
}
