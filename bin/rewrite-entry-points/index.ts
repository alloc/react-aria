#!/usr/bin/env node --no-warnings
import fs from 'node:fs'
import {globSync} from 'tinyglobby'
import prettier from 'prettier'

// Find all package.json files in packages directory
const packageJsonFiles = globSync('packages/**/package.json', {
  ignore: ['**/node_modules/**', '**/dist/**'],
})

// Process each package.json file
for (const packageJsonPath of packageJsonFiles) {
  try {
    // Read the package.json file
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(packageJsonContent)

    if (!packageJson.source) {
      // No build required, so leave the file alone.
      continue
    }

    // Remove main, module, and types fields
    delete packageJson.main
    delete packageJson.module
    delete packageJson.types

    // Replace exports field with the new structure
    packageJson.exports = {
      types: './dist/types/index.d.ts',
      import: './dist/index.js',
    }

    // Write the updated package.json back to the file
    fs.writeFileSync(
      packageJsonPath,
      await prettier.format(JSON.stringify(packageJson, null, 2), {
        parser: 'json',
      })
    )

    console.log(`Updated: ${packageJsonPath}`)
  } catch (error) {
    console.error(`Error processing ${packageJsonPath}:`, error)
  }
}

console.log('Entry points rewriting completed')
