import { ref } from "vue";

const successMsg = ref<string | null>(null)
const errorMsg = ref<string | null>(null)

export const useMessage = () => {
  return { successMsg, errorMsg }
}
