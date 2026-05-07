import type { LoginREQ } from "~/schemas/auth";
import type { User } from "~/types/auth";

const useUser = () => useState<User | null>("user", () => null);
const useRoles = () => useState<string[]>("roles", () => []);
const usePermissions = () => useState<string[]>("permissions", () => []);

export const useAuth = () => {
  const user = useUser();
  const roles = useRoles()
  const permissions = usePermissions()

  const isAuthenticated = computed(() => !!user.value);
  const loading = ref<boolean>(false);

  // ✅ helper functions
  const hasRole = (role: string) => roles.value.includes(role)
  const hasPermission = (perm: string) => permissions.value.includes(perm)

  const login = async (credentials: LoginREQ) => {


    // const config = useRuntimeConfig()
    // console.log("API BASE:", config.public.apiBaseUrl)
    // console.log("LOGIN URL:", config.public.apiBaseUrl + "/api/admin-public/login")
    // console.log("ENV TEST:", config.public.apiBaseUrl)

    try {
      loading.value = true;
      const res = await $fetch("/api/auth/login", { method: "POST", body: credentials });

      // ✅ store everything
      user.value = res.user
      // roles.value = res.roles || []
      // permissions.value = res.permissions || []

      // ⏳ wait a bit for cookie to be stored in browser
      await new Promise((resolve) => setTimeout(resolve, 100));

      // ✅ now cookie is available
      await fetchUser();

      // console.log(res)
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      // 1. Tell the server to kill the session
      await $fetch("/api/auth/logout", { method: "POST" });

      // 2. Clear the local cookie/state
      const token = useCookie('token', { path: '/' }); // Match the path!
      token.value = null;
      user.value = null;
      roles.value = []
      permissions.value = []

      // 3. Redirect to your designated "Logged Out" entry point
      return await navigateTo("/app/signin", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const fetchUser = async (headers: HeadersInit = {}) => {
    try {
      loading.value = true;
      // pass the headers from the plugin here.
      const res = await $fetch<{ 
        user: User;
        roles: string[];
        permissions: string[];
      }>("/api/admin-secure/user", { headers });

      user.value = res.user;
      roles.value = res.roles || [];
      permissions.value = res.permissions || [];

    } catch (error) {
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    roles,
    permissions,
    loading,
    isAuthenticated,
    fetchUser,
    login,
    logout,
    hasRole,
    hasPermission,
  };
};