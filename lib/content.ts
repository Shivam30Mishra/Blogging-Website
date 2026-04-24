import { gradientPresets } from "@/lib/constants";

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function createExcerpt(body: string, limit = 170) {
  const plain = body.replace(/\s+/g, " ").trim();
  if (plain.length <= limit) return plain;
  return `${plain.slice(0, limit).trimEnd()}...`;
}

export function calculateReadTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

export function formatDate(input: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(input));
}

export function formatRelativeDate(input: string) {
  // Avoid using Date.now() during server-side rendering to prevent hydration mismatches
  if (typeof window === 'undefined') {
    return formatDate(input);
  }

  const date = new Date(input).getTime();
  const diffMs = Date.now() - date;
  const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return `${diffDays}d ago`;
  }

  return formatDate(input);
}

export function imageOrGradient(input: string, seed = 0) {
  if (input.startsWith("http://") || input.startsWith("https://")) {
    return input;
  }

  return gradientPresets[seed % gradientPresets.length];
}
