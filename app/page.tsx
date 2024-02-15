import Image from "next/image";
import { DelegateAndStake } from "./ui/delegate-and-stake/delegate-and-stake";
import Script from "next/script";
import LatestYtVideo from "./ui/latest-yt-video";
import LazyYoutubeEmbed from "./ui/lazy-yt-embed";

export const revalidate = 1000 * 60 * 60 * 4; // 4 hours

export default async function Home() {
  const key = "AIzaSyDxUpBqBVU7GSTYpDLuBZsHv0222gRF2Pg";

  let vid = null;

  try {
    const latestYtVideoRaw = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=UCqNw3CEyOD-bjjYYaxVyG3Q&part=snippet&type=video&order=date&maxResults=1`
    );
    const latestYtVideoData = await latestYtVideoRaw.json();
    const { items } = latestYtVideoData;
    vid = items?.[0];
  } catch (e) {
    console.error(e);
  }

  return (
    <div className="h-full flex justify-center items-center w-full flex-col mb-10">
      <DelegateAndStake />
      <LatestYtVideo video={vid} />
    </div>
  );
}
