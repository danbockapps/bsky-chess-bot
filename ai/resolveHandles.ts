import axios from 'axios'
import * as fs from 'fs'
import * as readline from 'readline'

const inputFile = 'handles.txt'
const outputFile = 'resolved_dids.txt'

async function resolveHandle(handle: string): Promise<string | null> {
  try {
    const response = await axios.get(
      `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`,
    )
    return response.data.did
  } catch (error) {
    console.error(`Failed to resolve handle ${handle}:`, error)
    return null
  }
}

async function processHandles() {
  const fileStream = fs.createReadStream(inputFile)
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  })

  const resolvedDids: string[] = []

  for await (const line of rl) {
    const handle = line.trim()
    if (handle) {
      console.log(`Resolving handle: ${handle}`)
      const did = await resolveHandle(handle)
      if (did) {
        console.log(`Resolved handle ${handle} to DID: ${did}`)
        resolvedDids.push(did)
      }
    }
  }

  fs.writeFileSync(outputFile, resolvedDids.join('\n'), 'utf-8')
  console.log(`Resolved DIDs have been written to ${outputFile}`)
}

processHandles().catch((error) => {
  console.error('Error processing handles:', error)
})
