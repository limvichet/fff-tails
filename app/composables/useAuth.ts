import type { LoginREQ } from "~/schemas/auth";
import type { User } from "~/types/auth";

const useUser = () => useState<User | null>("user", () => null);

export const useAuth = () => {
  const user = useUser();
  const isAuthenticated = computed(() => !!user.value);
  const loading = ref<boolean>(false);

  const login = async (credentials: LoginREQ) => {

    
    const config = useRuntimeConfig()
    console.log("API BASE:", config.public.apiBaseUrl)
    console.log("LOGIN URL:", config.public.apiBaseUrl + "/api/admin-public/login")
    console.log("ENV TEST:", config.public.apiBaseUrl)

    try {
      loading.value = true;
      await $fetch("/api/auth/login", { method: "POST", body: credentials });
      await fetchUser();
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
      const fetchedUser = await $fetch<User>("/api/admin-secure/user", {
        headers,
      });

      user.value = fetchedUser;
    } catch (error) {
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  };
};
