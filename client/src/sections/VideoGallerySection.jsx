import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Clapperboard } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { ErrorAlert } from "../components/Alerts";
import useApiData from "../hooks/useApiData";
import { useSiteContent } from "../context/SiteContentContext.jsx";
import { publicApi, resolveImage } from "../services/api";

export default function VideoGallerySection({ hideWhenEmpty = false }) {
  const translationLanguage = useTranslationLanguage().language;
  const getContent = useSiteContent();
  const { data: videos, loading, error } = useApiData(() => publicApi.videos(), [], []);

  if (hideWhenEmpty && !loading && videos.length === 0 && !error) return null;

  return (
    translateNode(<section className="section bg-white">
      <div className="container-cso">
        <SectionHeading
          eyebrow={getContent("gallery.cso.video.eyebrow", "CSO Family videos")}
          title={getContent("gallery.cso.video.title", "Videos from our family.")}
          description={getContent(
            "gallery.cso.video.description",
            "Videos uploaded by CSO Family will be shared in this section.",
          )}
        />
        <ErrorAlert message={error} />
        {loading ? (
          <p className="mt-8 text-sm text-slate-500">Loading videos…</p>
        ) : videos.length === 0 ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
            <Clapperboard className="h-5 w-5 shrink-0 text-primary-700" />
            Videos will appear here when the CSO team uploads them.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {videos.map((video) => (
              <article key={video.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card">
                <video
                  src={resolveImage(video.video_url)}
                  controls
                  preload="metadata"
                  className="aspect-video w-full bg-black"
                  aria-label={video.title}
                />
                <div className="p-5">
                  <h3 className="font-heading text-lg text-primary-950">{video.title}</h3>
                  {video.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{video.description}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>, translationLanguage)
  );
}
