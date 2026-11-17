import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { useMemo, useState } from "react";
import { Images, Search } from "lucide-react";
import PageHero from "../components/PageHero";
import GalleryGrid from "../components/GalleryGrid";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import { fallbackGallery, galleryCategories } from "../data/fallbackData";
import { publicApi } from "../services/api";
import useApiData from "../hooks/useApiData";
import { useSiteContent } from "../context/SiteContentContext.jsx";
import VideoGallerySection from "../sections/VideoGallerySection";

export default function Gallery() {
  const translationLanguage = useTranslationLanguage().language;
  const getContent = useSiteContent();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const filteredFallback = useMemo(() => {
    const term = search.toLowerCase();
    return fallbackGallery.filter((item) => {
      const matchesCategory = !category || item.category === category;
      const matchesSearch =
        !term || item.title.toLowerCase().includes(term) || (item.description || "").toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [search, category]);

  const { data: images, loading, error } = useApiData(
    () => publicApi.gallery({ search, category }),
    filteredFallback,
    [search, category],
  );

  const categories = ["", ...galleryCategories];

  return (
    translateNode(<>
      <PageHero
        eyebrow={getContent("gallery.cso.hero.eyebrow", "CSO Family gallery")}
        title={getContent("gallery.cso.hero.title", "CSO Family photos and videos")}
        description={getContent("gallery.cso.hero.description", "Photos and videos shared by CSO Family will appear here.")}
        image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80"
        breadcrumb="Gallery"
      />

      <section className="section bg-slate-50">
        <div className="container-cso">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((item) => (
                <button
                  key={item || "all"}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                    category === item
                      ? "bg-primary text-white shadow-sm"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-primary/30"
                  }`}
                >
                  {item || "All photos"}
                </button>
              ))}
            </div>
            <div className="relative w-full lg:max-w-sm">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search gallery…"
                className="input pl-11"
                aria-label="Search gallery"
              />
            </div>
          </div>

          {loading ? (
            <Loader label="Loading gallery…" />
          ) : images.length === 0 ? (
            <div className="mt-10">
              <EmptyState
                icon={Images}
                title="No photos found"
                description="CSO Family photos will appear here when they are uploaded."
              />
            </div>
          ) : (
            <div className="mt-10">
              <GalleryGrid items={images} />
            </div>
          )}

          {error && (
            <p className="mt-8 text-center text-xs text-slate-400">
              Gallery content is temporarily unavailable.
            </p>
          )}
        </div>
      </section>

      <VideoGallerySection />
    </>, translationLanguage)
  );
}
