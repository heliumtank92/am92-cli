import { select } from '@inquirer/prompts'
import CliCommand from '../../CliCommand'

export default async function awsProfilePrompt(
  awsProfile?: string
): Promise<string> {
  if (awsProfile) {
    return awsProfile
  }

  const profiles = new CliCommand(
    'AWS Profile List',
    'aws configure list-profiles'
  )
    .exec(false)
    .toString()
    .split('\n')
    .filter((line: string) => !!line.length)

  const envProfile = process.env.AWS_PROFILE || ''

  const profile: string = await select({
    message: 'Select AWS Profile:',
    choices: profiles,
    default: envProfile
  })

  return profile
}
