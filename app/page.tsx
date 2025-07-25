import ChairmanMessage from "@/components/ChairmanMessage";
import HeroSlider from "@/components/HeroSlider";
import LatestNewsPanel from "@/components/LatestNewsPanel";
import PrincipalPanel from "@/components/PrincipalPanel";
import StatsPanel from "@/components/StatsPanel";
import UpcomingEventsPanel from "@/components/UpcomingEventsPanel";
import VideoGalleryPanel from "@/components/VideoGalleryPanel";
import { groq } from "next-sanity";
import { client } from "@/lib/sanity";

export default async function Home() {
  const query = groq`
  *[_type == "statsPanel"][0]{
  stats,
  background->{
    title,
    image {
      asset->{
        url,
        _id,
        originalFilename
      }
    }
  }
}
`;

  const data = await client.fetch(query);
  return (
    <div className="space-y-6">
      <HeroSlider />
      <ChairmanMessage />
      <PrincipalPanel />

      <StatsPanel data={data} />
      <LatestNewsPanel />
      <VideoGalleryPanel />
      <UpcomingEventsPanel />
    </div>
  );
}
