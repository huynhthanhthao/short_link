# 📎 IIT Short Link - Ứng dụng rút gọn URL

Ứng dụng web để rút gọn URL dài thành link ngắn gọn, dễ chia sẻ và theo dõi.

## ✨ Tính năng

- 🔗 Rút gọn URL dài thành link ngắn
- 📊 Theo dõi số lượt click
- 🎨 Giao diện hiện đại, responsive
- 🐳 Hỗ trợ Docker deployment
- 🔄 Redirect tự động
- 💾 Lưu trữ database PostgreSQL

## 🚀 Cài đặt và chạy

### Yêu cầu hệ thống
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### 1. Clone repository
\`\`\`bash
git clone <your-repo-url>
cd short_link
\`\`\`

### 2. Cài đặt dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Cấu hình environment
Tạo file \`.env.local\`:
\`\`\`env
DATABASE_URL=postgresql://postgres:password@localhost:5432/shortlink
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_TELEMETRY_DISABLED=1
\`\`\`

### 4. Chạy với Docker (Khuyến nghị)
\`\`\`bash
# Chạy database và ứng dụng
docker-compose up -d

# Hoặc chỉ chạy database
docker-compose up postgres -d
\`\`\`

### 5. Chạy development mode
\`\`\`bash
npm run dev
\`\`\`

Ứng dụng sẽ chạy tại http://localhost:3000

## 📖 API Documentation

### POST /api/shorten
Rút gọn một URL

**Request Body:**
\`\`\`json
{
  "originalUrl": "https://example.com/very-long-url"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "originalUrl": "https://example.com/very-long-url",
    "shortUrl": "http://localhost:3000/abc123",
    "shortCode": "abc123",
    "clicks": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
\`\`\`

### GET /api/shorten
Lấy danh sách URL đã rút gọn (50 bản ghi gần nhất)

**Response:**
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "originalUrl": "https://example.com/very-long-url",
      "shortUrl": "http://localhost:3000/abc123",
      "shortCode": "abc123",
      "clicks": 5,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
\`\`\`

### GET /:shortCode
Redirect đến URL gốc và tăng click count

## 🗄️ Database Schema

\`\`\`sql
CREATE TABLE urls (
    id SERIAL PRIMARY KEY,
    original_url TEXT NOT NULL,
    short_code VARCHAR(10) UNIQUE NOT NULL,
    short_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    click_count INTEGER DEFAULT 0
);
\`\`\`

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, React 19, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL 15
- **Deployment:** Docker, Docker Compose
- **Language:** TypeScript

## 🔧 Development

### Build production
\`\`\`bash
npm run build
\`\`\`

### Start production server
\`\`\`bash
npm start
\`\`\`

### Lint code
\`\`\`bash
npm run lint
\`\`\`

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| \`DATABASE_URL\` | PostgreSQL connection string | - |
| \`NEXT_PUBLIC_BASE_URL\` | Base URL for short links | http://localhost:3000 |
| \`NEXT_TELEMETRY_DISABLED\` | Disable Next.js telemetry | 1 |

## 🤝 Contributing

1. Fork project
2. Tạo feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Tạo Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

IIT Team
