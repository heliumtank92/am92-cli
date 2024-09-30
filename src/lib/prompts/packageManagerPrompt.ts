import { select } from '@inquirer/prompts'

export default async function packageManagerPrompt(
  packageManager?: string
): Promise<string> {
  if (packageManager) {
    return packageManager
  }

  const pkgMgr: string = await select({
    message: 'Select Package Manager:',
    choices: PACKAGE_MANAGERS,
    default: PACKAGE_MANAGERS[0]
  })

  return pkgMgr
}

const PACKAGE_MANAGERS = ['npm', 'pnpm']
