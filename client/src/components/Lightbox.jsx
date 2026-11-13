import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { resolveImage } from "../services/api";

export default function Lightbox({ items, index, onClose, onChange }) {
  const item = items[index];

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") onChange((index + 1) % items.length);
      if (event.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [index, items.length, onChange, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/92 p-4 sm:p-8" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        aria-label="Close preview"
      >
        <X className="h-5 w-5" />
      </button>

      {items.length > 1 && (
        <button
          type="button"
          onClick={() => onChange((index - 1 + items.length) % items.length)}
          className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      <figure className="max-h-full w-full max-w-5xl text-center">
        <img
          src={resolveImage(item.image_url)}
          alt={item.title}
          className="mx-auto max-h-[76vh] w-auto rounded-2xl object-contain shadow-2xl"
        />
        <figcaption className="mt-4 text-white">
          <p className="font-heading text-xl">{item.title}</p>
          {item.description && <p className="mt-1 text-sm text-white/60">{item.description}</p>}
          <p className="mt-2 text-xs uppercase tracking-widest text-accent">
            {index + 1} / {items.length} · {item.category}
          </p>
        </figcaption>
      </figure>

      {items.length > 1 && (
        <button
          type="button"
          onClick={() => onChange((index + 1) % items.length)}
          className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
