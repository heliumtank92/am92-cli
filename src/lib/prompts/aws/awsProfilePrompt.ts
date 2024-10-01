import CliCommand from '../../CliCommand'
import selectPrompt from '../selectPrompt'

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

  const profile: string = await selectPrompt(
    'Select AWS Profile:',
    profiles,
    undefined,
    envProfile
  )

  return profile
}
