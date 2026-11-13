import Hero from "../sections/Hero";
import MissionVision from "../sections/MissionVision";
import FeaturedActivities from "../sections/FeaturedActivities";
import ImpactSection from "../sections/ImpactSection";
import LatestEvents from "../sections/LatestEvents";
import GalleryPreview from "../sections/GalleryPreview";
import VolunteerCTA from "../sections/VolunteerCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <MissionVision />
      <FeaturedActivities />
      <ImpactSection />
      <LatestEvents />
      <GalleryPreview />
      <VolunteerCTA />
    </>
  );
}
