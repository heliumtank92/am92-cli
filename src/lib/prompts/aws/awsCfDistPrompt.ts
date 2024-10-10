import CliCommand from '../../CliCommand'
import { logger } from '../../logger'
import inputPromptWithOptions from '../inputPromptWithOptions'

export default async function awsCfDistPrompt(
  awsProfile: string,
  cfDistId?: string
): Promise<string> {
  if (cfDistId) {
    return cfDistId
  }

  logger.info('Fetching AWS CloudFront Distributions...')
  const cfDistResponse: string = new CliCommand(
    'AWS CloudFront Distribution List',
    `aws cloudfront list-distributions`
  )
    .appendArgs('profile', awsProfile)
    .appendArgs(
      'query',
      'DistributionList.Items[*].{id:Id,domainName:DomainName,alias:Aliases.Items[0]}'
    )
    .exec(false)
    .toString()

  const cfDistList = JSON.parse(cfDistResponse).map((dist: any) => {
    return {
      name: dist.alias || dist.domainName,
      value: dist.id
    }
  })

  const cfDist: string = await inputPromptWithOptions(
    'AWS CloudFront Distribution',
    cfDistList
  )

  return cfDist
}
