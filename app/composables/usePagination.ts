import { ref, computed, watch } from "vue"

export function usePagination<T>(data: any, perPage = 10) {
  const currentPage = ref(1)

  const totalPages = computed(() => {
    return Math.ceil((data.value?.length || 0) / perPage)
  })

  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage
    const end = start + perPage
    return data.value.slice(start, end)
  })

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  // Reset page when data changes
  watch(data, () => {
    currentPage.value = 1
  })

  return {
    currentPage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    goToPage
  }
}