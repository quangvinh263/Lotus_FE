# Lotus Hotel — Frontend

Ứng dụng web quản lý khách sạn toàn diện được xây dựng bằng **React + Vite**, hỗ trợ 3 nhóm người dùng: Khách hàng, Lễ tân và Quản trị viên.

---

## Mục lục

- [Lotus Hotel — Frontend](#lotus-hotel--frontend)
  - [Mục lục](#mục-lục)
  - [Tổng quan](#tổng-quan)
  - [Tính năng](#tính-năng)
    - [Khách hàng (Public)](#khách-hàng-public)
    - [Lễ tân (Reception)](#lễ-tân-reception)
    - [Quản trị viên (Admin)](#quản-trị-viên-admin)
  - [Công nghệ sử dụng](#công-nghệ-sử-dụng)
  - [Cấu trúc dự án](#cấu-trúc-dự-án)
  - [Cài đặt \& Chạy dự án](#cài-đặt--chạy-dự-án)
    - [Yêu cầu](#yêu-cầu)
    - [Các bước](#các-bước)
    - [Các lệnh khác](#các-lệnh-khác)
  - [Biến môi trường](#biến-môi-trường)
  - [Các trang \& Routes](#các-trang--routes)
    - [Public](#public)
    - [Xác thực](#xác-thực)
    - [Lễ tân (`/reception/*`)](#lễ-tân-reception-1)
    - [Quản trị viên (`/admin/*`)](#quản-trị-viên-admin-1)
  - [Phân quyền người dùng](#phân-quyền-người-dùng)
  - [Deploy](#deploy)

---

## Tổng quan

**Lotus Hotel** là một hệ thống quản lý khách sạn trực tuyến, cung cấp trải nghiệm đặt phòng liền mạch cho khách hàng đồng thời trang bị đầy đủ công cụ quản lý cho nhân viên lễ tân và quản trị viên. Hệ thống tích hợp thanh toán trực tuyến qua **ZaloPay**, cập nhật thời gian thực qua **SignalR**, và phân tích dữ liệu thông minh bằng **Gemini AI**.

---

## Tính năng

### Khách hàng (Public)
- Duyệt danh sách phòng với bộ lọc tìm kiếm
- Xem chi tiết phòng và tiện nghi
- Đặt phòng với lịch chọn ngày linh hoạt
- Thanh toán trực tuyến qua **ZaloPay** hoặc tiền mặt
- Quản lý hồ sơ cá nhân, đổi mật khẩu
- Đăng nhập bằng tài khoản Google (OAuth)

### Lễ tân (Reception)
- Dashboard tổng quan theo thời gian thực
- Quản lý đặt phòng (tạo mới, cập nhật trạng thái)
- Quản lý check-in / check-out
- Quản lý dịch vụ bổ sung cho khách

### Quản trị viên (Admin)
- Dashboard phân tích tổng quan
- CRUD nhân viên, phòng, loại phòng, dịch vụ
- Quản lý đơn đặt phòng và khách hàng
- Báo cáo doanh thu theo tháng (biểu đồ)
- Phân tích AI (Gemini) cho dữ liệu chiến dịch

---

## Công nghệ sử dụng

| Hạng mục | Công nghệ |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Routing | React Router DOM 7 |
| HTTP Client | Axios 1.13 |
| Xác thực | JWT, `@react-oauth/google` |
| Realtime | `@microsoft/signalr` |
| Biểu đồ | Recharts |
| Thông báo | React Toastify |
| Render Markdown | react-markdown |
| Linting | ESLint 9 |
| Deploy | Vercel |

---

## Cấu trúc dự án

```
src/
├── api/             # Các module gọi API (Axios)
├── assets/          # Hình ảnh, icon tĩnh
├── components/      # UI components tái sử dụng
│   ├── Admin/       # Components cho trang Admin
│   ├── Public/      # Components cho trang khách hàng
│   └── Reception/   # Components cho trang lễ tân
├── context/         # React Context (AuthContext)
├── pages/           # Các trang theo vai trò
│   ├── Admin/
│   ├── Auth/
│   ├── Public/
│   └── Reception/
├── routes/          # Cấu hình routing & bảo vệ route
├── services/        # SignalR services
└── styles/          # File CSS toàn cục
```

---

## Cài đặt & Chạy dự án

### Yêu cầu

- Node.js >= 18
- npm hoặc yarn

### Các bước

```bash
# 1. Clone repository
git clone https://github.com/quangvinh263/Lotus_FE.git
cd Lotus_FE

# 2. Cài đặt dependencies
npm install

# 3. Tạo file môi trường
cp .env.example .env
# Chỉnh sửa file .env với các giá trị phù hợp

# 4. Chạy development server
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`.

### Các lệnh khác

```bash
npm run build      # Build production
npm run preview    # Preview bản build
npm run lint       # Kiểm tra lỗi ESLint
```

---

## Biến môi trường

Tạo file `.env` ở thư mục gốc với nội dung:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

| Biến | Mô tả |
|---|---|
| `VITE_API_BASE_URL` | URL gốc của backend REST API |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID cho đăng nhập bằng Google |

---

## Các trang & Routes

### Public
| Route | Trang |
|---|---|
| `/` | Trang chủ |
| `/rooms` | Danh sách phòng |
| `/room-details/:id` | Chi tiết phòng |
| `/facilities` | Tiện nghi khách sạn |
| `/about` | Giới thiệu |
| `/booking` | Đặt phòng |
| `/guest-info` | Thông tin khách |
| `/payment-result` | Kết quả thanh toán |
| `/profile` | Hồ sơ cá nhân |

### Xác thực
| Route | Trang |
|---|---|
| `/signin` | Đăng nhập |
| `/signup` | Đăng ký |
| `/complete-profile` | Hoàn thiện hồ sơ lần đầu |
| `/forgot-password` | Quên mật khẩu |
| `/reset-password` | Đặt lại mật khẩu |

### Lễ tân (`/reception/*`)
| Route | Trang |
|---|---|
| `/reception/dashboard` | Dashboard lễ tân |
| `/reception/booking-management` | Quản lý đặt phòng |
| `/reception/create-booking` | Tạo đặt phòng mới |
| `/reception/checkin` | Quản lý check-in |
| `/reception/checkout` | Quản lý check-out |
| `/reception/services` | Quản lý dịch vụ |

### Quản trị viên (`/admin/*`)
| Route | Trang |
|---|---|
| `/admin/dashboard` | Dashboard tổng quan |
| `/admin/employees` | Quản lý nhân viên |
| `/admin/rooms` | Quản lý phòng |
| `/admin/booking-orders` | Quản lý đơn đặt phòng |
| `/admin/customers` | Quản lý khách hàng |
| `/admin/services` | Quản lý dịch vụ |
| `/admin/revenue` | Báo cáo doanh thu |

---

## Phân quyền người dùng

Hệ thống sử dụng JWT để xác thực. Vai trò người dùng (`role`) được lưu trong `localStorage` và quản lý qua `AuthContext`.

| Vai trò | Quyền truy cập |
|---|---|
| **Customer** | Trang public, đặt phòng, hồ sơ cá nhân |
| **Reception** | Tất cả trang `/reception/*` |
| **Admin** | Tất cả trang `/admin/*` |

Token JWT được tự động làm mới (silent refresh) khi hết hạn thông qua interceptor của Axios.

---

## Deploy

Dự án được cấu hình deploy lên **Vercel**. File [vercel.json](vercel.json) đã có sẵn rule rewrite cho SPA:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Để deploy:

```bash
npm run build
# Sau đó push lên GitHub và kết nối với Vercel,
# hoặc dùng Vercel CLI: vercel --prod
```
