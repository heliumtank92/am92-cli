import selectPrompt from './selectPrompt'

export default async function packageManagerPrompt(
  packageManager?: string
): Promise<string> {
  const pkgMgr: string = await selectPrompt(
    'Select Package Manager:',
    PACKAGE_MANAGERS,
    packageManager,
    PACKAGE_MANAGERS[0]
  )

  return pkgMgr
}

const PACKAGE_MANAGERS = ['npm', 'pnpm']
