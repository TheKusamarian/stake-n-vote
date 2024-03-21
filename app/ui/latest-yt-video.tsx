"use client";

import { useState, useEffect } from "react";
import LazyYoutubeEmbed from "./lazy-yt-embed";
import { useLatestYt } from "../hooks/use-latest-yt";

type Video = {
  id: string;
  title: string;
  thumbnailUrl: string;
  previewUrl: string;
};

const LatestYtVideo: React.FC = () => {
  const { data: video } = useLatestYt();

  console.log("video", video);

  if (!video || !video?.thumbnails) {
    return null;
  }

  const fetchedAt =
    video.fetchedAt && new Date(video.fetchedAt).toLocaleTimeString();

  return (
    <>
      {video && (
        <div className="w-full md:w-3/4 lg:w-1/2 mb-8">
          <h2 className="text-lg mb-2 mt-8 text-center">
            Here&apos;s the latest on Polkadot
          </h2>
          <LazyYoutubeEmbed
            previewImageUrl={video?.thumbnails?.maxres.url}
            videoId={video?.resourceId?.videoId}
          />
        </div>
      )}
    </>
  );
};

export default LatestYtVideo;
