-- Tạo bảng urls để lưu trữ thông tin link rút gọn
CREATE TABLE IF NOT EXISTS urls (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    short_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    click_count INTEGER DEFAULT 0
);

-- Tạo index để tăng tốc độ tìm kiếm
CREATE INDEX IF NOT EXISTS idx_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_created_at ON urls(created_at);
