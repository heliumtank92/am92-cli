import * as colorette from 'colorette'

export const colorify = {
  initiate: (input: string | number) =>
    colorette.bold(colorette.cyanBright(input)),
  info: (input: string | number) => colorette.cyanBright(input),
  success: (input: string | number) => colorette.greenBright(input),
  complete: (input: string | number) =>
    colorette.bold(colorette.greenBright(input)),
  fatal: (input: string | number) => colorette.bold(colorette.redBright(input)),
  error: (input: string | number) => colorette.redBright(input),
  warn: (input: string | number) => colorette.yellowBright(input),
  trace: (input: string | number) => colorette.whiteBright(input)
}

export const logger = {
  initiate: (input: string | number) => console.log(colorify.initiate(input)),
  info: (input: string | number) => console.log(colorify.info(input)),
  success: (input: string | number) => console.log(colorify.success(input)),
  complete: (input: string | number) => console.log(colorify.complete(input)),
  fatal: (input: string | number) => console.log(colorify.fatal(input)),
  error: (input: string | number) => console.log(colorify.error(input)),
  warn: (input: string | number) => console.log(colorify.warn(input)),
  trace: (input: string | number) => console.log(colorify.trace(input))
}
