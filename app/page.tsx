import Image from "next/image";
import { DelegateAndStake } from "./ui/delegate-and-stake/delegate-and-stake";
import Script from "next/script";
import LatestYtVideo from "./ui/latest-yt-video";

export const revalidate = 1000 * 60 * 60 * 4; // 4 hours

export default async function Home() {
  const key = "AIzaSyC-4_WiDSAw7AeXer09cjEG7PigeAXRIq4";
  const latestYtVideo = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=UCqNw3CEyOD-bjjYYaxVyG3Q&part=snippet&type=video&order=date&maxResults=1`
  );

  console.log("latestYtVideo", latestYtVideo);

  return (
    <div className="h-full flex justify-center items-center w-full flex-col mb-10">
      <DelegateAndStake />
      <LatestYtVideo
        channelId="UCqNw3CEyOD-bjjYYaxVyG3Q"
        video={latestYtVideo}
      />
    </div>
  );
}
