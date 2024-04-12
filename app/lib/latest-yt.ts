export async function fetchLatestVideo() {
  const playlistId = "PLtyd7v_I7PGlMekTepCvnf8WMKVR1nhLZ"; // Replace with your actual playlist ID
  const apiKey = "AIzaSyDxUpBqBVU7GSTYpDLuBZsHv0222gRF2Pg";
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

    return {
      ...video,
      fetchedAt: Date.now(),
    };
  } catch (error) {
    let message: string;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = "Something went wrong";
    }
    console.error(error);
    return { error: message };
  }
}
