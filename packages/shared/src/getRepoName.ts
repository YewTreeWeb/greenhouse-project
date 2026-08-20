import * as fs from 'node:fs'
import path from 'node:path'

const getRepoName = () => {
  let repo: null | string = null
  let hasError: boolean | string = false
  try {
    const gitConfigPath = path.join(process.cwd(), '.git', 'config')
    const configContent = fs.readFileSync(gitConfigPath, 'utf8')
    const remoteOriginSection = configContent.match(/\[remote "origin"\](.|\n)*?url = (.*)/)

    if (remoteOriginSection && remoteOriginSection[2]) {
      const url = remoteOriginSection[2].trim()
      const repoNameMatch = url.match(/\/([^/]+)\.git$/)

      if (repoNameMatch && repoNameMatch[1]) {
        repo = repoNameMatch[1]
        if (process.env.NODE_ENV === 'development') console.log(repoNameMatch[1])
      }
    }
  } catch (error) {
    hasError = error instanceof Error ? error.message : `Error reading .git/config: ${error}`
  }

  return {hasError, repo}
}

export default getRepoName
