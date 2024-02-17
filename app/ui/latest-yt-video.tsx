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
  //   channelId: string;
  video: any;
};

const LatestYtVideo: React.FC<LatestVideoProps> = ({
  video,
}: {
  video: any;
}) => {
  if (!video || !video?.thumbnails) {
    return null;
  }

  return (
    <>
      {video && (
        <div className="w-full md:w-3/4 lg:w-1/2 mb-8">
          <h2 className="text-lg mb-2 mt-8 text-center">
            Here&apos;s the latest on Polkadot
          </h2>
          <LazyYoutubeEmbed
            previewImageUrl={video?.thumbnails?.high.url}
            videoId={video?.resourceId?.videoId}
          />
        </div>
      )}
    </>
  );
};

export default LatestYtVideo;
