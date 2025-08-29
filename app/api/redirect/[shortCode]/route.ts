import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, initDatabase } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    await initDatabase();
    const db = getDatabase();
    
    const { shortCode } = await params;

    if (!shortCode) {
      return NextResponse.json(
        { error: 'Mã ngắn không hợp lệ' },
        { status: 400 }
      );
    }

    // Tìm URL gốc từ short code
    const result = await db.query(
      'SELECT original_url FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Không tìm thấy URL' },
        { status: 404 }
      );
    }

    const originalUrl = result.rows[0].original_url;

    // Tăng số lượt click
    await db.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
      [shortCode]
    );

    // Redirect đến URL gốc
    return NextResponse.redirect(originalUrl);

  } catch (error) {
    console.error('Error redirecting:', error);
    return NextResponse.json(
      { error: 'Lỗi server nội bộ' },
      { status: 500 }
    );
  }
}
