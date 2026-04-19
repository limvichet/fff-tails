import { ref, computed, watch, type Ref } from "vue"

export function usePagination<T>(
  data: Ref<T[]>,
  initialPerPage: number = 10
) {
  const currentPage = ref<number>(1)
  const perPage = ref<number>(initialPerPage)

  // ✅ total records
  const totalRecords = computed(() => data.value.length)

  // ✅ total pages
  const totalPages = computed(() =>
    Math.ceil(totalRecords.value / perPage.value)
  )

  // ✅ paginated data
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    return data.value.slice(start, start + perPage.value)
  })

  // ✅ navigation
  const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
  }

  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--
  }

  const goToPage = (page: number) => {
    currentPage.value = Math.min(Math.max(page, 1), totalPages.value)
  }

  // ✅ helper index (NO template error anymore)
  const getIndex = (i: number) =>
    (currentPage.value - 1) * perPage.value + i + 1

  // ✅ display text (e.g. "Showing 11–20 of 125")
  const pageInfo = computed(() => {
    const start = (currentPage.value - 1) * perPage.value + 1
    const end = Math.min(start + perPage.value - 1, totalRecords.value)
    return `${start}–${end} of ${totalRecords.value}`
  })

  // ✅ reset page when data changes
  watch(data, () => {
    currentPage.value = 1
  })

  // ✅ reset page when page size changes
  watch(perPage, () => {
    currentPage.value = 1
  })

  return {
    currentPage,
    perPage,
    totalRecords,
    totalPages,
    paginatedData,
    pageInfo,
    nextPage,
    prevPage,
    goToPage,
    getIndex
  }
}