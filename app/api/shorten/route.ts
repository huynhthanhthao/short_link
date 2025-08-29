import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, initDatabase } from '@/lib/database';
import { generateShortCode, isValidUrl, createShortUrl } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const db = getDatabase();
    
    const { originalUrl } = await request.json();

    // Kiểm tra URL có được cung cấp không
    if (!originalUrl) {
      return NextResponse.json(
        { error: 'URL là bắt buộc' },
        { status: 400 }
      );
    }

    // Kiểm tra URL có hợp lệ không
    if (!isValidUrl(originalUrl)) {
      return NextResponse.json(
        { error: 'URL không hợp lệ' },
        { status: 400 }
      );
    }

    // Kiểm tra xem URL đã được rút gọn trước đó chưa
    const existingUrl = await db.query(
      'SELECT * FROM urls WHERE original_url = $1',
      [originalUrl]
    );

    if (existingUrl.rows.length > 0) {
      // Trả về URL đã được rút gọn trước đó
      const existing = existingUrl.rows[0];
      return NextResponse.json({
        success: true,
        data: {
          id: existing.id,
          originalUrl: existing.original_url,
          shortUrl: existing.short_url,
          shortCode: existing.short_code,
          clicks: existing.click_count,
          createdAt: existing.created_at
        }
      });
    }

    // Tạo short code mới
    let shortCode: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      shortCode = generateShortCode();
      const existing = await db.query(
        'SELECT id FROM urls WHERE short_code = $1',
        [shortCode]
      );
      
      if (existing.rows.length === 0) {
        break;
      }
      
      attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      return NextResponse.json(
        { error: 'Không thể tạo mã ngắn. Vui lòng thử lại.' },
        { status: 500 }
      );
    }

    // Tạo short URL đầy đủ
    const shortUrl = createShortUrl(shortCode);

    // Lưu vào database
    const result = await db.query(
      `INSERT INTO urls (original_url, short_code, short_url, created_at, click_count) 
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 0) 
       RETURNING *`,
      [originalUrl, shortCode, shortUrl]
    );

    const newUrl = result.rows[0];

    return NextResponse.json({
      success: true,
      data: {
        id: newUrl.id,
        originalUrl: newUrl.original_url,
        shortUrl: newUrl.short_url,
        shortCode: newUrl.short_code,
        clicks: newUrl.click_count,
        createdAt: newUrl.created_at
      }
    });

  } catch (error) {
    console.error('Error creating short URL:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await initDatabase();
    const db = getDatabase();
    
    // Lấy danh sách URL đã rút gọn (giới hạn 50 bản ghi gần nhất)
    const result = await db.query(
      `SELECT id, original_url, short_url, short_code, click_count, created_at 
       FROM urls 
       ORDER BY created_at DESC 
       LIMIT 50`
    );

    return NextResponse.json({
      success: true,
      data: result.rows.map((row: any) => ({
        id: row.id,
        originalUrl: row.original_url,
        shortUrl: row.short_url,
        shortCode: row.short_code,
        clicks: row.click_count,
        createdAt: row.created_at
      }))
    });

  } catch (error) {
    console.error('Error fetching URLs:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}
