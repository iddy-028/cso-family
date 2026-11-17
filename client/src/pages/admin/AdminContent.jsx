import { translateNode, useLanguage as useTranslationLanguage } from "../../context/LanguageContext.jsx";
import { useEffect, useState } from "react";
import { Check, Save } from "lucide-react";
import { ErrorAlert, SuccessAlert } from "../../components/Alerts";
import { adminApi, getErrorMessage, publicApi } from "../../services/api";
import { SITE_CONTENT_PAGES } from "../../data/siteContent.js";

function starterValues() {
  const values = {};
  SITE_CONTENT_PAGES.forEach(({ fields }) => {
    fields.forEach((field) => {
      values[field.key] = { en: field.en, rw: field.rw };
    });
  });
  return values;
}

export default function AdminContent() {
  const translationLanguage = useTranslationLanguage().language;
  const [values, setValues] = useState(starterValues);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    publicApi.content()
      .then((rows) => {
        if (!active) return;
        setValues((current) => {
          const next = { ...current };
          rows.forEach(({ content_key: key, language, content }) => {
            if (next[key] && (language === "en" || language === "rw")) {
              next[key] = { ...next[key], [language]: content };
            }
          });
          return next;
        });
      })
      .catch((err) => {
        if (active) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function updateField(key, language, value) {
    setValues((current) => ({
      ...current,
      [key]: { ...current[key], [language]: value },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const content = { en: {}, rw: {} };
    SITE_CONTENT_PAGES.forEach(({ fields }) => {
      fields.forEach(({ key }) => {
        content.en[key] = values[key].en;
        content.rw[key] = values[key].rw;
      });
    });

    try {
      await adminApi.saveContent(content);
      setNotice("Website content saved. Changes are now visible on the public site.");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    translateNode(<div className="space-y-5">
      <div>
        <h1 className="font-heading text-2xl text-primary-950">Website content</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-500">
          Edit public website headings and CSO Family information in English and Kinyarwanda separately.
          Save your changes to publish them on the website.
        </p>
      </div>

      <SuccessAlert message={notice} />
      <ErrorAlert message={error} />

      {loading ? (
        <div className="admin-card text-sm text-slate-500">Loading website content…</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {SITE_CONTENT_PAGES.map((page) => (
            <details key={page.id} className="admin-card group">
              <summary className="cursor-pointer list-none font-heading text-lg font-semibold text-primary-950 marker:hidden">
                <span className="flex items-center justify-between">
                  {page.label}
                  <span className="text-xs font-medium text-slate-400 group-open:hidden">Expand</span>
                  <span className="hidden text-xs font-medium text-slate-400 group-open:inline">Collapse</span>
                </span>
              </summary>
              <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
                {page.fields.map((field) => (
                  <fieldset key={field.key} className="grid gap-3 lg:grid-cols-2">
                    <legend className="mb-2 text-sm font-semibold text-primary-900">{field.label}</legend>
                    {["en", "rw"].map((language) => (
                      <label key={language} className="block">
                        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {language === "en" ? "English" : "Kinyarwanda"}
                        </span>
                        <textarea
                          value={values[field.key][language]}
                          onChange={(event) => updateField(field.key, language, event.target.value)}
                          rows={field.en.length > 150 ? 4 : 2}
                          maxLength={5000}
                          className="input min-h-0 resize-y"
                          aria-label={`${field.label} (${language === "en" ? "English" : "Kinyarwanda"})`}
                        />
                      </label>
                    ))}
                  </fieldset>
                ))}
              </div>
            </details>
          ))}
          <div className="sticky bottom-4 flex justify-end">
            <button type="submit" className="btn-primary shadow-lg" disabled={saving}>
              {saving ? <><Save className="h-4 w-4" /> Saving…</> : <><Check className="h-4 w-4" /> Save website text</>}
            </button>
          </div>
        </form>
      )}
    </div>, translationLanguage)
  );
}
