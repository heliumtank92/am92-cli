import { search } from '@inquirer/prompts'
import CliCommand from '../CliCommand'

export default async function awsS3BucketPrompt(
  awsProfile: string,
  bucketName?: string
): Promise<string> {
  if (bucketName) {
    return bucketName
  }

  console.log('Fetching AWS S3 Buckets...')
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

  const bucket: string = await search({
    message: 'Select AWS Region:',
    source: async input => {
      if (!input) {
        return buckets
      }

      const bucketsFiltered = buckets.filter(bucketItem =>
        bucketItem.includes(input.toLowerCase())
      )
      return bucketsFiltered
    }
  })

  return bucket
}
