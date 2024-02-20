import NodeCache from "node-cache";
import { CACHE_VIDEO_EXPIRATION_DURATION } from "./latest-yt";

// Initialize a NodeCache instance. The stdTTL option sets a default TTL for all cache entries in seconds.
const cache = new NodeCache({ stdTTL: CACHE_VIDEO_EXPIRATION_DURATION });

export default cache;
