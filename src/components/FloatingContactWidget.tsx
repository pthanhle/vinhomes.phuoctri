'use client';

import React from 'react';
import { SITE_CONFIG } from '@/config/site';

export default function FloatingContactWidget() {
  const trackHighIntentClick = (channel: 'hotline' | 'zalo') => {
    const eventId = `contact-${channel}-${Date.now()}`;
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const payload = JSON.stringify({
        event_name: 'Contact',
        event_id: eventId,
        event_source_url: window.location.href,
        custom_data: {
          contact_channel: channel,
          agent: SITE_CONFIG.agent.name,
          phone: SITE_CONFIG.agent.phoneRaw,
        },
      });
      navigator.sendBeacon(
        '/api/capi/',
        new Blob([payload], { type: 'application/json' })
      );
    }
  };

  return (
    <>
      <style>{`
        :root {
          --tb-contact-primary: #76a713;
          --tb-contact-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .tb-floating-contact {
          --tb-contact-primary: #76a713;
          position: fixed;
          bottom: 30px;
          right: 20px;
          z-index: 999999 !important;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.4;
          -webkit-font-smoothing: antialiased;
        }
        .tb-contact-btn {
          display: block;
          width: 55px;
          height: 55px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          position: relative;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .tb-contact-btn img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 50%;
          display: block;
          padding: 12px;
          box-sizing: border-box;
        }
        .tb-contact-btn:hover { transform: scale(1.1); }
        .tb-contact-tooltip {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 65px;
          background: #1e293b;
          color: #fff;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          pointer-events: none;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .tb-contact-btn:hover .tb-contact-tooltip {
          opacity: 1;
          visibility: visible;
          right: 72px;
        }
        @keyframes phone-vr-circle-fill {
          0% { transform: rotate(0) scale(0.7); opacity: 0.6; }
          50% { transform: rotate(0) scale(1); opacity: 0.15; }
          100% { transform: rotate(0) scale(0.7); opacity: 0.6; }
        }
        @keyframes zoom {
          0% { transform: scale(0.9); }
          70% { transform: scale(1); box-shadow: 0 0 0 15px transparent; }
          100% { transform: scale(0.9); box-shadow: 0 0 0 0 transparent; }
        }
        .tb-contact-btn.tb-shake-anim {
          position: relative;
          animation: zoom 1.3s infinite;
        }
        .tb-contact-btn.tb-shake-anim::after {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          width: 65px;
          height: 65px;
          border-radius: 50%;
          border: 2px solid transparent;
          background-color: inherit;
          opacity: 0.6;
          animation: phone-vr-circle-fill 2.3s infinite ease-in-out;
          z-index: -1;
        }
        .tb-contact-btn.tb-shake-anim:hover,
        .tb-contact-btn.tb-shake-anim:hover::after {
          animation-play-state: paused;
        }
        @media (max-width: 768px) {
          .tb-floating-contact { bottom: 60px; right: 15px; }
        }
      `}</style>
      <div className="tb-floating-contact" aria-label="Liên hệ nhanh Phước Trí Vinhomes">
        <a
          href={`tel:${SITE_CONFIG.agent.phoneRaw}`}
          onClick={() => trackHighIntentClick('hotline')}
          className="tb-contact-btn tb-contact-phone tb-shake-anim"
          style={{ backgroundColor: '#f0ac1a' }}
          rel="nofollow noopener"
          aria-label={`Gọi Hotline ${SITE_CONFIG.agent.phoneFormatted}`}
        >
          <img src="/uploads/2026/05/icon.svg-93.svg" alt="Hotline Phước Trí" width={55} height={55} />
          <span className="tb-contact-tooltip">Hotline: {SITE_CONFIG.agent.phoneFormatted}</span>
        </a>
        <a
          href={SITE_CONFIG.agent.zaloUrl}
          onClick={() => trackHighIntentClick('zalo')}
          className="tb-contact-btn tb-contact-zalo tb-shake-anim"
          style={{ backgroundColor: '#f0ac1a' }}
          target="_blank"
          rel="nofollow noopener noreferrer"
          aria-label="Chat Zalo Phước Trí Vinhomes"
        >
          <img src="/uploads/2026/05/zalo-2.svg" alt="Chat Zalo Phước Trí" width={55} height={55} />
          <span className="tb-contact-tooltip">Chat Zalo Phước Trí</span>
        </a>
      </div>
    </>
  );
}
