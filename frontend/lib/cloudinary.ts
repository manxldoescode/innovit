// Lightweight frontend-only replacements for the original Cloudinary helpers.
// This version avoids any server-side SDKs and simply maps IDs/paths to URLs
// that Next.js can serve from the `public/` directory or from full URLs.

/**
 * Returns a video URL that can be used directly in the browser.
 *
 * - If `videoIdOrPath` already looks like a full URL (http/https) or an absolute
 *   path (starts with `/`), it is returned as-is.
 * - Otherwise, we treat it as a file under `/` (e.g. `feature-1-doable.mp4`
 *   becomes `/feature-1-doable.mp4` which is resolved from `public/`).
 */
export function getVideoUrl(videoIdOrPath: string): string {
  if (!videoIdOrPath) return "";

  if (
    videoIdOrPath.startsWith("http://") ||
    videoIdOrPath.startsWith("https://") ||
    videoIdOrPath.startsWith("/")
  ) {
    return videoIdOrPath;
  }

  return `/${videoIdOrPath}`;
}

/**
 * Returns a poster image URL for a given video.
 *
 * - If the input looks like a full URL or absolute path, we try to swap common
 *   video extensions for `.jpg`. For example:
 *     `/videos/demo.mp4` -> `/videos/demo.jpg`
 * - If we cannot confidently derive a poster, we fall back to a generic image
 *   that exists in `public/open-graph.png`.
 */
export function getCloudinaryVideoPoster(videoIdOrPath: string): string {
  if (!videoIdOrPath) return "/open-graph.png";

  const candidates = [".mp4", ".webm", ".mov", ".mkv"];
  for (const ext of candidates) {
    if (videoIdOrPath.endsWith(ext)) {
      return videoIdOrPath.replace(ext, ".jpg");
    }
  }

  return "/open-graph.png";
}

