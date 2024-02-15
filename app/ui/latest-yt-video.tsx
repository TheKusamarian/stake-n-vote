"use client";

import { useState, useEffect } from "react";
import LazyYoutubeEmbed from "./lazy-yt-embed";

type Video = {
  id: string;
  title: string;
  thumbnailUrl: string;
  previewUrl: string;
};

type LatestVideoProps = {
  channelId: string;
};

const LatestYtVideo: React.FC<LatestVideoProps> = ({
  channelId,
  video,
}: {
  channelId: string;
  video: any;
}) => {
  return (
    <>
      {video && (
        <div className="w-1/2">
          <h2 className="text-lg mb-2 mt-8">
            Here&apos;s the latest on Polkadot
          </h2>
          <LazyYoutubeEmbed
            previewImageUrl={video.previewUrl}
            videoId={video.id}
          />
        </div>
      )}
    </>
  );
};

export default LatestYtVideo;
