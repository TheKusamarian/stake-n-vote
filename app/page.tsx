import Image from "next/image";
import { DelegateAndStake } from "./ui/delegate-and-stake/delegate-and-stake";

export default function Home() {
  return (
    <div className="h-full flex justify-center items-center w-full">
      <DelegateAndStake chain={"Kusama"} />
    </div>
  );
}
