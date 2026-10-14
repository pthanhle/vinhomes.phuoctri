import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { BLOG_POSTS } from '@/data/posts';
import { SITE_CONFIG } from '@/config/site';
import { buildCategorySchema } from '@/lib/seo-schema';

/**
 * Fixes [BUG-02] & [SEO-03]:
 * On vinhomes.trongluu.com, /category/tin-tuc/ was completely unstyled (raw white page)
 * because wp-custom-blog-theme.css only targeted body.single-post, and had no meta description or og:image.
 * Here we provide a luxury Emerald/Gold archive page with full SEO metadata.
 */
export const metadata: Metadata = {
  title: {
    absolute: `Tin tức & Phân tích Đầu tư Vinhomes | ${SITE_CONFIG.siteName}`,
  },
  description:
    'Tổng hợp phân tích chuyên sâu về Vinhomes Saigon Park Hóc Môn, Shop khối đế The Beverly Grand Park, Vinhomes Kỳ Hòa Quận 10, tiến độ Vành đai 3 & Metro số 2 từ Phước Trí Vinhomes.',
  alternates: {
    canonical: `${SITE_CONFIG.siteUrl}/category/tin-tuc/`,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: `${SITE_CONFIG.siteUrl}/category/tin-tuc/`,
    siteName: SITE_CONFIG.siteName,
    title: `Tin tức & Phân tích Đầu tư Vinhomes | ${SITE_CONFIG.siteName}`,
    description:
      'Tổng hợp phân tích chuyên sâu về Vinhomes Saigon Park Hóc Môn, Shop khối đế The Beverly Grand Park, Vinhomes Kỳ Hòa Quận 10, tiến độ Vành đai 3 & Metro số 2.',
    images: [
      {
        url: `${SITE_CONFIG.siteUrl}/uploads/2026/09/vinhomes-saigon-park-tong-quan.webp`,
        width: 1670,
        height: 941,
        alt: 'Chuyên mục Tin tức & Phân tích Đầu tư Phước Trí Vinhomes',
      },
    ],
  },
};

export default function CategoryTinTucPage() {
  const schemaGraph = buildCategorySchema();

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0E403C 0%, #05332F 600px, #042825 100%)',
        color: '#E3ECEA',
        fontFamily: 'Montserrat, system-ui, sans-serif',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaGraph) }}
      />

      {/* Sticky Header */}
      <header
        style={{
          background: 'rgba(5, 51, 47, 0.94)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(247, 216, 205, 0.18)',
          padding: '16px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1140px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div>
            <Link
              href="/"
              style={{
                fontWeight: 800,
                fontSize: '20px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#F7D8CD',
                textDecoration: 'none',
              }}
            >
              {SITE_CONFIG.siteName}
            </Link>
            <div style={{ fontSize: '12.5px', color: '#A9C1BD', marginTop: '2px' }}>
              Vinhomes Saigon Park · Shop The Beverly · Vinhomes Kỳ Hòa – PKD trực tiếp CĐT
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <Link
              href="/"
              style={{
                color: '#E3ECEA',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: 600,
                padding: '7px 14px',
                borderRadius: '999px',
                border: '1px solid rgba(247,216,205,0.2)',
              }}
            >
              Vinhomes Saigon Park
            </Link>
            <Link
              href="/beverly/"
              style={{
                color: '#E3ECEA',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: 600,
                padding: '7px 14px',
                borderRadius: '999px',
                border: '1px solid rgba(247,216,205,0.2)',
              }}
            >
              Shop The Beverly
            </Link>
            <Link
              href="/kyhoa/"
              style={{
                color: '#E3ECEA',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: 600,
                padding: '7px 14px',
                borderRadius: '999px',
                border: '1px solid rgba(247,216,205,0.2)',
              }}
            >
              Vinhomes Kỳ Hòa
            </Link>
            <a
              href={`tel:${SITE_CONFIG.agent.phoneRaw}`}
              style={{
                background: '#E3B873',
                color: '#05332F',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: 700,
                padding: '8px 16px',
                borderRadius: '999px',
              }}
            >
              📞 {SITE_CONFIG.agent.phoneFormatted}
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1140px', margin: '0 auto', padding: '56px 20px 80px' }}>
        <div
          style={{
            borderBottom: '1px solid rgba(247,216,205,0.18)',
            paddingBottom: '28px',
            marginBottom: '40px',
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: '12px',
              letterSpacing: '0.2em',
              fontWeight: 700,
              color: '#E3B873',
              textTransform: 'uppercase',
              marginBottom: '12px',
            }}
          >
            CHUYÊN MỤC PHÂN TÍCH ĐẦU TƯ · PHƯỚC TRÍ VINHOMES
          </span>
          <h1
            style={{
              margin: '0 0 12px',
              fontSize: 'clamp(28px, 4.4vw, 44px)',
              fontWeight: 800,
              lineHeight: 1.2,
              background: 'linear-gradient(100deg, #F7D8CD 0%, #fff 45%, #E3B873 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Kiến Thức Đầu Tư, Bảng Tính Dòng Tiền &amp; Tiến Độ Hạ Tầng
          </h1>
          <p style={{ margin: 0, fontSize: '16.5px', color: '#A9C1BD', maxWidth: '780px', lineHeight: 1.7 }}>
            Tổng hợp 7 bài phân tích thực chiến từ {SITE_CONFIG.agent.fullName} ({SITE_CONFIG.agent.name}) – {SITE_CONFIG.agent.department}. Số liệu quy hoạch, bảng tính lãi vay và tỷ suất dòng tiền cho thuê được cập nhật mới nhất tháng 10/2026.
          </p>
        </div>

        {/* 3 Project Quick Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '18px',
            marginBottom: '48px',
          }}
        >
          {SITE_CONFIG.projects.map((proj) => (
            <Link
              key={proj.id}
              href={proj.path}
              style={{
                display: 'block',
                padding: '22px',
                borderRadius: '18px',
                background: 'rgba(0,0,0,0.28)',
                border: '1px solid rgba(227,184,115,0.32)',
                textDecoration: 'none',
                color: '#fff',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  color: '#E3B873',
                  textTransform: 'uppercase',
                }}
              >
                LANDING PAGE DỰ ÁN
              </span>
              <h2 style={{ margin: '6px 0 8px', fontSize: '19px', color: '#F7D8CD', fontWeight: 700 }}>
                {proj.name}
              </h2>
              <p style={{ margin: '0 0 10px', fontSize: '13.5px', color: '#A9C1BD' }}>
                📍 {proj.location}
              </p>
              <div style={{ fontSize: '13px', color: '#E3B873', fontWeight: 600 }}>
                {proj.status} →
              </div>
            </Link>
          ))}
        </div>

        {/* All 7 Blog Posts Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: '26px',
          }}
        >
          {BLOG_POSTS.map((post) => (
            <article
              key={post.id}
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'rgba(0,0,0,0.24)',
                border: '1px solid rgba(247,216,205,0.18)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
              }}
            >
              <Link href={`/${post.slug}/`} style={{ display: 'block', overflow: 'hidden' }}>
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '210px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Link>
              <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#E3B873',
                    fontWeight: 700,
                    marginBottom: '10px',
                  }}
                >
                  <span>{post.projectTag}</span>
                  <span style={{ color: '#A9C1BD', fontWeight: 500 }}>{post.readingTime}</span>
                </div>
                <h2 style={{ margin: '0 0 12px', fontSize: '19px', lineHeight: 1.38 }}>
                  <Link
                    href={`/${post.slug}/`}
                    style={{ color: '#fff', textDecoration: 'none', fontWeight: 700 }}
                  >
                    {post.title}
                  </Link>
                </h2>
                <p
                  style={{
                    margin: '0 0 18px',
                    fontSize: '14.5px',
                    color: '#B9CCC9',
                    lineHeight: 1.65,
                    flex: 1,
                  }}
                >
                  {post.seoDescription}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '14px',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Link
                    href={`/${post.slug}/`}
                    style={{
                      color: '#F7D8CD',
                      fontWeight: 700,
                      fontSize: '14px',
                      textDecoration: 'none',
                    }}
                  >
                    Đọc bài phân tích →
                  </Link>
                  <span style={{ fontSize: '12px', color: '#8FA9A5' }}>
                    {post.date.slice(0, 10)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <footer
        style={{
          background: '#03211E',
          borderTop: '1px solid rgba(247,216,205,0.18)',
          padding: '32px 20px',
          textAlign: 'center',
          color: '#A9C1BD',
          fontSize: '14px',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ margin: '0 0 8px', fontWeight: 600, color: '#F7D8CD' }}>
            {SITE_CONFIG.agent.fullName} ({SITE_CONFIG.agent.name}) – {SITE_CONFIG.agent.department}
          </p>
          <p style={{ margin: 0 }}>
            Hotline/Zalo: {SITE_CONFIG.agent.phoneFormatted} · Email: {SITE_CONFIG.agent.email} · Website: {SITE_CONFIG.siteUrl}
          </p>
        </div>
      </footer>
    </div>
  );
}
