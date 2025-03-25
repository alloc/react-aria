#!/usr/bin/env node --no-warnings
import spawn from 'tinyspawn'
import path from 'node:path'
import fs from 'node:fs'
import {fileURLToPath} from 'node:url'

const metadata = JSON.parse(fs.readFileSync('package.json', 'utf8'))
if (!metadata.source) {
  // No build required. Exit gracefully.
  process.exit()
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const workspaceRoot = path.resolve(__dirname, '../..')
const rolldownBin = path.join(workspaceRoot, 'node_modules/.bin/rolldown')
const rolldownConfig = path.join(workspaceRoot, 'config/rolldown.config.mjs')
const tscBin = path.join(workspaceRoot, 'node_modules/.bin/tsc')

fs.writeFileSync(
  'rolldown.config.mjs',
  `export { default } from "${path.relative(process.cwd(), rolldownConfig)}"`
)
fs.copyFileSync(
  path.join(workspaceRoot, 'tsconfig.src.json'),
  'tsconfig.json',
)

const rolldownPromise = exec(`${rolldownBin} -c rolldown.config.mjs`)
const tscPromise = exec(`${tscBin} -p tsconfig.json`)

await Promise.all([rolldownPromise, tscPromise])

async function exec(command: string) {
  const {exitCode, signalCode} = await spawn(
    command,
    {
      stdio: 'inherit',
      reject: false,
    }
  )

  if (exitCode !== 0) {
    process.exit(exitCode)
  }

  if (signalCode !== null) {
    process.exit(signalCode)
  }
}
