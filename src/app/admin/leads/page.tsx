'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SITE_CONFIG } from '@/config/site';

interface LeadRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  du_an: string;
  page_source_url: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  ip_address: string;
  created_at_datetime: string;
  status: string;
}

export default function AdminLeadsDashboard() {
  const [adminKey, setAdminKey] = useState('phuoctri-admin-2026');
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [projectFilter, setProjectFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeads = async (keyToUse: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `/api/leads/?key=${encodeURIComponent(keyToUse)}`
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Không thể tải danh sách khách hàng.');
      }
      setLeads(data.leads || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Lỗi kết nối.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(adminKey);
  }, []);

  const filteredLeads = leads.filter((l) => {
    const matchesProject =
      projectFilter === 'ALL' ||
      l.du_an.toLowerCase().includes(projectFilter.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  });

  const exportCsv = () => {
    const headers = [
      'Mã Lead',
      'Thời gian (GMT+7)',
      'Họ và tên',
      'Số điện thoại',
      'Email',
      'Dự án quan tâm',
      'Yêu cầu chi tiết',
      'UTM Source',
      'UTM Campaign',
      'IP Khách hàng',
      'URL Nguồn',
    ];
    const rows = filteredLeads.map((l) => [
      l.id,
      l.created_at_datetime,
      `"${l.name.replace(/"/g, '""')}"`,
      `'${l.phone}`,
      l.email,
      `"${l.du_an}"`,
      `"${l.message.replace(/"/g, '""')}"`,
      l.utm_source,
      l.utm_campaign,
      l.ip_address,
      `"${l.page_source_url}"`,
    ]);
    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phuoctri-vinhomes-leads-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#081218',
        color: '#E6EDF3',
        fontFamily: 'Montserrat, system-ui, sans-serif',
        padding: '32px 20px 80px',
      }}
    >
      <div style={{ maxWidth: '1260px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            paddingBottom: '24px',
            borderBottom: '1px solid rgba(227,184,115,0.25)',
            marginBottom: '28px',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '11px',
                letterSpacing: '0.18em',
                color: '#E3B873',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              HỆ THỐNG CRM NỘI BỘ (THAY THẾ TABLESOME AN TOÀN 100%)
            </span>
            <h1 style={{ margin: '6px 0 0', fontSize: '26px', color: '#fff' }}>
              📊 Quản Trị Khách Hàng (Leads) – {SITE_CONFIG.siteName}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              href="/"
              style={{
                padding: '10px 16px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                textDecoration: 'none',
                fontSize: '13.5px',
                fontWeight: 600,
              }}
            >
              ← Về Trang chủ
            </Link>
            <button
              type="button"
              onClick={exportCsv}
              style={{
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                background: '#E3B873',
                color: '#05332F',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
              }}
            >
              ⬇️ Xuất File Excel (.CSV)
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              background: '#111D26',
              border: '1px solid rgba(227,184,115,0.25)',
              borderRadius: '14px',
              padding: '18px 20px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#8FA9A5' }}>
              TỔNG SỐ LEAD THU THẬP
            </div>
            <div
              style={{
                fontSize: '30px',
                fontWeight: 800,
                color: '#E3B873',
                marginTop: '4px',
              }}
            >
              {leads.length}
            </div>
          </div>
          <div
            style={{
              background: '#111D26',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '18px 20px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#8FA9A5' }}>
              VINHOMES SAIGON PARK (HÓC MÔN)
            </div>
            <div
              style={{
                fontSize: '30px',
                fontWeight: 800,
                color: '#F7D8CD',
                marginTop: '4px',
              }}
            >
              {
                leads.filter((l) =>
                  l.du_an.toLowerCase().includes('saigon park')
                ).length
              }
            </div>
          </div>
          <div
            style={{
              background: '#111D26',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '18px 20px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#8FA9A5' }}>
              SHOP KHỐI ĐẾ THE BEVERLY
            </div>
            <div
              style={{
                fontSize: '30px',
                fontWeight: 800,
                color: '#F3E2B3',
                marginTop: '4px',
              }}
            >
              {
                leads.filter((l) => l.du_an.toLowerCase().includes('beverly'))
                  .length
              }
            </div>
          </div>
          <div
            style={{
              background: '#111D26',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '18px 20px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#8FA9A5' }}>
              VINHOMES KỲ HÒA QUẬN 10
            </div>
            <div
              style={{
                fontSize: '30px',
                fontWeight: 800,
                color: '#C9A96E',
                marginTop: '4px',
              }}
            >
              {
                leads.filter((l) => l.du_an.toLowerCase().includes('kỳ hòa'))
                  .length
              }
            </div>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '20px',
            background: '#111D26',
            padding: '16px',
            borderRadius: '14px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#081218',
              color: '#fff',
              border: '1px solid rgba(227,184,115,0.35)',
              fontSize: '14px',
            }}
          >
            <option value="ALL">Tất cả dự án ({leads.length})</option>
            <option value="Saigon Park">Vinhomes Saigon Park</option>
            <option value="Beverly">Shop The Beverly</option>
            <option value="Kỳ Hòa">Vinhomes Kỳ Hòa</option>
          </select>

          <input
            type="text"
            placeholder="Tìm theo tên, số điện thoại, nội dung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#081218',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.18)',
              fontSize: '14px',
            }}
          />

          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Admin Key"
            style={{
              width: '180px',
              padding: '10px 14px',
              borderRadius: '8px',
              background: '#081218',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.18)',
              fontSize: '13px',
            }}
          />
          <button
            type="button"
            onClick={() => fetchLeads(adminKey)}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              background: '#0E403C',
              color: '#fff',
              border: '1px solid #E3B873',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13.5px',
            }}
          >
            🔄 Làm mới
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '14px 18px',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid #ef4444',
              borderRadius: '10px',
              marginBottom: '20px',
              color: '#fecaca',
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Leads Table */}
        <div
          style={{
            overflowX: 'auto',
            background: '#111D26',
            borderRadius: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '13.5px',
            }}
          >
            <thead>
              <tr
                style={{
                  background: 'rgba(227,184,115,0.12)',
                  color: '#E3B873',
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '14px' }}>Mã / Thời gian</th>
                <th style={{ padding: '14px' }}>Khách hàng</th>
                <th style={{ padding: '14px' }}>Số điện thoại / Zalo</th>
                <th style={{ padding: '14px' }}>Dự án</th>
                <th style={{ padding: '14px' }}>Nhu cầu chi tiết</th>
                <th style={{ padding: '14px' }}>Nguồn (Smart Fields)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ padding: '32px', textAlign: 'center' }}
                  >
                    Đang tải dữ liệu CRM...
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    style={{ padding: '32px', textAlign: 'center' }}
                  >
                    Không có khách hàng nào khớp bộ lọc.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    style={{
                      borderTop: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <strong style={{ color: '#F7D8CD', display: 'block' }}>
                        {lead.id}
                      </strong>
                      <span style={{ fontSize: '12px', color: '#8FA9A5' }}>
                        {lead.created_at_datetime}
                      </span>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <strong style={{ color: '#fff', display: 'block' }}>
                        {lead.name}
                      </strong>
                      <span style={{ fontSize: '12px', color: '#8FA9A5' }}>
                        {lead.email || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                      <a
                        href={`tel:${lead.phone}`}
                        style={{
                          color: '#E3B873',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'block',
                        }}
                      >
                        📞 {lead.phone}
                      </a>
                      <a
                        href={`https://zalo.me/${lead.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '12px',
                          color: '#38bdf8',
                          textDecoration: 'none',
                        }}
                      >
                        💬 Mở Zalo khách
                      </a>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          background: 'rgba(227,184,115,0.16)',
                          color: '#E3B873',
                          fontWeight: 700,
                          fontSize: '12px',
                        }}
                      >
                        {lead.du_an}
                      </span>
                    </td>
                    <td style={{ padding: '14px', maxWidth: '320px' }}>
                      {lead.message || 'Đăng ký nhận bảng giá & mặt bằng'}
                    </td>
                    <td style={{ padding: '14px', fontSize: '12px', color: '#8FA9A5' }}>
                      <div>
                        UTM:{' '}
                        <strong style={{ color: '#DCE7E5' }}>
                          {lead.utm_source || 'direct'} /{' '}
                          {lead.utm_medium || 'none'}
                        </strong>
                      </div>
                      <div>IP: {lead.ip_address}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
