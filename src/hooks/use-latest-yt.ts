import { useQuery } from 'react-query'

export async function fetchLatestVideos() {
  const playlistId = 'PLtyd7v_I7PGlMekTepCvnf8WMKVR1nhLZ' // Replace with your actual playlist ID
  const apiKey = 'AIzaSyDxUpBqBVU7GSTYpDLuBZsHv0222gRF2Pg'
  const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=7&key=${apiKey}`

  try {
    const response = await fetch(apiUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`)
    }
    const data = await response.json()
    // console.log('data', data)

    const videos = data.items?.map((item: any) => {
      const video = item.snippet
      return {
        id: video.resourceId.videoId,
        title: video.title,
        thumbnails: video.thumbnails,
        description: video.description,
      }
    })

    if (!videos) {
      throw new Error('No videos found')
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
      message = 'Something went wrong'
    }
    console.error(error)
    return { error: message }
  }
}

export function useLatestYt() {
  return useQuery<any>(['latest-yt'], fetchLatestVideos, {
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })
}
