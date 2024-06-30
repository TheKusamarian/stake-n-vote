export function stopAllYouTubeVideos() {
  console.log("Stopping all YouTube videos")
  // Select all iframe elements
  const iframes = document.querySelectorAll("iframe")

  // Iterate over all iframes
  iframes.forEach((iframe) => {
    console.log("Checking iframe:", iframe.src)
    // Check if the iframe is a YouTube embed
    if (iframe.src.includes("youtube.com/embed")) {
      console.log("Found a YouTube video:", iframe.src)
      // Create the message payload
      const message = JSON.stringify({
        event: "command",
        func: "pauseVideo",
      })
      // Send the 'pause' command to the YouTube iframe
      iframe.contentWindow?.postMessage(message, "*")
    }
  })
}
