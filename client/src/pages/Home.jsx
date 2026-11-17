import { translateNode, useLanguage as useTranslationLanguage } from "../context/LanguageContext.jsx";
import Hero from "../sections/Hero";
import MissionVision from "../sections/MissionVision";
import FeaturedActivities from "../sections/FeaturedActivities";
import ImpactSection from "../sections/ImpactSection";
import LatestEvents from "../sections/LatestEvents";
import GalleryPreview from "../sections/GalleryPreview";
import VolunteerCTA from "../sections/VolunteerCTA";
import VideoGallerySection from "../sections/VideoGallerySection";

export default function Home() {
  const translationLanguage = useTranslationLanguage().language;
  return (
    translateNode(<>
      <Hero />
      <MissionVision />
      <FeaturedActivities />
      <ImpactSection />
      <LatestEvents />
      <GalleryPreview />
      <VideoGallerySection hideWhenEmpty />
      <VolunteerCTA />
    </>, translationLanguage)
  );
}
