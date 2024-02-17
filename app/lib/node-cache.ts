import NodeCache from "node-cache";

// Initialize a NodeCache instance. The stdTTL option sets a default TTL for all cache entries in seconds.
// Here, setting a default TTL of 1 hours (1 * 60 * 60 seconds).
const cache = new NodeCache({ stdTTL: 1 * 60 * 60 });

export default cache;
