export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuth()

  // Not logged in
  if (!auth.isAuthenticated.value) {
    return navigateTo("/app/signin")
  }

  const requiredRoles = to.meta.roles as string[] | undefined

  // No roles required
  if (!requiredRoles?.length) {
    return
  }

  // User has at least one required role
  const allowed = requiredRoles.some(role => auth.hasRole(role))

  if (!allowed) {
    return navigateTo("/403")
  }
})