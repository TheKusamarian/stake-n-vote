import { useQuery } from "react-query"

export async function fetchLatestVideos() {
  const playlistId = "PLtyd7v_I7PGlMekTepCvnf8WMKVR1nhLZ" // Replace with your actual playlist ID
  const apiKey = "AIzaSyDxUpBqBVU7GSTYpDLuBZsHv0222gRF2Pg"
  const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${apiKey}`

  try {
    const playlistResponse = await fetch(apiUrl)
    if (!playlistResponse.ok) {
      throw new Error(
        `Failed to fetch playlist items: ${playlistResponse.statusText}`
      )
    }
    const playlistData = await playlistResponse.json()
    const videoIds = playlistData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .join(",")

    const videosApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status&id=${videoIds}&key=${apiKey}`
    const videosResponse = await fetch(videosApiUrl)
    if (!videosResponse.ok) {
      throw new Error(
        `Failed to fetch video details: ${videosResponse.statusText}`
      )
    }
    const videosData = await videosResponse.json()

    const videos = videosData.items
      .filter((item: any) => item.status.privacyStatus === "public")
      .slice(0, 7)
      .map((video: any) => ({
        id: video.id,
        title: video.snippet.title,
        thumbnails: video.snippet.thumbnails,
        description: video.snippet.description,
      }))

    if (!videos.length) {
      throw new Error("No public videos found")
    }

    return {
      videos,
      fetchedAt: Date.now(),
    }
  } catch (error) {
    let message: string
    if (error instanceof Error) {
      message = error.message
    } else {
      message = "Something went wrong"
    }
    console.error(error)
    return { error: message }
  }
}

export function useLatestYt() {
  return useQuery<any>(["latest-yt"], fetchLatestVideos, {
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}
