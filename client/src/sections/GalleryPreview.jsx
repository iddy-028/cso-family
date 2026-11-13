import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { publicApi } from "../services/api";
import useApiData from "../hooks/useApiData";
import { fallbackGallery } from "../data/fallbackData";
import GalleryGrid from "../components/GalleryGrid";
import SectionHeading from "../components/SectionHeading";
import Loader from "../components/Loader";

export default function GalleryPreview() {
  const { data: images, loading } = useApiData(
    () => publicApi.gallery({ limit: 6 }),
    fallbackGallery,
  );

  return (
    <section className="section bg-slate-50">
      <div className="container-cso">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Gallery"
            title="Moments of love in action."
            description="A glimpse of our community coming together to serve, pray, and care."
          />
          <Link to="/gallery" className="btn-outline shrink-0">
            View gallery <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? <Loader label="Loading gallery…" /> : <div className="mt-12"><GalleryGrid items={images.slice(0, 6)} /></div>}
      </div>
    </section>
  );
}
