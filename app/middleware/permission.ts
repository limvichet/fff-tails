export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  if (!auth.isAuthenticated.value) {
    return navigateTo("/app/signin")
  }

  const requiredPermissions = to.meta.permissions as string[] | undefined

  if (!requiredPermissions?.length) {
    return
  }

  const allowed = requiredPermissions.some(permission =>
    auth.hasPermission(permission)
  )

  if (!allowed) {
    return navigateTo("/403")
  }
})