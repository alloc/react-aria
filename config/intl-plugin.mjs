import path from 'node:path'
import fs from 'node:fs'
import { globSync } from 'tinyglobby'
import supportedLocales from './locales.json' with { type: 'json' }

/**
 * Rollup plugin that handles import specifiers ending in "/intl/*.json"
 * It resolves the directory relative to the importer and loads all matching JSON files
 *
 * @returns {import('rolldown').Plugin}
 */
function intlPlugin() {
  return {
    name: 'intl-plugin',

    resolveId(id, importer) {
      if (!id.endsWith('/intl/*.json') || !importer) {
        return null
      }

      // Resolve the base path relative to the importer
      const resolvedBase = path.resolve(
        path.dirname(importer),
        path.dirname(id)
      )

      // Create a virtual module ID that includes the resolved path
      return `\0intl:${resolvedBase}`
    },

    load(id) {
      if (!id.startsWith('\0intl:')) {
        return null
      }

      // Extract the resolved base path from the virtual module ID
      const basePath = id.slice(6) // remove '\0intl:'
      const jsonFiles = globSync('*.json', { cwd: basePath })

      /** @type {Record<string, any>} */
      const intlData = {}

      // Create an object with the JSON contents
      for (const file of jsonFiles) {
        const locale = path.basename(file, '.json')
        if (supportedLocales.length > 0 && !supportedLocales.includes(locale)) {
          continue
        }

        const filePath = path.join(basePath, file)
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
        intlData[locale] = content
      }

      // Generate the module code
      return `export default ${JSON.stringify(intlData, null, 2)};`
    },
  }
}

export default intlPlugin
