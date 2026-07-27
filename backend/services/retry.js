export async function retry(fn, options = {}) {
  const retries = options.retries ?? 3;
  const initialDelay = options.initialDelay ?? 500; // ms
  const maxDelay = options.maxDelay ?? 10000; // ms

  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) {
        throw err;
      }

      // exponential backoff with jitter
      const exp = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay);
      const jitter = Math.floor(Math.random() * 200); // up to 200ms
      const delay = exp + jitter;

      console.warn(`Retry attempt ${attempt}/${retries} after error: ${err.message || err}. Waiting ${delay}ms before retry.`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
