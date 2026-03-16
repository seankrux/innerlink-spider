export interface LinkOpportunity {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  context: string;
}

/**
 * Demo function that generates sample internal link opportunities
 * In production, this would crawl the website and analyze content
 */
export function analyzeLinks(baseUrl: string): LinkOpportunity[] {
  // Remove trailing slash and protocol for display
  const domain = baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

  // Generate sample opportunities based on common SEO patterns
  const opportunities: LinkOpportunity[] = [
    {
      sourceUrl: `/${domain}/blog/seo-best-practices`,
      targetUrl: `/${domain}/services/seo-audit`,
      anchorText: "SEO audit services",
      context: "...consider getting a professional SEO audit services to identify issues...",
    },
    {
      sourceUrl: `/${domain}/blog/content-marketing-guide`,
      targetUrl: `/${domain}/services/content-strategy`,
      anchorText: "content strategy",
      context: "...a well-planned content strategy can boost your organic traffic...",
    },
    {
      sourceUrl: `/${domain}/blog/keyword-research`,
      targetUrl: `/${domain}/tools/keyword-finder`,
      anchorText: "keyword research tool",
      context: "...using our free keyword research tool to find low competition keywords...",
    },
    {
      sourceUrl: `/${domain}/about`,
      targetUrl: `/${domain}/case-studies`,
      anchorText: "client results",
      context: "...see our client results and success stories from past projects...",
    },
    {
      sourceUrl: `/${domain}/services/web-design`,
      targetUrl: `/${domain}/portfolio`,
      anchorText: "view our portfolio",
      context: "...check out our recent work in the view our portfolio section...",
    },
    {
      sourceUrl: `/${domain}/blog/social-media-tips`,
      targetUrl: `/${domain}/services/social-media-management`,
      anchorText: "social media management",
      context: "...our social media management services can help you grow...",
    },
    {
      sourceUrl: `/${domain}/pricing`,
      targetUrl: `/${domain}/contact`,
      anchorText: "contact us for custom pricing",
      context: "...enterprise plans available, contact us for custom pricing...",
    },
    {
      sourceUrl: `/${domain}/blog/email-marketing`,
      targetUrl: `/${domain}/resources/email-templates`,
      anchorText: "free email templates",
      context: "...download our free email templates to get started...",
    },
  ];

  return opportunities;
}
