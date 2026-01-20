import type { LoginRequestBody, RegisterRequestBody, User } from "~/types/auth";

const useUser = () => useState<User | null>("user", () => null);

export const useAuth = () => {
  const user = useUser();
  const isAuthenticated = computed(() => !!user.value);
  const loading = ref<boolean>(false);

  const register = async (credentials: RegisterRequestBody) => {
    try {
      loading.value = true;
      await $fetch("/api/auth/register", { method: "POST", body: credentials });
      await fetchUser();
    } catch (error: any) {
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const login = async (credentials: LoginRequestBody) => {
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
    const token = useCookie('auth_token', { path: '/' }); // Match the path!
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
      const fetchedUser = await $fetch<User>("/api/auth/user", {
        headers,
        // Adding this tells Nuxt not to log the error to the terminal/console
        onResponseError({ response }) {
          if (response.status === 401) {
            // Silently handle guest status
          }
        }
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
    register,
    login,
    logout,
    fetchUser,
  };
};
