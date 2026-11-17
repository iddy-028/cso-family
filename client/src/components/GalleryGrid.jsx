import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import { useState } from "react";
import { Expand } from "lucide-react";
import { resolveImage } from "../services/api";
import Lightbox from "./Lightbox";

export default function GalleryGrid({ items = [] }) {
  const translationLanguage = useTranslationLanguage().language;
  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    translateNode(<>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-3xl bg-secondary text-left focus-visible:ring-2"
            aria-label={`Preview ${item.title}`}
          >
            <img
              src={resolveImage(item.image_url)}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-primary-950/85 via-primary-950/10 to-transparent opacity-80 transition group-hover:opacity-100" />
            <span className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="badge-gold bg-white/15 text-white backdrop-blur">{item.category}</span>
              <span className="mt-2 block font-heading text-lg">{item.title}</span>
            </span>
            <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
              <Expand className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>

      {activeIndex >= 0 && (
        <Lightbox items={items} index={activeIndex} onChange={setActiveIndex} onClose={() => setActiveIndex(-1)} />
      )}
    </>, translationLanguage)
  );
}
