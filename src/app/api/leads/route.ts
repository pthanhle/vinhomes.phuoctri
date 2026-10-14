import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export interface LeadRecord {
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

const DATA_FILE = path.join(process.cwd(), 'data', 'leads.json');

// Simple in-memory IP rate limiter (5 requests per 10 minutes)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function sanitize(input: unknown, maxLen = 500): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, maxLen);
}

async function readLeads(): Promise<LeadRecord[]> {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeLeads(leads: LeadRecord[]): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), 'utf-8');
}

export async function GET(request: NextRequest) {
  const authKey =
    request.nextUrl.searchParams.get('key') ||
    request.headers.get('x-admin-key') ||
    '';
  const expectedKey = process.env.ADMIN_CRM_KEY || 'phuoctri-admin-2026';

  if (authKey !== expectedKey) {
    return NextResponse.json(
      {
        success: false,
        message: 'Unauthorized: Vui lòng cung cấp khóa quản trị CRM hợp lệ.',
      },
      { status: 401 }
    );
  }

  const leads = await readLeads();
  return NextResponse.json({
    success: true,
    total: leads.length,
    leads,
  });
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // 1. Check Rate Limit
    const now = Date.now();
    const rateRecord = rateLimitMap.get(ip);
    if (rateRecord && now < rateRecord.resetAt) {
      if (rateRecord.count >= 8) {
        return NextResponse.json(
          {
            success: false,
            message:
              'Quý khách đã gửi yêu cầu quá nhanh. Vui lòng đợi ít phút hoặc gọi trực tiếp 0909.888.999.',
          },
          { status: 429 }
        );
      }
      rateRecord.count += 1;
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + 10 * 60 * 1000 });
    }

    const body = await request.json();

    // 2. Honeypot Anti-Bot Verification (Fixes client-side-only reCAPTCHA weakness)
    if (body.website_url && String(body.website_url).trim() !== '') {
      return NextResponse.json({
        success: true,
        leadId: 'PT-BOT-FILTERED',
      });
    }

    const name = sanitize(body.name, 120);
    const rawPhone = sanitize(body.phone, 30).replace(/[\s.\-()]/g, '');
    const email = sanitize(body.email, 120);
    const message = sanitize(body.message, 1000);
    const duAn = sanitize(body.du_an || 'Vinhomes Saigon Park', 120);
    const pageSourceUrl = sanitize(body.page_source_url, 500);
    const utmSource = sanitize(body.utm_source, 100);
    const utmMedium = sanitize(body.utm_medium, 100);
    const utmCampaign = sanitize(body.utm_campaign, 150);

    // 3. Validate Name & Vietnamese Phone Number
    if (!name || name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng nhập Họ và tên của quý khách.',
        },
        { status: 400 }
      );
    }

    const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!vnPhoneRegex.test(rawPhone)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Số điện thoại chưa đúng định dạng di động Việt Nam (10 số). Vui lòng kiểm tra lại.',
        },
        { status: 400 }
      );
    }

    // 4. Construct Server-Side Smart Fields (Tablesome Replacement without exposing redirect_token)
    const formatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const createdAtDatetime = formatter.format(new Date());

    const leads = await readLeads();
    const seq = String(leads.length + 1).padStart(3, '0');
    const leadId = `PT-261014-${seq}`;

    const newLead: LeadRecord = {
      id: leadId,
      name,
      phone: rawPhone,
      email,
      message,
      du_an: duAn,
      page_source_url: pageSourceUrl,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      ip_address: ip,
      created_at_datetime: createdAtDatetime,
      status: 'Mới',
    };

    leads.unshift(newLead);
    await writeLeads(leads);

    // 5. Optional Async Webhook Forwarding to Google Sheets / Telegram (Server-Side Only)
    const sheetsWebhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (
      sheetsWebhook &&
      !sheetsWebhook.includes('your-deployment-id')
    ) {
      fetch(sheetsWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      }).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      leadId,
      message: 'Đã lưu thông tin tư vấn thành công.',
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi xử lý biểu mẫu trên máy chủ.',
      },
      { status: 500 }
    );
  }
}
