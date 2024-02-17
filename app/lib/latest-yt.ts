"use server";

import cache from "@/app/lib/node-cache";

export async function fetchLatestVideo() {
  const playlistId = "PLtyd7v_I7PGlMekTepCvnf8WMKVR1nhLZ"; // Replace with your actual playlist ID
  const cacheKey = `latest-video-${playlistId}`;

  const cachedVideo = cache.get(cacheKey);

  // If the video is found in the cache, return it without fetching from the YouTube API
  if (cachedVideo) {
    console.log("Returning cached video");
    return cachedVideo;
  }

  const apiKey = process.env.YOUTUBE_API_KEY; // Use the YouTube API key from your environment variables
  const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=1&key=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();
    const video = data.items?.[0]?.snippet;

    if (!video) {
      throw new Error("No video found");
    }

    // Cache the fetched video before returning it
    cache.set(cacheKey, { ...video, cachedAt: Date.now() });

    return video;
  } catch (error) {
    let message: string;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Something went wrong";
    }
    return { error: message };
  }
}
