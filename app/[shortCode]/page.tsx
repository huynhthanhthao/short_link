import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, initDatabase } from '@/lib/database';

interface PageProps {
  params: Promise<{
    shortCode: string;
  }>;
}

export default async function RedirectPage({ params }: PageProps) {
  try {
    await initDatabase();
    const db = getDatabase();
    
    const { shortCode } = await params;

    if (!shortCode) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Lỗi</h1>
            <p className="mt-2">Mã ngắn không hợp lệ</p>
          </div>
        </div>
      );
    }

    // Tìm URL gốc từ short code
    const result = await db.query(
      'SELECT original_url FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Không tìm thấy</h1>
            <p className="mt-2">URL không tồn tại hoặc đã bị xóa</p>
          </div>
        </div>
      );
    }

    const originalUrl = result.rows[0].original_url;

    // Tăng số lượt click
    await db.query(
      'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
      [shortCode]
    );

    // Client-side redirect
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4">Đang chuyển hướng...</p>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.location.href = "${originalUrl}";`,
            }}
          />
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error redirecting:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Lỗi</h1>
          <p className="mt-2">Có lỗi xảy ra khi chuyển hướng</p>
        </div>
      </div>
    );
  }
}
