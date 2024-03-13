import { DelegateAndStake } from "./ui/delegate-and-stake/delegate-and-stake";
import LatestYtVideo from "./ui/latest-yt-video";
import { fetchLatestVideo } from "./lib/latest-yt";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="h-full flex justify-center items-center w-full flex-col mb-10">
      <DelegateAndStake />
      <LatestYtVideo />{" "}
    </div>
  );
}
