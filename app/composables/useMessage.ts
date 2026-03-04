import { ref } from "vue"

const successMsg = ref<string | null>(null)
const errorMsg = ref<string | null>(null)

let successTimer: ReturnType<typeof setTimeout> | null = null
let errorTimer: ReturnType<typeof setTimeout> | null = null

export const useMessage = () => {

  const success = (message: string, duration = 3000) => {
    successMsg.value = message

    if (successTimer) clearTimeout(successTimer)

    successTimer = setTimeout(() => {
      successMsg.value = null
    }, duration)
  }

  const error = (message: string, duration = 4000) => {
    errorMsg.value = message

    if (errorTimer) clearTimeout(errorTimer)

    errorTimer = setTimeout(() => {
      errorMsg.value = null
    }, duration)
  }

  return {
    successMsg,
    errorMsg,
    success,
    error,
  }
}