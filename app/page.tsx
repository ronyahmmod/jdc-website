import ChairmanMessage from "@/components/ChairmanMessage";
import HeroSlider from "@/components/HeroSlider";
import LatestNewsPanel from "@/components/LatestNewsPanel";
import PrincipalPanel from "@/components/PrincipalPanel";
import StatsPanel from "@/components/StatsPanel";
import UpcomingEventsPanel from "@/components/UpcomingEventsPanel";
import VideoGalleryPanel from "@/components/VideoGalleryPanel";
import { groq } from "next-sanity";
import { client } from "@/lib/sanity";
import NoticePanel from "@/components/NoticePanel";
import ServicePanel from "@/components/ServicePanel";

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
      <div className="md:flex md:h-full gap-2 space-y-2 md:space-y-0">
        {/* HeroSlider */}
        <div className="md:w-2/3 w-full md:h-full">
          <div className="w-full h-full">
            <HeroSlider />
          </div>
        </div>

        {/* NoticePanel */}
        <div className="md:w-1/3 w-full md:h-[500px]">
          <NoticePanel />
        </div>
      </div>
      <ServicePanel />
      <ChairmanMessage />
      <PrincipalPanel />
      <StatsPanel data={data} />
      <LatestNewsPanel />
      <VideoGalleryPanel />
      <UpcomingEventsPanel />
    </div>
  );
}
