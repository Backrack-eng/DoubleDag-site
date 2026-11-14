/**
 * Move one index to another in a list (HTML5 drag-reorder helper).
 * Returns the same array reference when from === to or indexes are invalid.
 */
export function moveItemInList<T>(
  list: T[],
  fromIndex: number,
  toIndex: number,
): T[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= list.length ||
    toIndex >= list.length
  ) {
    return list;
  }
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  if (!moved) {
    return list;
  }
  next.splice(toIndex, 0, moved);
  return next;
}
