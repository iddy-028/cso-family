import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Inbox } from "lucide-react";

export default function EmptyState({ title = "Nothing here yet", description, action, icon: Icon = Inbox }) {
  const translationLanguage = useTranslationLanguage().language;
  return (
    translateNode(<div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-primary-700 shadow-sm">
        <Icon className="h-7 w-7" />
      </span>
      <h3 className="mt-5 font-heading text-xl text-primary-950">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>, translationLanguage)
  );
}
