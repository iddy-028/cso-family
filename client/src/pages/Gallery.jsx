import { useMemo, useState } from "react";
import { Images, Play, Search } from "lucide-react";
import PageHero from "../components/PageHero";
import GalleryGrid from "../components/GalleryGrid";
import Loader from "../components/Loader";
import EmptyState from "../components/EmptyState";
import SectionHeading from "../components/SectionHeading";
import { fallbackGallery, galleryCategories } from "../data/fallbackData";
import { publicApi } from "../services/api";
import useApiData from "../hooks/useApiData";

export default function Gallery() {
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
    <>
      <PageHero
        eyebrow="Gallery"
        title="Stories captured in moments"
        description="Photographs from CSO activities, prayer gatherings, community outreach, and time spent serving together."
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
                description="Try another category or search term. New photographs will be added after CSO activities."
              />
            </div>
          ) : (
            <div className="mt-10">
              <GalleryGrid items={images} />
            </div>
          )}

          {error && (
            <p className="mt-8 text-center text-xs text-slate-400">
              Showing sample content while the API is unavailable.
            </p>
          )}
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-cso">
          <SectionHeading
            eyebrow="Video gallery"
            title="Watch our story unfold."
            description="Official CSO video highlights will be published here once provided by the organization. In the meantime, explore the photo gallery and upcoming events."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {[1, 2].map((item) => (
              <div key={item} className="relative flex aspect-video flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-accent">
                  <Play className="ml-1 h-7 w-7" />
                </span>
                <p className="mt-4 font-heading text-lg text-primary-950">Video highlight {item}</p>
                <p className="mt-1 text-xs text-slate-400">Official video pending from CSO</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
