export interface LinkOpportunity {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  context: string;
}

/**
 * Demo function that generates sample internal link opportunities.
 * In production, this would crawl the website and analyze content
 * to find pages that mention keywords targeted by other pages.
 */
export function analyzeLinks(baseUrl: string): LinkOpportunity[] {
  // Strip trailing slash from the base URL
  const cleanBase = baseUrl.replace(/\/$/, "");

  const opportunities: LinkOpportunity[] = [
    {
      sourceUrl: `${cleanBase}/blog/seo-best-practices`,
      targetUrl: `${cleanBase}/services/seo-audit`,
      anchorText: "SEO audit services",
      context:
        '...consider getting a professional "SEO audit services" assessment to identify technical issues on your site...',
    },
    {
      sourceUrl: `${cleanBase}/blog/content-marketing-guide`,
      targetUrl: `${cleanBase}/services/content-strategy`,
      anchorText: "content strategy",
      context:
        '...a well-planned "content strategy" can boost your organic traffic by 3-5x within six months...',
    },
    {
      sourceUrl: `${cleanBase}/blog/keyword-research`,
      targetUrl: `${cleanBase}/tools/keyword-finder`,
      anchorText: "keyword research tool",
      context:
        '...try using our free "keyword research tool" to find low-competition keywords in your niche...',
    },
    {
      sourceUrl: `${cleanBase}/about`,
      targetUrl: `${cleanBase}/case-studies`,
      anchorText: "client results",
      context:
        '...see our "client results" and success stories from past projects across multiple industries...',
    },
    {
      sourceUrl: `${cleanBase}/services/web-design`,
      targetUrl: `${cleanBase}/portfolio`,
      anchorText: "view our portfolio",
      context:
        '...check out our recent work — "view our portfolio" to see responsive designs we\'ve shipped...',
    },
    {
      sourceUrl: `${cleanBase}/blog/social-media-tips`,
      targetUrl: `${cleanBase}/services/social-media-management`,
      anchorText: "social media management",
      context:
        '...our "social media management" services can help you grow engagement and followers...',
    },
    {
      sourceUrl: `${cleanBase}/pricing`,
      targetUrl: `${cleanBase}/contact`,
      anchorText: "contact us for custom pricing",
      context:
        '...enterprise plans are available — "contact us for custom pricing" tailored to your needs...',
    },
    {
      sourceUrl: `${cleanBase}/blog/email-marketing`,
      targetUrl: `${cleanBase}/resources/email-templates`,
      anchorText: "free email templates",
      context:
        '...download our "free email templates" to get started with high-converting campaigns...',
    },
  ];

  return opportunities;
}
