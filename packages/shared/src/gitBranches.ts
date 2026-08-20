import getRepoName from './getRepoName.js'

export const isProtectedBranch = (name: string) => {
  if (!name) throw new Error('Name is required!')
  const badBranch = ['main', 'release', 'stage'].includes(name)

  return badBranch ? 'not-allowed' : 'allowed'
}

export const getDefaultBranch = () => {
  const {hasError, repo} = getRepoName()
  return {branch: repo === 'wxrh-emails-ui' ? 'main' : 'release', hasError}
}

export const getSelectedBranch = (branch?: string, stageVersion = 'default') => {
  if (branch === 'stage' && !stageVersion) {
    throw new Error('If the selected branch is "stage", a version is required. For \'just\' stage pass default.')
  }

  const stage = branch === 'stage' && stageVersion !== 'default' ? `stage-v${stageVersion}` : 'stage'
  return {
    branch: branch === 'stage' ? stage : branch ?? getDefaultBranch().branch,
    error: getDefaultBranch().hasError,
  }
}
