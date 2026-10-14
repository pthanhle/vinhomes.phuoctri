import { SITE_CONFIG } from '@/config/site';
import { BlogPostData } from '@/data/posts';

const BASE_URL = SITE_CONFIG.siteUrl;

export function buildCoreIdentityGraph() {
  return [
    {
      '@type': 'Person',
      '@id': `${BASE_URL}/#person`,
      name: SITE_CONFIG.agent.name,
      alternateName: [SITE_CONFIG.agent.brandName, SITE_CONFIG.agent.fullName],
      jobTitle: SITE_CONFIG.agent.jobTitle,
      worksFor: {
        '@type': 'Organization',
        name: 'Vinhomes',
      },
      url: `${BASE_URL}/`,
      telephone: SITE_CONFIG.agent.phoneE164,
      email: SITE_CONFIG.agent.email,
      image: {
        '@type': 'ImageObject',
        '@id': `${BASE_URL}/#person-avatar`,
        url: SITE_CONFIG.agent.avatarUrl,
        caption: SITE_CONFIG.agent.brandName,
        inLanguage: 'vi',
      },
      sameAs: [
        SITE_CONFIG.agent.social.facebook,
        SITE_CONFIG.agent.social.tiktok,
        SITE_CONFIG.agent.social.youtube,
      ],
    },
    {
      '@type': 'RealEstateAgent',
      '@id': `${BASE_URL}/#agent`,
      name: `${SITE_CONFIG.agent.name} – ${SITE_CONFIG.agent.department}`,
      alternateName: [SITE_CONFIG.agent.brandName, SITE_CONFIG.agent.name],
      url: `${BASE_URL}/`,
      telephone: SITE_CONFIG.agent.phoneE164,
      email: SITE_CONFIG.agent.email,
      priceRange: '3.5 tỷ - 100 tỷ VNĐ',
      image: `${BASE_URL}/uploads/2026/09/vinhomes-saigon-park-tong-quan.webp`,
      areaServed: SITE_CONFIG.agent.addressLocality,
      address: {
        '@type': 'PostalAddress',
        addressLocality: SITE_CONFIG.agent.addressLocality,
        addressCountry: SITE_CONFIG.agent.addressCountry,
      },
      founder: {
        '@id': `${BASE_URL}/#person`,
      },
      sameAs: [
        SITE_CONFIG.agent.social.facebook,
        SITE_CONFIG.agent.social.tiktok,
        SITE_CONFIG.agent.social.youtube,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE_URL}/#website`,
      url: `${BASE_URL}/`,
      name: SITE_CONFIG.siteName,
      alternateName: SITE_CONFIG.siteAlternateName,
      description: SITE_CONFIG.siteDescription,
      publisher: {
        '@id': `${BASE_URL}/#person`,
      },
      inLanguage: 'vi',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/category/tin-tuc/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ];
}

export function buildHomeSchema() {
  const imageUrl = `${BASE_URL}/uploads/2026/09/vinhomes-saigon-park-tong-quan.webp`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...buildCoreIdentityGraph(),
      {
        '@type': 'ImageObject',
        '@id': `${BASE_URL}/#primaryimage`,
        url: imageUrl,
        contentUrl: imageUrl,
        width: 1670,
        height: 941,
        caption: 'Tổng quan dự án Vinhomes Sài Gòn Park 1.080ha tại Hóc Môn',
        inLanguage: 'vi',
      },
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/#webpage`,
        url: `${BASE_URL}/`,
        name: 'Vinhomes Saigon Park Hóc Môn: Giá bán, CSBH 2026 | Phước Trí Vinhomes',
        description:
          'Vinhomes Saigon Park (Hóc Môn) 1.080ha – Ivy Park & Global Park đang mở bán, chỉ từ 3,5 tỷ, vay chỉ cần 1,2 tỷ. Nhận bảng giá, CSBH mới nhất từ PKD trực tiếp CĐT: 0909 888 999.',
        datePublished: '2026-05-22T10:20:00+07:00',
        dateModified: '2026-10-14T11:10:00+07:00',
        isPartOf: { '@id': `${BASE_URL}/#website` },
        about: { '@id': `${BASE_URL}/#vinhomes-saigon-park` },
        primaryImageOfPage: { '@id': `${BASE_URL}/#primaryimage` },
        inLanguage: 'vi',
      },
      {
        '@type': 'Place',
        '@id': `${BASE_URL}/#vinhomes-saigon-park`,
        name: 'Vinhomes Sài Gòn Park (Vinhomes Saigon Park Hóc Môn)',
        description:
          'Đại đô thị 1.080ha tại xã Xuân Thới Sơn (Hóc Môn cũ), TP.HCM, mặt tiền Quốc lộ 22, gồm 5 phân khu: Ivy Park, Global Park, Laguna Park, Zen Park, Golf Park.',
        image: imageUrl,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Xuân Thới Sơn, Hóc Môn',
          addressRegion: 'Thành phố Hồ Chí Minh',
          addressCountry: 'VN',
        },
      },
    ],
  };
}

export function buildBeverlySchema() {
  const imageUrl = `${BASE_URL}/uploads/2026/09/01-banner-beverly-mo-ban-10-10.jpg`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...buildCoreIdentityGraph(),
      {
        '@type': 'ImageObject',
        '@id': `${BASE_URL}/beverly/#primaryimage`,
        url: imageUrl,
        contentUrl: imageUrl,
        width: 1920,
        height: 960,
        caption: 'Chính thức 10/10 mở bán Shop khối đế The Beverly Vinhomes Grand Park',
        inLanguage: 'vi',
      },
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/beverly/#webpage`,
        url: `${BASE_URL}/beverly/`,
        name: 'Shop Khối Đế The Beverly – Vinhomes Grand Park | Mở bán 10/10 | Phước Trí Vinhomes',
        description:
          'Shop khối đế The Beverly – Vinhomes Grand Park chính thức mở bán 10/10/2026. 8.100 cư dân sẵn có, trần cao vượt trội, số lượng giới hạn (còn 28/43 căn). Nhận bảng giá & booking: 0909 888 999.',
        datePublished: '2026-09-25T09:50:00+07:00',
        dateModified: '2026-10-14T06:32:00+07:00',
        isPartOf: { '@id': `${BASE_URL}/#website` },
        primaryImageOfPage: { '@id': `${BASE_URL}/beverly/#primaryimage` },
        inLanguage: 'vi',
      },
      {
        '@type': 'Place',
        '@id': `${BASE_URL}/beverly/#the-beverly`,
        name: 'Shop khối đế The Beverly – Vinhomes Grand Park',
        description:
          'Shop thương mại tầng đế các tòa căn hộ The Beverly, phân khu cao cấp nhất Vinhomes Grand Park, TP.HCM. Mở bán chính thức 10/10/2026.',
        image: imageUrl,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'TP. Thủ Đức, Thành phố Hồ Chí Minh',
          addressCountry: 'VN',
        },
      },
    ],
  };
}

export function buildKyHoaSchema() {
  const imageUrl = `${BASE_URL}/uploads/2026/10/vinhomes-ky-hoa-vi-tri-ban-do.webp`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...buildCoreIdentityGraph(),
      {
        '@type': 'ImageObject',
        '@id': `${BASE_URL}/kyhoa/#primaryimage`,
        url: imageUrl,
        contentUrl: imageUrl,
        width: 1280,
        height: 816,
        caption: 'Vị trí Vinhomes Kỳ Hòa 238 đường 3 Tháng 2 gần chợ Bến Thành',
        inLanguage: 'vi',
      },
      {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/kyhoa/#webpage`,
        url: `${BASE_URL}/kyhoa/`,
        name: 'Vinhomes Kỳ Hòa Quận 10 – 238 Đường 3/2 | Thông tin mới nhất 2026 | Phước Trí Vinhomes',
        description:
          'Vinhomes Kỳ Hòa 238 đường 3 Tháng 2, Quận 10 cũ: quy mô 8,2ha, cao 45 tầng, mô hình TOD gắn Metro số 2. Đăng ký nhận mặt bằng & bảng giá sớm: 0909 888 999.',
        datePublished: '2026-10-12T20:27:43+07:00',
        dateModified: '2026-10-12T21:07:48+07:00',
        isPartOf: { '@id': `${BASE_URL}/#website` },
        primaryImageOfPage: { '@id': `${BASE_URL}/kyhoa/#primaryimage` },
        inLanguage: 'vi',
      },
      {
        '@type': 'Place',
        '@id': `${BASE_URL}/kyhoa/#vinhomes-ky-hoa`,
        name: 'Vinhomes Kỳ Hòa Quận 10 – 238 Đường 3 Tháng 2',
        description:
          'Tổ hợp đô thị cao tầng TOD quy mô ~8,2 ha, cao tối đa 45 tầng tại 238 Đường 3 Tháng 2, P. Hòa Hưng (Quận 10 cũ), TP.HCM.',
        image: imageUrl,
        address: {
          '@type': 'PostalAddress',
          streetAddress: '238 Đường 3 Tháng 2, Phường Hòa Hưng',
          addressLocality: 'Thành phố Hồ Chí Minh',
          addressCountry: 'VN',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${BASE_URL}/kyhoa/#faq`,
        isPartOf: { '@id': `${BASE_URL}/kyhoa/#webpage` },
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Vinhomes Kỳ Hòa nằm ở đâu?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tại 238 đường 3 Tháng 2, phường Hòa Hưng, TP.HCM (Quận 10 cũ), giới hạn bởi các đường 3 Tháng 2, Lê Hồng Phong, Cao Thắng nối dài và Hoàng Dư Khương.',
            },
          },
          {
            '@type': 'Question',
            name: 'Dự án đã mở bán chưa, giá bao nhiêu?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Chưa. Tính đến 10/2026 dự án đang ở giai đoạn lấy ý kiến quy hoạch chi tiết 1/500, Chủ đầu tư chưa công bố giá và chính sách bán hàng. Anh/chị liên hệ Phước Trí 0909.888.999 để nhận thông tin sớm nhất.',
            },
          },
          {
            '@type': 'Question',
            name: 'Dự án có bao nhiêu tầng, quy mô bao nhiêu?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Theo hồ sơ đề xuất: khu đất khoảng 8,2 ha, chiều cao tối đa 45 tầng, hệ số sử dụng đất 11 lần, dân số khoảng 10.000 người.',
            },
          },
          {
            '@type': 'Question',
            name: 'Vì sao gọi là dự án TOD?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'TOD là mô hình đô thị phát triển gắn với giao thông công cộng. Kỳ Hòa nằm gần tuyến Metro số 2 Bến Thành – Tham Lương.',
            },
          },
        ],
      },
    ],
  };
}

export function buildBlogPostSchema(post: BlogPostData) {
  const postUrl = `${BASE_URL}/${post.slug}/`;
  const imageUrl = `${BASE_URL}${post.featuredImage}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...buildCoreIdentityGraph(),
      {
        '@type': 'ImageObject',
        '@id': `${postUrl}#primaryimage`,
        url: imageUrl,
        contentUrl: imageUrl,
        caption: post.title,
        inLanguage: 'vi',
      },
      {
        '@type': 'WebPage',
        '@id': `${postUrl}#webpage`,
        url: postUrl,
        name: post.seoTitle,
        description: post.seoDescription,
        datePublished: `${post.date}+07:00`,
        dateModified: `${post.modified}+07:00`,
        isPartOf: { '@id': `${BASE_URL}/#website` },
        primaryImageOfPage: { '@id': `${postUrl}#primaryimage` },
        inLanguage: 'vi',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${postUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Trang chủ',
            item: `${BASE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tin tức & Phân tích',
            item: `${BASE_URL}/category/tin-tuc/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title,
            item: postUrl,
          },
        ],
      },
      {
        '@type': 'BlogPosting',
        '@id': `${postUrl}#richSnippet`,
        headline: post.seoTitle,
        name: post.seoTitle,
        description: post.seoDescription,
        keywords: post.keywords.join(', '),
        datePublished: `${post.date}+07:00`,
        dateModified: `${post.modified}+07:00`,
        articleSection: 'Tin tức',
        author: { '@id': `${BASE_URL}/#person` },
        publisher: { '@id': `${BASE_URL}/#person` },
        image: { '@id': `${postUrl}#primaryimage` },
        isPartOf: { '@id': `${postUrl}#webpage` },
        mainEntityOfPage: { '@id': `${postUrl}#webpage` },
        inLanguage: 'vi',
      },
    ],
  };
}

export function buildCategorySchema() {
  const catUrl = `${BASE_URL}/category/tin-tuc/`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      ...buildCoreIdentityGraph(),
      {
        '@type': 'CollectionPage',
        '@id': `${catUrl}#webpage`,
        url: catUrl,
        name: 'Tin tức & Phân tích Đầu tư BĐS Vinhomes | Phước Trí Vinhomes',
        description:
          'Chuyên mục phân tích chuyên sâu về Vinhomes Saigon Park Hóc Môn, Shop khối đế The Beverly Grand Park, Vinhomes Kỳ Hòa Quận 10, tiến độ Vành đai 3 & Metro số 2.',
        isPartOf: { '@id': `${BASE_URL}/#website` },
        inLanguage: 'vi',
      },
    ],
  };
}
