import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { publicApi } from "../services/api";
import useApiData from "../hooks/useApiData";
import { fallbackGallery } from "../data/fallbackData";
import GalleryGrid from "../components/GalleryGrid";
import SectionHeading from "../components/SectionHeading";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function GalleryPreview() {
  const translationLanguage = useTranslationLanguage().language;
  const { data: images, loading } = useApiData(
    () => publicApi.gallery({ limit: 6 }),
    fallbackGallery,
  );

  return (
    translateNode(<section className="section bg-slate-50">
      <div className="container-cso">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="CSO Family gallery"
            title="Photos from CSO Family"
            description="Photos and videos shared by CSO Family will appear here."
          />
          <Link to="/gallery" className="btn-outline shrink-0">
            View gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <Loader label="Loading gallery…" />
        ) : images.length === 0 ? (
          <div className="mt-10">
            <EmptyState title="No photos have been uploaded yet" description="CSO Family photos will appear here when they are uploaded." />
          </div>
        ) : (
          <div className="mt-12"><GalleryGrid items={images.slice(0, 6)} /></div>
        )}
      </div>
    </section>, translationLanguage)
  );
}
