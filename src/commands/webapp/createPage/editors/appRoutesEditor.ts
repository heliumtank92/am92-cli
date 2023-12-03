import { constantCase } from '../../../../lib/changeCase'

export default function appRoutesEditor(pageName: string, pagePath: string) {
  return function (file: string): string {
    let currentRoutes = (file.match(/((.|\n)+)?import(.|\n)+?ANY:/gm) || [
      ''
    ])[0]

    if (!currentRoutes) {
      return file
    }

    currentRoutes = currentRoutes.replace('ANY:', '')

    const restFile = file.replace(/((.|\n)+)?import(.|\n)+?ANY:/gm, '')

    return `${currentRoutes}${constantCase(pageName)}: {
    pathname: '${pagePath}'
  },

  ANY:${restFile.substring(0, restFile.length - 1)}`
  }
}
