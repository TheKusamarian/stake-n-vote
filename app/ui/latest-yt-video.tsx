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
  if (!video) {
    return null;
  }

  return (
    <>
      {video && (
        <div className="w-3/4 lg:w-1/2">
          <h2 className="text-lg mb-2 mt-8 text-center">
            Here&apos;s the latest on Polkadot
          </h2>
          <LazyYoutubeEmbed
            previewImageUrl={video.snippet.thumbnails.high.url}
            videoId={video.id.videoId}
          />
        </div>
      )}
    </>
  );
};

export default LatestYtVideo;
