import checkboxPrompt from './checkboxPrompt'

export default async function repoBranchesPrompt(
  branches: string[]
): Promise<string[]> {
  const selectedBranches = await checkboxPrompt(
    'Select Branches',
    REPO_BRANCHES,
    branches
  )

  return selectedBranches
}

const REPO_BRANCHES = ['preprod', 'staging', 'dev', 'release/v1']
