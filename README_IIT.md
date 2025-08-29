# IIT Short Link - Ứng dụng rút gọn URL

Ứng dụng web đơn giản để rút gọn URL dài thành các link ngắn gọn và dễ chia sẻ.

## Tính năng

- ✅ Rút gọn URL dài thành link ngắn
- ✅ Theo dõi số lượt click
- ✅ Lưu trữ lịch sử các URL đã rút gọn
- ✅ Giao diện thân thiện, responsive
- ✅ Dark mode support
- ✅ Copy link một clic

## Công nghệ sử dụng

- **Frontend**: Next.js 15, React 19, TailwindCSS 4
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **Language**: TypeScript
- **Containerization**: Docker, Docker Compose

## Cài đặt và chạy

### 1. Sử dụng Docker (Khuyến nghị)

```bash
# Clone repository
git clone <repo-url>
cd short_link

# Chạy với Docker Compose
docker-compose up -d

# Ứng dụng sẽ chạy tại http://localhost:3000
```

### 2. Chạy local development

```bash
# Cài đặt dependencies
npm install

# Khởi chạy PostgreSQL (cần Docker)
docker run -d \
  --name postgres-shortlink \
  -e POSTGRES_DB=shortlink_db \
  -e POSTGRES_USER=shortlink \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:15-alpine

# Tạo bảng trong database
psql -h localhost -U shortlink -d shortlink_db -f init.sql

# Chạy development server
npm run dev
```

## API Endpoints

### POST /api/shorten
Rút gọn một URL mới

**Request Body:**
```json
{
  "originalUrl": "https://example.com/very-long-url"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "originalUrl": "https://example.com/very-long-url",
    "shortUrl": "http://localhost:3000/abc123",
    "shortCode": "abc123",
    "clicks": 0,
    "createdAt": "2025-08-29T10:30:00Z"
  }
}
```

### GET /api/shorten
Lấy danh sách các URL đã rút gọn

### GET /[shortCode]
Chuyển hướng đến URL gốc và tăng counter click

## Cấu trúc Database

### Bảng `urls`
- `id`: Primary key (SERIAL)
- `original_url`: URL gốc (TEXT)
- `short_code`: Mã ngắn unique (VARCHAR(10))
- `short_url`: URL đầy đủ đã rút gọn (VARCHAR(255))
- `clicks`: Số lượt click (INTEGER)
- `created_at`: Thời gian tạo (TIMESTAMP)
- `updated_at`: Thời gian cập nhật (TIMESTAMP)

## Environment Variables

```env
DATABASE_URL=postgresql://shortlink:password@localhost:5432/shortlink_db
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Cấu trúc thư mục

```
├── app/
│   ├── api/
│   │   └── shorten/
│   │       └── route.ts          # API rút gọn URL
│   ├── [shortCode]/
│   │   └── page.tsx              # Redirect page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Homepage
├── lib/
│   ├── db.ts                     # Database connection
│   └── utils.ts                  # Utility functions
├── docker-compose.yml
├── Dockerfile
├── init.sql                      # Database schema
└── package.json
```

## Development

```bash
# Chạy development mode
npm run dev

# Build cho production
npm run build

# Chạy production build
npm start
```

## License

MIT License
