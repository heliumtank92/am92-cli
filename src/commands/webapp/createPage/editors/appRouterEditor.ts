import { constantCase } from '../../../../lib/changeCase'

export default function appRouterEditor(pageName: string) {
  return function (file: string): string {
    let imports = (file.match(
      /((.|\n)+)?import(.|\n)+const NotFoundPage/gm
    ) || [''])[0]

    if (!imports) {
      return file
    }

    const newImports = imports.replace(
      'const NotFoundPage',
      `const ${pageName}Page = React.lazy(
  () => import('~/src/Pages/${pageName}/${pageName}.Page')
)`
    )

    const restFile = file.replace(
      /((.|\n)+)?import(.|\n)+const NotFoundPage/gm,
      ''
    )

    const newFile = `${newImports}\n\nconst NotFoundPage${restFile}`

    let currentRoutes = (newFile.match(
      /((.|\n)+)?import(.|\n)+{\n.*path: APP_ROUTES.ANY.pathname,/gm
    ) || [''])[0]

    if (!currentRoutes) {
      return file
    }

    currentRoutes = currentRoutes.replace(
      /{\n.*path: APP_ROUTES.ANY.pathname,/gm,
      `{
    path: APP_ROUTES.${constantCase(pageName)}.pathname,
    element: <${pageName}Page />
  } as RouteObject,`
    )

    const restNewFile = newFile.replace(
      /((.|\n)+)?import(.|\n)+{\n.*path: APP_ROUTES.ANY.pathname,/gm,
      ''
    )

    return `${currentRoutes}
  {
    path: APP_ROUTES.ANY.pathname,${restNewFile.substring(
      0,
      restFile.length - 1
    )}`
  }
}
