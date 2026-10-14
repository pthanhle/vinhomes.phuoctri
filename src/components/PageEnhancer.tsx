'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/config/site';

interface LightboxItem {
  src: string;
  title: string;
  slideshow?: string;
}

export default function PageEnhancer() {
  const pathname = usePathname();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItems, setLightboxItems] = useState<LightboxItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setZoomed(false);
  }, []);

  const nextSlide = useCallback(() => {
    setZoomed(false);
    setLightboxIndex((prev) => (prev + 1) % Math.max(lightboxItems.length, 1));
  }, [lightboxItems.length]);

  const prevSlide = useCallback(() => {
    setZoomed(false);
    setLightboxIndex((prev) =>
      (prev - 1 + Math.max(lightboxItems.length, 1)) % Math.max(lightboxItems.length, 1)
    );
  }, [lightboxItems.length]);

  useEffect(() => {
    const cleanups: Array<() => void> = [];

    // ========================================================================
    // 1. MORTGAGE CALCULATOR ENGINE (#tinh-vay / .tlc)
    // ========================================================================
    const tlcRoot = document.querySelector('.tlc') as HTMLElement | null;
    if (tlcRoot) {
      const isNavyTheme =
        tlcRoot.innerHTML.includes('#F3E2B3') ||
        window.location.pathname.includes('beverly');
      const colorPrincipal = isNavyTheme ? '#F3E2B3' : '#F7D8CD';
      const colorInterest = isNavyTheme ? '#D9B86A' : '#E3B873';

      const $ = (id: string) =>
        document.getElementById(`tlc-${id}`) as HTMLInputElement | HTMLElement | null;
      let mode = 'dec';

      const formatVnd = (v: number) => {
        const a = Math.abs(v);
        if (a >= 1e9) {
          return (
            (v / 1e9).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' tỷ'
          );
        }
        return (
          (v / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' triệu'
        );
      };

      const fillSlider = (el: HTMLInputElement | null) => {
        if (!el) return;
        const min = parseFloat(el.min) || 0;
        const max = parseFloat(el.max) || 100;
        const val = parseFloat(el.value) || 0;
        const p = ((val - min) / (max - min)) * 100;
        el.style.setProperty('--p', `${p}%`);
      };

      const runCalc = () => {
        const pEl = $('P') as HTMLInputElement | null;
        const lEl = $('L') as HTMLInputElement | null;
        const nEl = $('N') as HTMLInputElement | null;
        const sEl = $('S') as HTMLInputElement | null;
        const rEl = $('R') as HTMLInputElement | null;
        const gEl = $('G') as HTMLInputElement | null;
        if (!pEl || !lEl || !nEl || !sEl || !rEl || !gEl) return;

        const P = parseFloat(pEl.value) * 1e9;
        const L = parseFloat(lEl.value) / 100;
        const N = parseFloat(nEl.value) * 12;
        const S = Math.min(parseFloat(sEl.value), N - 1);
        const R = parseFloat(rEl.value) / 100 / 12;
        const G = gEl.checked;

        [pEl, lEl, nEl, sEl, rEl].forEach(fillSlider);

        const vP = $('vP');
        const vL = $('vL');
        const vN = $('vN');
        const vS = $('vS');
        const vR = $('vR');
        if (vP) vP.textContent = parseFloat(pEl.value).toLocaleString('vi-VN') + ' tỷ';
        if (vL) vL.textContent = lEl.value + '%';
        if (vN) vN.textContent = nEl.value + ' năm';
        if (vS)
          vS.textContent = parseFloat(sEl.value) ? sEl.value + ' tháng' : 'Không';
        if (vR)
          vR.textContent = parseFloat(rEl.value).toLocaleString('vi-VN') + '%/năm';

        const V = P * L;
        let bal = V;
        let ti = 0;
        const yr: Array<{ y: number; g: number; l: number; n: number; b: number }> =
          [];
        let cy = { g: 0, l: 0 };
        let pay1 = 0;
        let payS = 0;
        let ann = 0;
        let gd = 0;
        const M = N - S;

        for (let k = 1; k <= N; k++) {
          let l = 0;
          let g = 0;
          if (k <= S) {
            l = 0;
            g = G ? 0 : V / N;
          } else {
            l = bal * R;
            if (k === S + 1) {
              ann = R > 0 ? (bal * R) / (1 - Math.pow(1 + R, -M)) : bal / M;
              gd = bal / M;
            }
            g = mode === 'ann' ? ann - l : gd;
          }
          if (g > bal) g = bal;
          bal -= g;
          ti += l;
          cy.g += g;
          cy.l += l;
          if (k === 1) payS = g + l;
          if (k === S + 1) pay1 = g + l;
          if (k % 12 === 0 || k === N) {
            yr.push({
              y: Math.ceil(k / 12),
              g: cy.g,
              l: cy.l,
              n: k % 12 || 12,
              b: Math.max(bal, 0),
            });
            cy = { g: 0, l: 0 };
          }
        }

        if (S === 0) payS = pay1;
        const o1t = $('o1t');
        const o1 = $('o1');
        const o1s = $('o1s');
        const o2 = $('o2');
        const o3 = $('o3');
        const o4 = $('o4');
        const o5 = $('o5');
        const o6 = $('o6');
        const o7 = $('o7');

        if (o1t)
          o1t.textContent = S
            ? 'Trả hàng tháng sau khi hết hỗ trợ'
            : 'Trả hàng tháng';
        if (o1) o1.textContent = V ? formatVnd(pay1) + '/tháng' : '0';
        if (o1s) {
          o1s.textContent = V
            ? mode === 'dec'
              ? S
                ? 'Tháng đầu sau hỗ trợ, giảm dần về sau'
                : 'Tháng đầu, giảm dần về sau'
              : S
              ? 'Cố định mỗi tháng sau hỗ trợ'
              : 'Cố định mỗi tháng'
            : 'Anh/chị đang chọn không vay';
        }
        if (o2) o2.textContent = formatVnd(P - V);
        if (o3) o3.textContent = formatVnd(V);
        if (o4)
          o4.textContent = S
            ? payS < 1
              ? '0 đồng'
              : formatVnd(payS) + '/tháng'
            : '—';
        if (o5) o5.textContent = formatVnd(ti);
        if (o6) o6.textContent = formatVnd(V + ti);
        if (o7) o7.textContent = V ? 'từ ' + formatVnd(pay1 * 2) + '/tháng' : '—';

        const tbd = $('tbd');
        if (tbd) {
          let tb = '';
          yr.forEach((o) => {
            tb += `<tr${o.y * 12 <= S ? ' class="sp"' : ''}><td>Năm ${
              o.y
            }</td><td>${formatVnd(o.g)}</td><td>${formatVnd(
              o.l
            )}</td><td>${formatVnd((o.g + o.l) / o.n)}</td><td>${formatVnd(
              o.b
            )}</td></tr>`;
          });
          tbd.innerHTML = tb;
        }

        const svg = $('svg');
        if (svg) {
          let mx = 1;
          yr.forEach((o) => {
            mx = Math.max(mx, o.g + o.l);
          });
          const w = 400 / yr.length;
          let s = '';
          yr.forEach((o, i) => {
            const hg = (o.g / mx) * 120;
            const hl = (o.l / mx) * 120;
            const x = i * w + w * 0.15;
            const bw = w * 0.7;
            if (o.g + o.l === 0 && V > 0) {
              // [BUG-04 Fix] Render subtle dashed indicator bar during 0% HTLS + grace period
              s += `<rect x="${x}" y="114" width="${bw}" height="16" rx="1.5" fill="rgba(227,184,115,0.14)" stroke="${colorInterest}" stroke-width="0.8" stroke-dasharray="2,2"><title>Năm ${o.y}: Hỗ trợ lãi suất 0% + Ân hạn nợ gốc (0đ/tháng)</title></rect>`;
            } else {
              s += `<rect x="${x}" y="${
                130 - hg
              }" width="${bw}" height="${hg}" rx="1.5" fill="${colorPrincipal}"/><rect x="${x}" y="${
                130 - hg - hl
              }" width="${bw}" height="${hl}" rx="1.5" fill="${colorInterest}"/>`;
            }
            if (o.y === 1 || o.y % 5 === 0) {
              s += `<text x="${
                x + bw / 2
              }" y="146" fill="#8FA9A5" font-size="9" text-anchor="middle">N${
                o.y
              }</text>`;
            }
          });
          s += `<line x1="0" y1="130.5" x2="400" y2="130.5" stroke="rgba(255,255,255,.2)"/>`;
          svg.innerHTML = s;
        }
      };

      const inputs = Array.from(tlcRoot.querySelectorAll('input'));
      inputs.forEach((inp) => inp.addEventListener('input', runCalc));

      const segBtns = Array.from(
        tlcRoot.querySelectorAll('.tlc-seg button')
      ) as HTMLButtonElement[];
      const handleSegClick = (btn: HTMLButtonElement) => () => {
        segBtns.forEach((b) => b.classList.remove('on'));
        btn.classList.add('on');
        mode = btn.dataset.m || 'dec';
        runCalc();
      };
      const segListeners = segBtns.map((btn) => {
        const fn = handleSegClick(btn);
        btn.addEventListener('click', fn);
        return { btn, fn };
      });

      runCalc();

      cleanups.push(() => {
        inputs.forEach((inp) => inp.removeEventListener('input', runCalc));
        segListeners.forEach(({ btn, fn }) => btn.removeEventListener('click', fn));
      });
    }

    // ========================================================================
    // 2. KY HOA (.kh) SCROLLSPY, ZOOM LIGHTBOX & REDUCED-MOTION VIDEO
    // ========================================================================
    const khRoot = document.querySelector('.kh');
    if (khRoot) {
      const tabs = Array.from(
        document.querySelectorAll('.kh-tabs a')
      ) as HTMLAnchorElement[];
      const activateTab = (id: string) => {
        tabs.forEach((a) => a.classList.toggle('on', a.dataset.t === id));
      };
      if ('IntersectionObserver' in window && tabs.length > 0) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.target.id) {
                activateTab(entry.target.id);
              }
            });
          },
          { rootMargin: '-40% 0px -50% 0px' }
        );
        ['vi-tri', 'tong-quan', 'tien-ich', 'lien-he'].forEach((id) => {
          const el = document.getElementById(id);
          if (el) io.observe(el);
        });
        cleanups.push(() => io.disconnect());
      }

      const khLb = document.getElementById('khLb');
      const handleKhClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target || !khLb) return;
        if (target.classList && target.classList.contains('kh-zoom')) {
          const imgEl = target as HTMLImageElement;
          const lbImg = khLb.querySelector('img');
          if (lbImg) {
            lbImg.src = imgEl.currentSrc || imgEl.src;
            lbImg.alt = imgEl.alt || 'Phóng to hình ảnh dự án Vinhomes Kỳ Hòa';
          }
          khLb.classList.add('on');
        } else if (khLb.contains(target)) {
          khLb.classList.remove('on');
        }
      };
      document.addEventListener('click', handleKhClick);
      cleanups.push(() => document.removeEventListener('click', handleKhClick));

      const video = document.querySelector(
        '.kh-hero video'
      ) as HTMLVideoElement | null;
      if (
        video &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        video.removeAttribute('autoplay');
        video.pause();
      }
    }

    // ========================================================================
    // 3. SWIPER IMAGE CAROUSELS (.elementor-image-carousel-wrapper.swiper)
    // ========================================================================
    const swiperWrappers = Array.from(
      document.querySelectorAll('.elementor-image-carousel-wrapper.swiper')
    ) as HTMLElement[];

    swiperWrappers.forEach((swiperEl) => {
      const track = swiperEl.querySelector('.swiper-wrapper') as HTMLElement | null;
      const slides = Array.from(
        swiperEl.querySelectorAll('.swiper-slide')
      ) as HTMLElement[];
      const pagination = swiperEl.querySelector(
        '.swiper-pagination'
      ) as HTMLElement | null;

      if (!track || slides.length <= 1) return;

      swiperEl.style.overflow = 'hidden';
      swiperEl.style.position = 'relative';
      track.style.display = 'flex';
      track.style.transition = 'transform 500ms cubic-bezier(0.25, 1, 0.5, 1)';
      track.style.width = '100%';

      slides.forEach((slide) => {
        slide.style.flex = '0 0 100%';
        slide.style.maxWidth = '100%';
      });

      let currentIdx = 0;
      const bullets: HTMLSpanElement[] = [];

      const goToSlide = (idx: number) => {
        currentIdx = (idx + slides.length) % slides.length;
        track.style.transform = `translate3d(-${currentIdx * 100}%, 0, 0)`;
        bullets.forEach((b, i) => {
          b.classList.toggle('swiper-pagination-bullet-active', i === currentIdx);
          b.style.opacity = i === currentIdx ? '1' : '0.35';
          b.style.background = i === currentIdx ? '#E3B873' : '#FFFFFF';
        });
      };

      if (pagination) {
        pagination.innerHTML = '';
        pagination.style.display = 'flex';
        pagination.style.justifyContent = 'center';
        pagination.style.gap = '8px';
        pagination.style.marginTop = '12px';
        pagination.style.position = 'relative';
        pagination.style.zIndex = '10';

        slides.forEach((_, idx) => {
          const dot = document.createElement('span');
          dot.className =
            'swiper-pagination-bullet' +
            (idx === 0 ? ' swiper-pagination-bullet-active' : '');
          dot.style.width = '10px';
          dot.style.height = '10px';
          dot.style.borderRadius = '50%';
          dot.style.cursor = 'pointer';
          dot.style.display = 'inline-block';
          dot.style.transition = 'all 0.25s ease';
          dot.style.background = idx === 0 ? '#E3B873' : '#FFFFFF';
          dot.style.opacity = idx === 0 ? '1' : '0.35';
          dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goToSlide(idx);
          });
          pagination.appendChild(dot);
          bullets.push(dot);
        });
      }

      // Touch swipe support
      let startX = 0;
      const onTouchStart = (e: TouchEvent) => {
        startX = e.touches[0].clientX;
      };
      const onTouchEnd = (e: TouchEvent) => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 40) {
          goToSlide(diff < 0 ? currentIdx + 1 : currentIdx - 1);
        }
      };
      swiperEl.addEventListener('touchstart', onTouchStart, { passive: true });
      swiperEl.addEventListener('touchend', onTouchEnd, { passive: true });

      // Autoplay 5000ms with pause on hover
      let paused = false;
      const onMouseEnter = () => {
        paused = true;
      };
      const onMouseLeave = () => {
        paused = false;
      };
      swiperEl.addEventListener('mouseenter', onMouseEnter);
      swiperEl.addEventListener('mouseleave', onMouseLeave);

      const timer = window.setInterval(() => {
        if (!paused) {
          goToSlide(currentIdx + 1);
        }
      }, 5000);

      cleanups.push(() => {
        window.clearInterval(timer);
        swiperEl.removeEventListener('touchstart', onTouchStart);
        swiperEl.removeEventListener('touchend', onTouchEnd);
        swiperEl.removeEventListener('mouseenter', onMouseEnter);
        swiperEl.removeEventListener('mouseleave', onMouseLeave);
      });
    });

    // ========================================================================
    // 4. ELEMENTOR LIGHTBOX LINKS (data-elementor-open-lightbox="yes")
    // ========================================================================
    const lbLinks = Array.from(
      document.querySelectorAll('a[data-elementor-open-lightbox="yes"]')
    ) as HTMLAnchorElement[];

    if (lbLinks.length > 0) {
      const allItems: LightboxItem[] = lbLinks.map((a) => {
        const img = a.querySelector('img');
        return {
          src: a.getAttribute('href') || img?.src || '',
          title:
            a.getAttribute('data-elementor-lightbox-title') ||
            img?.alt ||
            'Hình ảnh dự án Vinhomes',
          slideshow: a.getAttribute('data-elementor-lightbox-slideshow') || undefined,
        };
      });

      const handleLbClick = (idx: number) => (e: MouseEvent) => {
        e.preventDefault();
        setLightboxItems(allItems);
        setLightboxIndex(idx);
        setZoomed(false);
        setLightboxOpen(true);
      };

      const lbListeners = lbLinks.map((a, idx) => {
        const fn = handleLbClick(idx);
        a.addEventListener('click', fn);
        return { a, fn };
      });

      cleanups.push(() => {
        lbListeners.forEach(({ a, fn }) => a.removeEventListener('click', fn));
      });
    }

    // ========================================================================
    // 5. STICKY HEADER & MOBILE MENU TOGGLE (.elementor-menu-toggle)
    // ========================================================================
    const stickyHeader = document.querySelector(
      '[data-id="d5dc588"]'
    ) as HTMLElement | null;
    if (stickyHeader) {
      stickyHeader.style.position = 'sticky';
      stickyHeader.style.top = '0';
      stickyHeader.style.zIndex = '999';
    }

    const menuToggle = document.querySelector(
      '.elementor-menu-toggle'
    ) as HTMLElement | null;
    const dropdownMenu = document.querySelector(
      '.elementor-nav-menu--dropdown'
    ) as HTMLElement | null;

    if (menuToggle && dropdownMenu) {
      const handleMenuToggle = () => {
        const isActive = menuToggle.classList.toggle('elementor-active');
        menuToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        dropdownMenu.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        if (isActive) {
          dropdownMenu.style.display = 'block';
          dropdownMenu.style.transform = 'scaleY(1)';
          dropdownMenu.style.maxHeight = '500px';
        } else {
          dropdownMenu.style.transform = 'scaleY(0)';
          dropdownMenu.style.maxHeight = '0px';
        }
      };
      menuToggle.addEventListener('click', handleMenuToggle);

      // Close mobile menu when clicking an anchor link
      const navLinks = Array.from(dropdownMenu.querySelectorAll('a'));
      const closeMenu = () => {
        menuToggle.classList.remove('elementor-active');
        menuToggle.setAttribute('aria-expanded', 'false');
        dropdownMenu.setAttribute('aria-hidden', 'true');
        dropdownMenu.style.transform = 'scaleY(0)';
        dropdownMenu.style.maxHeight = '0px';
      };
      navLinks.forEach((l) => l.addEventListener('click', closeMenu));

      cleanups.push(() => {
        menuToggle.removeEventListener('click', handleMenuToggle);
        navLinks.forEach((l) => l.removeEventListener('click', closeMenu));
      });
    }

    // ========================================================================
    // 6. ENTERPRISE LEAD CAPTURE FORM HANDLER (form.elementor-form)
    // ========================================================================
    const forms = Array.from(
      document.querySelectorAll('form.elementor-form')
    ) as HTMLFormElement[];

    const handleFormSubmit = (form: HTMLFormElement) => async (e: Event) => {
      e.preventDefault();
      const submitBtn = form.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement | null;
      const btnTextEl = form.querySelector(
        '.elementor-button-text'
      ) as HTMLElement | null;
      const originalBtnText = btnTextEl?.textContent || 'GỬI THÔNG TIN';

      const formData = new FormData(form);
      const name = String(formData.get('form_fields[name]') || '').trim();
      const phone = String(formData.get('form_fields[phone]') || '').trim();
      const email = String(formData.get('form_fields[email]') || '').trim();
      const message = String(formData.get('form_fields[message]') || '').trim();
      const duAn =
        String(formData.get('form_fields[du_an]') || '').trim() ||
        (window.location.pathname.includes('beverly')
          ? 'Shop Khối Đế The Beverly'
          : window.location.pathname.includes('kyhoa')
          ? 'Vinhomes Kỳ Hòa'
          : 'Vinhomes Saigon Park');
      const websiteUrl = String(formData.get('website_url') || '').trim();

      // Remove any old status message
      const existingMsg = form.querySelector('.pt-form-feedback');
      if (existingMsg) existingMsg.remove();

      const showFeedback = (type: 'success' | 'error', text: string) => {
        const div = document.createElement('div');
        div.className = 'pt-form-feedback';
        div.style.marginTop = '14px';
        div.style.padding = '14px 18px';
        div.style.borderRadius = '12px';
        div.style.fontSize = '14.5px';
        div.style.fontWeight = '600';
        div.style.lineHeight = '1.5';
        if (type === 'success') {
          div.style.background = 'rgba(16, 185, 129, 0.16)';
          div.style.border = '1px solid #10b981';
          div.style.color = '#ecfdf5';
        } else {
          div.style.background = 'rgba(239, 68, 68, 0.16)';
          div.style.border = '1px solid #ef4444';
          div.style.color = '#fef2f2';
        }
        div.innerHTML = text;
        form.appendChild(div);
      };

      // Validate Vietnamese Phone Number
      const cleanPhone = phone.replace(/[\s.\-()]/g, '');
      const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
      if (!vnPhoneRegex.test(cleanPhone)) {
        showFeedback(
          'error',
          `⚠️ Số điện thoại <strong>${phone}</strong> chưa đúng định dạng di động Việt Nam (10 số). Quý khách vui lòng kiểm tra lại hoặc liên hệ trực tiếp Hotline/Zalo <strong>${SITE_CONFIG.agent.phoneFormatted}</strong>.`
        );
        return;
      }

      if (submitBtn) submitBtn.disabled = true;
      if (btnTextEl) btnTextEl.textContent = 'ĐANG GỬI YÊU CẦU...';

      try {
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = `lead-${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 8)}`;

        const res = await fetch('/api/leads/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone: cleanPhone,
            email,
            message,
            du_an: duAn,
            post_id: formData.get('post_id') || '',
            form_id: formData.get('form_id') || '',
            page_source_url: window.location.href,
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            fbclid: urlParams.get('fbclid') || '',
            gclid: urlParams.get('gclid') || '',
            website_url: websiteUrl,
            event_id: eventId,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || 'Có lỗi xảy ra khi gửi thông tin.');
        }

        // Dispatch deduplicated Server-Side CAPI Lead Event
        fetch('/api/capi/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_name: 'Lead',
            event_id: eventId,
            event_source_url: window.location.href,
            user_data: {
              phone: cleanPhone,
              email,
              name,
            },
            custom_data: {
              content_name: duAn,
              lead_id: data.leadId,
            },
          }),
        }).catch(() => {});

        form.reset();
        showFeedback(
          'success',
          `✅ <strong>Đăng ký thành công (Mã hồ sơ: #${data.leadId})!</strong><br/>Cảm ơn anh/chị <strong>${name}</strong>. <strong>${SITE_CONFIG.agent.name}</strong> – PKD trực tiếp CĐT Vinhomes đã nhận được yêu cầu về dự án <strong>${duAn}</strong> và sẽ gửi bảng giá chi tiết qua Zalo <strong>${cleanPhone}</strong> trong ít phút!`
        );
      } catch (err: unknown) {
        const msg =
          err instanceof Error ? err.message : 'Không thể kết nối máy chủ.';
        showFeedback(
          'error',
          `⚠️ ${msg} Quý khách có thể gọi trực tiếp hoặc nhắn Zalo cho Phước Trí qua số <a href="https://zalo.me/${SITE_CONFIG.agent.phoneRaw}" style="color:#E3B873;text-decoration:underline">${SITE_CONFIG.agent.phoneFormatted}</a>.`
        );
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (btnTextEl) btnTextEl.textContent = originalBtnText;
      }
    };

    const formListeners = forms.map((form) => {
      const fn = handleFormSubmit(form);
      form.addEventListener('submit', fn);
      return { form, fn };
    });

    cleanups.push(() => {
      formListeners.forEach(({ form, fn }) =>
        form.removeEventListener('submit', fn)
      );
    });

    return () => {
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen, closeLightbox, nextSlide, prevSlide]);

  if (!lightboxOpen || lightboxItems.length === 0) return null;
  const activeItem = lightboxItems[lightboxIndex] || lightboxItems[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={activeItem.title}
      onClick={closeLightbox}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999999,
        background: 'rgba(6, 12, 18, 0.94)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '16px',
        userSelect: 'none',
      }}
    >
      {/* Top Toolbar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#E8F0EF',
          padding: '8px 16px',
          fontFamily: 'Montserrat, sans-serif',
          fontSize: '14px',
        }}
      >
        <span>
          <strong>{lightboxIndex + 1}</strong> / {lightboxItems.length} ·{' '}
          {activeItem.title}
        </span>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            {zoomed ? '🔍 Thu nhỏ (1x)' : '🔍 Phóng to (2x)'}
          </button>
          <a
            href={activeItem.src}
            download
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'rgba(227,184,115,0.2)',
              border: '1px solid #E3B873',
              color: '#E3B873',
              padding: '6px 12px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            ⬇ Tải ảnh gốc
          </a>
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Đóng"
            style={{
              background: '#940401',
              border: 'none',
              color: '#fff',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'auto',
        }}
      >
        {lightboxItems.length > 1 && (
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Ảnh trước"
            style={{
              position: 'absolute',
              left: '16px',
              zIndex: 10,
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(227,184,115,0.5)',
              color: '#E3B873',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            ‹
          </button>
        )}

        <img
          src={activeItem.src}
          alt={activeItem.title}
          onClick={() => setZoomed((z) => !z)}
          style={{
            maxHeight: zoomed ? 'none' : '82vh',
            maxWidth: zoomed ? 'none' : '92vw',
            width: zoomed ? '1650px' : 'auto',
            borderRadius: '8px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            cursor: zoomed ? 'zoom-out' : 'zoom-in',
            transition: 'transform 0.25s ease',
          }}
        />

        {lightboxItems.length > 1 && (
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Ảnh tiếp theo"
            style={{
              position: 'absolute',
              right: '16px',
              zIndex: 10,
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(227,184,115,0.5)',
              color: '#E3B873',
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '20px',
            }}
          >
            ›
          </button>
        )}
      </div>

      {/* Caption Footer */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          textAlign: 'center',
          color: '#CFE0DD',
          fontSize: '13.5px',
          padding: '8px',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        {activeItem.title} — <strong>Phước Trí Vinhomes ({SITE_CONFIG.agent.phoneFormatted})</strong>
      </div>
    </div>
  );
}
