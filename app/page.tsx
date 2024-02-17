import Image from "next/image";
import { DelegateAndStake } from "./ui/delegate-and-stake/delegate-and-stake";
import Script from "next/script";
import LatestYtVideo from "./ui/latest-yt-video";
import LazyYoutubeEmbed from "./ui/lazy-yt-embed";
import { fetchLatestVideo } from "./lib/latest-yt";

export const revalidate = 1000 * 60 * 60 * 4; // 4 hours

export default async function Home() {
  const vid = await fetchLatestVideo();

  return (
    <div className="h-full flex justify-center items-center w-full flex-col mb-10">
      <DelegateAndStake />
      <LatestYtVideo video={vid} />
    </div>
  );
}
