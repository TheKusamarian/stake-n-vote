import NodeCache from "node-cache";

export const CACHE_VIDEO_EXPIRATION_DURATION = 1000 * 60 * 60 * 0.5; // 30 minutes

// Initialize a NodeCache instance. The stdTTL option sets a default TTL for all cache entries in seconds.
const cache = new NodeCache({ stdTTL: CACHE_VIDEO_EXPIRATION_DURATION });

export default cache;
