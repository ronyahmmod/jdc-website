import ChairmanMessage from "@/components/ChairmanMessage";
import HeroSlider from "@/components/HeroSlider";
import LatestNewsPanel from "@/components/LatestNewsPanel";
import PrincipalPanel from "@/components/PrincipalPanel";
import StatsPanel from "@/components/StatsPanel";
import UpcomingEventsPanel from "@/components/UpcomingEventsPanel";
import VideoGalleryPanel from "@/components/VideoGalleryPanel";

export default function Home() {
  return (
    <div className="space-y-6">
      <HeroSlider />
      <ChairmanMessage />
      <PrincipalPanel />

      <StatsPanel />
      <LatestNewsPanel />
      <VideoGalleryPanel />
      <UpcomingEventsPanel />
    </div>
  );
}
