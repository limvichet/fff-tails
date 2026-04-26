import type { ResolvableValue } from "@unhead/vue";

export const defaultSeo = {
  desc: "Welcome to FFF Platform! Created to improve your productivity!",
  title: "FFF tails",
  site: "https://limvichet.github.io/fff-tails/",
};

interface FFFSEOProps {
  title: ResolvableValue<string | undefined>;
  description: ResolvableValue<string | undefined>;
  ogImageHeadline?: string;
  ogImageComponent?: string;
}

export const useFFFSeo = ({
  title,
  description,
  ogImageHeadline = "FFF Website",
  ogImageComponent = "EachPage",
}: FFFSEOProps) => {
  useSeoMeta({
    title: title,
    description,
    ogSiteName: "fff-admin.io",
    ogTitle: title,
    ogDescription: description,
    twitterTitle: title,
    twitterSite: "fff-admin.io",
    twitterDescription: description,
  });

  // Render the Open Graph image component:
  // defineOgImageComponent(ogImageComponent, {
  //   headline: ogImageHeadline,
  //   title: title,
  //   desc: description,
  // });
};
