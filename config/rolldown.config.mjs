import { defineConfig } from 'rolldown'
import fs from 'node:fs'
import intlPlugin from './intl-plugin.mjs'

const metadata = JSON.parse(fs.readFileSync('package.json', 'utf8'))

if (!metadata.source) {
  throw new Error('package.json must contain a "source" field')
}

export default defineConfig({
  input: metadata.source,
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  external: /^[\w@]/,
  plugins: [fs.existsSync('intl') && intlPlugin()],
})
