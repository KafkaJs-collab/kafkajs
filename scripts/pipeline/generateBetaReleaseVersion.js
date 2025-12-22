#!/usr/bin/env node

const { coerce, prerelease, parse } = require('semver')
const getCurrentVersion = require('./getCurrentNPMVersion')

const sameStableVersion = (stable, beta) => coerce(stable).version === coerce(beta).version

console.log('Env:')
for (const env of Object.keys(process.env)) {
  console.log(`${env}=${process.env[env]}`)
}

getCurrentVersion().then(({ latest, beta }) => {
  console.log(`Current Latest: ${latest}, Beta: ${beta}`)
  const { major, minor } = parse(latest)
  const [tag, currentBeta] = prerelease(beta)
  const newStable = `${major}.${minor + 1}.0`
  const newBeta = sameStableVersion(newStable, beta) ? currentBeta + 1 : 0
  const newBetaVersion = `${newStable}-${tag}.${newBeta}`
  console.log(`New beta: ${newBetaVersion}`)
  console.log(`PRE_RELEASE_VERSION=${newBetaVersion}`)
  // Set output and env for GitHub Actions
  if (process.env.GITHUB_OUTPUT) {
    const fs = require('fs')
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `PRE_RELEASE_VERSION=${newBetaVersion}\n`)
  }
  if (process.env.GITHUB_ENV) {
    const fs = require('fs')
    fs.appendFileSync(process.env.GITHUB_ENV, `PRE_RELEASE_VERSION=${newBetaVersion}\n`)
  }
})
