/**
 * Appends a fetched page of rows onto an accumulated list, skipping rows that
 * are already present. Infinite-scroll accumulators can otherwise render the
 * same row twice when the underlying data shifts between page fetches (e.g. a
 * row is deleted), producing duplicate React keys.
 *
 * @param prev - Rows accumulated so far, in display order.
 * @param rows - Newly fetched page of rows.
 * @returns The merged list, or `prev` unchanged when the page adds nothing new.
 */
export function appendPage<T extends { id: string }>(prev: T[], rows: T[]): T[] {
  if (rows.length === 0) return prev;
  const seen = new Set(prev.map((row) => row.id));
  const fresh: T[] = [];
  for (const row of rows) {
    if (!seen.has(row.id)) {
      seen.add(row.id);
      fresh.push(row);
    }
  }
  if (fresh.length === 0) return prev;
  return [...prev, ...fresh];
}

/**
 * Encodes the ordered key parts of the last row in a page into an opaque,
 * URL-safe cursor string.
 *
 * Keyset ("seek") pagination carries the sort key(s) of the boundary row rather
 * than an offset, so appended or removed rows between page fetches never shift
 * the window. Consumers treat the result as opaque and pass it back verbatim.
 *
 * @param parts - The sort key values of the boundary row, in sort order.
 * @returns A base64url-encoded cursor string.
 * @typeParam The parts are primitives (strings or numbers).
 */
export function encodeCursor(parts: (string | number)[]): string {
  return btoa(JSON.stringify(parts)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

/**
 * Decodes an opaque cursor produced by {@link encodeCursor}.
 *
 * @param cursor - The cursor string previously returned by {@link encodeCursor}.
 * @returns The key parts, or `null` when the cursor is malformed or tampered with.
 */
export function decodeCursor(cursor: string): (string | number)[] | null {
  try {
    const base64 = cursor.replaceAll("-", "+").replaceAll("_", "/");
    const parsed: unknown = JSON.parse(atob(base64));
    if (!Array.isArray(parsed)) return null;
    return parsed.filter(
      (part): part is string | number => typeof part === "string" || typeof part === "number",
    );
  } catch {
    return null;
  }
}
