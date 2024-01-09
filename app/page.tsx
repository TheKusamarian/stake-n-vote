import Image from "next/image";
import { DelegateAndStake } from "./ui/delegate-and-stake/delegate-and-stake";
import Script from "next/script";

export default function Home() {
  return (
    <div className="h-full flex justify-center items-center w-full">
      <DelegateAndStake />
    </div>
  );
}
