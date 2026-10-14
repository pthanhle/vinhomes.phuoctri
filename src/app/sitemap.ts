import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/config/site';
import { BLOG_POSTS } from '@/data/posts';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.siteUrl;

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date('2026-10-14T11:10:00+07:00'),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/beverly/`,
      lastModified: new Date('2026-10-14T06:32:00+07:00'),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/kyhoa/`,
      lastModified: new Date('2026-10-12T21:07:48+07:00'),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/category/tin-tuc/`,
      lastModified: new Date('2026-10-14T10:00:00+07:00'),
      changeFrequency: 'daily',
      priority: 0.85,
    },
  ];

  // Fixes [SEO-04]: Includes ALL 7 blog posts dynamically (vinhomes.trongluu.com missed 4 of 7 posts in post-sitemap.xml)
  const postPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${baseUrl}/${post.slug}/`,
    lastModified: new Date(`${post.modified}+07:00`),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...postPages];
}
