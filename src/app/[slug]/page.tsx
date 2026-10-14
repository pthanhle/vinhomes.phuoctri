import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import { BLOG_POSTS, getPostBySlug } from '@/data/posts';
import { SITE_CONFIG } from '@/config/site';
import { buildBlogPostSchema } from '@/lib/seo-schema';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: 'Không tìm thấy bài viết' };
  }

  const postUrl = `${SITE_CONFIG.siteUrl}/${post.slug}/`;
  const imageUrl = `${SITE_CONFIG.siteUrl}${post.featuredImage}`;

  return {
    title: {
      absolute: `${post.seoTitle} | ${SITE_CONFIG.siteName}`,
    },
    description: post.seoDescription,
    keywords: post.keywords,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: 'article',
      locale: 'vi_VN',
      url: postUrl,
      siteName: SITE_CONFIG.siteName,
      title: post.seoTitle,
      description: post.seoDescription,
      publishedTime: `${post.date}+07:00`,
      modifiedTime: `${post.modified}+07:00`,
      authors: [SITE_CONFIG.agent.social.facebook],
      // Fixes [SEO-03]: Static image URL instead of webpc-passthru.php
      images: [
        {
          url: imageUrl,
          width: 1536,
          height: 864,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle,
      description: post.seoDescription,
      images: [imageUrl],
    },
  };
}

const PT_BLOG_THEME_CSS = `
/* === PT BLOG – Giao diện bài viết đồng bộ trang chủ VSP (Phước Trí Vinhomes) === */
.pt-single-post {
  --g1: #0E403C;
  --g2: #05332F;
  --pk: #F7D8CD;
  --gd: #E3B873;
  --rd: #940401;
  --tx: #E3ECEA;
  --mu: #A9C1BD;
  --ln: rgba(247,216,205,.18);
  background: linear-gradient(180deg, #0E403C 0, #05332F 600px, #05332F 100%) fixed !important;
  color: var(--tx);
  font-family: Montserrat, system-ui, sans-serif;
  font-size: 17px;
  line-height: 1.8;
  min-height: 100vh;
}
.pt-single-post #site-header {
  background: rgba(5,51,47,.94);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--ln);
  padding: 14px 0;
  max-width: none;
  position: sticky;
  top: 0;
  z-index: 50;
}
.pt-single-post #site-header .header-inner {
  max-width: 1020px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
}
.pt-single-post .site-title,
.pt-single-post .site-title a {
  font-family: Montserrat, sans-serif !important;
  font-weight: 800 !important;
  font-size: 20px !important;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--pk) !important;
  text-decoration: none !important;
  margin: 0;
}
.pt-single-post .site-description {
  color: var(--mu) !important;
  font-size: 12.5px;
  letter-spacing: .04em;
  margin: 2px 0 0;
}
.pt-blog-nav {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
}
.pt-blog-nav a {
  color: #DCE7E5 !important;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none !important;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(247,216,205,.18);
  transition: .2s;
}
.pt-blog-nav a:hover {
  border-color: var(--gd);
  color: var(--gd) !important;
}
.pt-blog-nav a.cta {
  background: var(--gd);
  color: #05332F !important;
  border-color: var(--gd);
  font-weight: 700;
}
.pt-single-post main#content {
  max-width: 860px;
  margin: 0 auto;
  padding: 46px 20px 70px;
}
.pt-single-post .page-header {
  margin-bottom: 30px;
  padding-bottom: 26px;
  border-bottom: 1px solid var(--ln);
}
.pt-single-post .page-header:before {
  content: "BLOG · PHƯỚC TRÍ – PKD TRỰC TIẾP CĐT";
  display: block;
  font-size: 12px;
  letter-spacing: .2em;
  font-weight: 700;
  color: var(--gd);
  margin-bottom: 14px;
}
.pt-single-post h1.entry-title {
  font-family: Montserrat, sans-serif !important;
  font-weight: 800;
  font-size: clamp(28px, 4.6vw, 44px);
  line-height: 1.22;
  color: #fff;
  margin: 0;
  background: linear-gradient(100deg, #F7D8CD 0%, #fff 40%, #E3B873 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.pt-single-post .page-content { color: var(--tx); }
.pt-single-post .page-content p,
.pt-single-post .page-content li { color: var(--tx); }
.pt-single-post .page-content h2 {
  font-family: Montserrat, sans-serif;
  font-weight: 800;
  font-size: clamp(23px, 3vw, 30px);
  line-height: 1.3;
  color: var(--pk);
  margin: 48px 0 16px;
  padding-left: 16px;
  border-left: 4px solid var(--gd);
}
.pt-single-post .page-content h3 {
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #fff;
  margin: 30px 0 10px;
}
.pt-single-post .page-content a {
  color: var(--gd);
  text-decoration: underline;
  text-decoration-color: rgba(227,184,115,.45);
  text-underline-offset: 3px;
  font-weight: 600;
}
.pt-single-post .page-content a:hover { color: var(--pk); }
.pt-single-post .page-content strong { color: #fff; }
.pt-single-post .page-content em { color: var(--mu); }
.pt-single-post .page-content ul,
.pt-single-post .page-content ol {
  padding-left: 22px;
  margin: 0 0 20px;
}
.pt-single-post .page-content li { margin-bottom: 8px; }
.pt-single-post .page-content ul li::marker { color: var(--gd); }
.pt-single-post .page-content ol li::marker { color: var(--gd); font-weight: 700; }
.pt-single-post .page-content figure { margin: 30px 0; }
.pt-single-post .page-content figure img {
  border-radius: 16px;
  box-shadow: 0 14px 40px rgba(0,0,0,.35);
  width: 100%;
  height: auto;
}
.pt-single-post .page-content figcaption {
  text-align: center;
  font-size: 13px;
  color: var(--mu);
  margin-top: 10px;
}
.pt-single-post .page-content table:not(.tlc table) {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  margin: 22px 0 10px;
  font-size: 15px;
  border: 1px solid var(--ln);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(0,0,0,.18);
}
.pt-single-post .page-content table:not(.tlc table) th {
  background: rgba(247,216,205,.12);
  color: var(--pk);
  font-weight: 700;
  text-align: left;
  padding: 12px 14px;
  border: 0;
  font-size: 13.5px;
  text-transform: uppercase;
  letter-spacing: .03em;
}
.pt-single-post .page-content table:not(.tlc table) td {
  padding: 11px 14px;
  border: 0;
  border-top: 1px solid rgba(255,255,255,.07);
  color: var(--tx);
  background: transparent;
}
.pt-single-post .page-content table:not(.tlc table) tr:hover td {
  background: rgba(247,216,205,.05);
}
.pt-single-post .page-content blockquote {
  border-left: 4px solid var(--gd);
  background: rgba(0,0,0,.2);
  margin: 24px 0;
  padding: 16px 20px;
  border-radius: 0 12px 12px 0;
}
.pt-single-post #site-footer {
  background: #03211E;
  color: var(--mu);
  border-top: 1px solid var(--ln);
  max-width: none;
  padding: 32px 20px;
}
.pt-single-post #site-footer * { color: var(--mu) !important; }
@media (max-width: 767px) {
  .pt-single-post { font-size: 16px; }
  .pt-single-post main#content { padding: 30px 16px 60px; }
  .pt-single-post .page-content table:not(.tlc table) { display: block; overflow-x: auto; }
}
.pt-single-post .page-content .tlc-big strong {
  color: #E3B873;
  font-size: clamp(26px, 4vw, 34px);
}
.pt-single-post .page-content .tlc .tlc-s,
.pt-single-post .page-content .tlc .tlc-n { color: #A9C1BD; }
.pt-single-post .page-content .tlc .tlc-n { font-size: 11.5px; }
.pt-single-post .page-content .tlc a { text-decoration: none; }
`;

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const schemaGraph = buildBlogPostSchema(post);
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <div className="pt-single-post single-post">
      <style dangerouslySetInnerHTML={{ __html: PT_BLOG_THEME_CSS }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      <header id="site-header" className="site-header dynamic-header">
        <div className="header-inner">
          <div className="site-branding show-title">
            <div className="site-title show">
              <Link href="/" title="Trang chủ" rel="home">
                {SITE_CONFIG.siteName}
              </Link>
            </div>
            <p className="site-description show">
              Vinhomes Saigon Park Hóc Môn &amp; Shop The Beverly – PKD trực tiếp CĐT
            </p>
          </div>
          <nav className="pt-blog-nav" aria-label="Điều hướng dự án">
            <Link href="/">Vinhomes Saigon Park</Link>
            <Link href="/beverly/">Shop The Beverly</Link>
            <Link href="/kyhoa/">Vinhomes Kỳ Hòa</Link>
            <Link href="/category/tin-tuc/">Tin tức</Link>
            <a href={`tel:${SITE_CONFIG.agent.phoneRaw}`} className="cta">
              📞 {SITE_CONFIG.agent.phoneFormatted}
            </a>
          </nav>
        </div>
      </header>

      <main id="content" className={`site-main post-${post.id} post type-post status-publish`}>
        <div className="page-header">
          <h1 className="entry-title">{post.title}</h1>
          <div
            style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap',
              marginTop: '14px',
              fontSize: '13px',
              color: '#A9C1BD',
            }}
          >
            <span>
              ✍️ Tác giả: <strong style={{ color: '#F7D8CD' }}>{SITE_CONFIG.agent.fullName} ({SITE_CONFIG.agent.name})</strong>
            </span>
            <span>·</span>
            <span>🏷️ Dự án: <Link href={post.projectUrl} style={{ color: '#E3B873', textDecoration: 'none' }}>{post.projectTag}</Link></span>
            <span>·</span>
            <span>⏱️ {post.readingTime}</span>
          </div>
        </div>

        <div
          className="page-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {/* Author Box & Direct Lead CTA (Replaces unstyled WordPress spam comment form) */}
        <section
          aria-label="Thông tin chuyên gia tư vấn"
          style={{
            marginTop: '52px',
            padding: '28px 24px',
            borderRadius: '20px',
            background: 'rgba(0,0,0,0.26)',
            border: '1px solid rgba(247,216,205,0.22)',
          }}
        >
          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src="/uploads/2026/05/cropped-logo-du-an-vinhomes-saigon-park.png"
              alt={SITE_CONFIG.agent.brandName}
              width={64}
              height={64}
              style={{ borderRadius: '50%', border: '2px solid #E3B873' }}
            />
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#E3B873', fontWeight: 700 }}>
                Chuyên gia tư vấn BĐS Vinhomes
              </div>
              <h3 style={{ margin: '4px 0 6px', fontSize: '20px', color: '#fff' }}>
                {SITE_CONFIG.agent.fullName} ({SITE_CONFIG.agent.name}) – {SITE_CONFIG.agent.jobTitle}
              </h3>
              <p style={{ margin: 0, fontSize: '14.5px', color: '#DCE7E5', lineHeight: 1.6 }}>
                Phòng kinh doanh trực tiếp Chủ đầu tư Vinhomes. Cung cấp bảng giá gốc, mặt bằng 1/500, giỏ hàng độc quyền và bảng tính dòng tiền thực chiến cho nhà đầu tư.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
            <a
              href={SITE_CONFIG.agent.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                minWidth: '200px',
                textAlign: 'center',
                padding: '13px 20px',
                borderRadius: '999px',
                background: '#F7D8CD',
                color: '#05332F',
                fontWeight: 700,
                fontSize: '14.5px',
                textDecoration: 'none',
              }}
            >
              💬 Nhận bảng giá &amp; mặt bằng qua Zalo
            </a>
            <a
              href={`tel:${SITE_CONFIG.agent.phoneRaw}`}
              style={{
                flex: 1,
                minWidth: '200px',
                textAlign: 'center',
                padding: '13px 20px',
                borderRadius: '999px',
                background: '#940401',
                color: '#fff',
                fontWeight: 700,
                fontSize: '14.5px',
                textDecoration: 'none',
              }}
            >
              📞 Gọi trực tiếp: {SITE_CONFIG.agent.phoneFormatted}
            </a>
          </div>
        </section>

        {/* Related Posts */}
        <section style={{ marginTop: '48px' }} aria-label="Bài viết liên quan">
          <h2
            style={{
              fontSize: '22px',
              color: '#F7D8CD',
              marginBottom: '20px',
              paddingLeft: '14px',
              borderLeft: '4px solid #E3B873',
            }}
          >
            Bài viết phân tích liên quan
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '18px',
            }}
          >
            {relatedPosts.map((rp) => (
              <Link
                key={rp.id}
                href={`/${rp.slug}/`}
                style={{
                  display: 'block',
                  padding: '18px',
                  borderRadius: '16px',
                  background: 'rgba(0,0,0,0.22)',
                  border: '1px solid rgba(247,216,205,0.16)',
                  textDecoration: 'none',
                  color: '#fff',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    color: '#E3B873',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: '8px',
                  }}
                >
                  {rp.projectTag} · {rp.readingTime}
                </span>
                <h3 style={{ margin: '0 0 8px', fontSize: '16px', lineHeight: 1.4, color: '#fff' }}>
                  {rp.title}
                </h3>
                <span style={{ fontSize: '13px', color: '#F7D8CD', fontWeight: 600 }}>
                  Đọc chi tiết →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer id="site-footer" className="site-footer dynamic-footer footer-has-copyright">
        <div
          className="footer-inner"
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div className="site-branding show-logo">
            <p className="site-description show" style={{ margin: 0 }}>
              {SITE_CONFIG.siteName} – Vinhomes Saigon Park Hóc Môn, Shop The Beverly &amp; Vinhomes Kỳ Hòa
            </p>
          </div>
          <div className="copyright show">
            <p style={{ margin: 0 }}>
              Copyright © 2026 – {SITE_CONFIG.agent.name} ({SITE_CONFIG.agent.phoneFormatted}) | PKD trực tiếp CĐT Vinhomes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
