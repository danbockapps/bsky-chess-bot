import {AppBskyRichtextFacet} from '@atproto/api'
import util from 'util'

export const deepPrint = (obj: any) => console.log(util.inspect(obj, {depth: null, colors: true}))

/**
 * Builds a Bluesky link facet that turns `linkText` (a substring of `fullText`)
 * into a clickable link to `uri`. Bluesky facet indices are byte offsets, not
 * character offsets, so we measure with Buffer to handle emoji and other
 * multi-byte characters correctly. Returns null if `linkText` isn't found.
 */
export const linkFacet = (
  fullText: string,
  linkText: string,
  uri: string,
): AppBskyRichtextFacet.Main | null => {
  const charIndex = fullText.indexOf(linkText)
  if (charIndex === -1) return null

  const byteStart = Buffer.byteLength(fullText.slice(0, charIndex))
  const byteEnd = byteStart + Buffer.byteLength(linkText)

  return {
    index: {byteStart, byteEnd},
    features: [{$type: 'app.bsky.richtext.facet#link', uri}],
  }
}
