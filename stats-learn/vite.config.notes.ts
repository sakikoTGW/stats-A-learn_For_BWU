import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { fileURLToPath } from 'node:url'

const notesRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '../章节重点笔记')

function serveNotesAsset(reqUrl: string, res: import('http').ServerResponse, next: () => void) {
  const urlPath = decodeURIComponent((reqUrl.split('?')[0] ?? '').replace(/^\//, ''))
  if (!urlPath || urlPath.includes('..')) {
    next()
    return
  }

  const file = path.normalize(path.join(notesRoot, urlPath))
  if (!file.startsWith(notesRoot) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.statusCode = 404
    res.end('Not found')
    return
  }

  const ext = path.extname(file).toLowerCase()
  const mime: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
  }
  res.setHeader('Content-Type', mime[ext] ?? 'application/octet-stream')
  fs.createReadStream(file).pipe(res)
}

export function notesAssetsPlugin(): Plugin {
  const attach = (server: { middlewares: { use: Function } }) => {
    server.middlewares.use('/notes-assets', (req, res, next) => {
      serveNotesAsset(req.url ?? '', res, next)
    })
  }

  return {
    name: 'notes-assets',
    configureServer: attach,
    configurePreviewServer: attach,
  }
}
