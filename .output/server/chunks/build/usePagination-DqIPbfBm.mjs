import { ref, computed, watch } from 'vue';

function usePagination(data, initialPerPage = 10) {
  const currentPage = ref(1);
  const perPage = ref(initialPerPage);
  const totalRecords = computed(() => data.value.length);
  const totalPages = computed(
    () => Math.ceil(totalRecords.value / perPage.value)
  );
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    return data.value.slice(start, start + perPage.value);
  });
  const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
  };
  const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
  };
  const goToPage = (page) => {
    currentPage.value = Math.min(Math.max(page, 1), totalPages.value);
  };
  const getIndex = (i) => (currentPage.value - 1) * perPage.value + i + 1;
  const pageInfo = computed(() => {
    const start = (currentPage.value - 1) * perPage.value + 1;
    const end = Math.min(start + perPage.value - 1, totalRecords.value);
    return `${start}–${end} of ${totalRecords.value}`;
  });
  watch(data, () => {
    currentPage.value = 1;
  });
  watch(perPage, () => {
    currentPage.value = 1;
  });
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
  };
}

export { usePagination as u };
//# sourceMappingURL=usePagination-DqIPbfBm.mjs.map
