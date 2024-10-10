import CliCommand from '../../CliCommand'
import { logger } from '../../logger'
import searchPrompt from '../searchPrompt'

export default async function awsS3BucketPrompt(
  awsProfile: string,
  bucketName?: string
): Promise<string> {
  if (bucketName) {
    return bucketName
  }

  logger.info('Fetching AWS S3 Buckets...')
  const buckets: string[] = new CliCommand('AWS S3 Bucket List', `aws s3 ls`)
    .appendArgs('profile', awsProfile)
    .appendArgs('recursive')
    .exec(false)
    .toString()
    .split('\n')
    .reduce((acc: string[], line: string) => {
      const bucket = line.split(' ')[2]
      if (bucket) {
        acc.push(bucket)
      }
      return acc
    }, [])

  const bucket = await searchPrompt('Select AWS S3 Bucket', buckets)
  return bucket
}
