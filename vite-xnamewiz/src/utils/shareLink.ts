import appConfig from "../appConfig.json";

type SocialPlatform = {
  twitter: { text: string };
  linkedin: { url: string; title: string; summary: string; source: string };
  telegram: { url: string; text: string };
};

interface ShareUrlConfig<T extends keyof SocialPlatform> {
    baseUrl: string;
    params: SocialPlatform[T];
  }
  
  const buildUrl = <T extends keyof SocialPlatform>(
    config: ShareUrlConfig<T>
  ): string => {
    const params = new URLSearchParams();
    Object.entries(config.params).forEach(([key, value]) => {
      params.append(key, value);
    });
    return `${config.baseUrl}?${params.toString()}`;
  };
  
  export const openShareLink = <T extends keyof SocialPlatform>(
    platform: T,
    content: string,
    url: string = appConfig.homepage
  ) => {
    const title: string = appConfig.name;
    const source: string = "xnamewiz issuer";
  
    // Define platform-specific configurations without type assertion
    const configs = {
      twitter: {
        baseUrl: "https://twitter.com/intent/tweet",
        params: { text: `${content} ${url}` }
      },
      linkedin: {
        baseUrl: "https://www.linkedin.com/shareArticle",
        params: { url, title, summary: content, source }
      },
      telegram: {
        baseUrl: "https://t.me/share/url",
        params: { url, text: `${content} ${url}` }
      }
    };
  
    // Type-safe access to the configuration
    const config = configs[platform] as ShareUrlConfig<T>;
    
    window.open(buildUrl(config), "_blank");
  };
