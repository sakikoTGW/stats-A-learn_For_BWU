/** 从当前路由推断学伴应聚焦的章节 */
export function chapterIdFromRoute(
  pathname: string,
  search: string,
  params: { chapterId?: string }
): string | undefined {
  if (params.chapterId && pathname.includes('diagnostic')) return params.chapterId
  if (params.chapterId && pathname.includes('exam')) return params.chapterId

  const q = new URLSearchParams(search).get('chapter')
  if (q) return q

  if (pathname.includes('/learn') || pathname.includes('/practice') || pathname.includes('/chapter-notes')) {
    return q ?? undefined
  }

  return undefined
}
