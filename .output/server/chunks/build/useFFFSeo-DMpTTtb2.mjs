import { t as useSeoMeta, b as useNuxtApp, h as useRoute, m as useOgImageRuntimeConfig, s as setHeadOgImagePrebuilt, o as getOgImagePath, q as createOgImageMeta } from './server.mjs';
import { ref, toValue } from 'vue';

function defineOgImage(_options = {}) {
  const nuxtApp = useNuxtApp();
  const route = useRoute();
  const basePath = route.path || "/";
  if (nuxtApp.payload.path === basePath) {
    const state = ref(false);
    state.value = true;
  }
  const { defaults } = useOgImageRuntimeConfig();
  const options = toValue(_options);
  if (options === false) {
    return;
  }
  const validOptions = options;
  for (const key in defaults) {
    if (validOptions[key] === void 0)
      validOptions[key] = defaults[key];
  }
  if (route.query)
    validOptions._query = route.query;
  if (validOptions.url) {
    setHeadOgImagePrebuilt(validOptions);
    return;
  }
  const path = getOgImagePath(basePath, validOptions);
  createOgImageMeta(path, validOptions, nuxtApp.ssrContext);
}
function defineOgImageComponent(component, props = {}, options = {}) {
  return defineOgImage({
    ...options,
    component,
    props
  });
}
const defaultSeo = {
  title: "FFF tails"
};
const useFFFSeo = ({
  title,
  description,
  ogImageHeadline = "FFF Website",
  ogImageComponent = "EachPage"
}) => {
  useSeoMeta({
    title,
    description,
    ogSiteName: "fff-admin.io",
    ogTitle: title,
    ogDescription: description,
    twitterTitle: title,
    twitterSite: "fff-admin.io",
    twitterDescription: description
  });
  defineOgImageComponent(ogImageComponent, {
    headline: ogImageHeadline,
    title,
    desc: description
  });
};

export { defaultSeo as d, useFFFSeo as u };
//# sourceMappingURL=useFFFSeo-DMpTTtb2.mjs.map
