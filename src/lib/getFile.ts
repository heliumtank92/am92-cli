import fs from 'fs'
import { logger } from './logger'

export function getFile(
  filePath: string,
  errorMsg: string,
  warnMsg: string
): string {
  try {
    const indexRoutesFile = fs.readFileSync(filePath).toString('utf8')

    if (!indexRoutesFile.length) {
      logger.warn(`[Warn] ${warnMsg}`)
      process.exit()
    }

    return indexRoutesFile
  } catch (error) {
    logger.warn(`[Warn] ${warnMsg}`)
    logger.fatal(`[Error] ${errorMsg}`)
    process.exit()
  }
}
