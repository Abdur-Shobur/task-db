# Device Status Dashboard

A modern, full-stack device monitoring dashboard built with Next.js 16, React, and TypeScript. This application provides real-time device status tracking, authentication, and comprehensive device management capabilities.

## 🚀 Features

### Authentication

- **Secure Login System**: Hardcoded authentication with NextAuth.js integration
- **Session Management**: JWT-based session handling with NextAuth
- **Protected Routes**: Middleware-based route protection for dashboard pages
- **Auto-redirect**: Authenticated users are automatically redirected from login page

### Device Management

- **Device Registration**: Register new devices with ID, name, type, and status
- **Device Listing**: View all registered devices with filtering and search
- **Status Management**: Update device status (online/offline) with optimistic updates
- **Device Details**: View comprehensive device information and test results
- **Device Deletion**: Remove devices from the system
- **Device Updates**: Edit device name and type

### Dashboard Features

- **Statistics Toolbar**: Real-time statistics showing:
  - Total devices count
  - Online devices count with percentage
  - Offline devices count with percentage
- **Search & Filter**:
  - Search devices by name, ID, or type
  - Filter by status (online/offline)
  - Debounced search for optimal performance
- **Test Results**: View mock laboratory test results for each device
- **Responsive Design**: Mobile-first design with Tailwind CSS

### UI/UX

- **Modern UI**: Built with shadcn/ui components
- **Dark Mode Support**: Full dark mode compatibility
- **Loading States**: Comprehensive loading and error state handling
- **Toast Notifications**: User-friendly feedback for all actions
- **Form Validation**: Zod schema validation with React Hook Form
- **Optimistic Updates**: Instant UI updates for better UX

## 🛠️ Tech Stack

### Frontend

- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **RTK Query**: Data fetching and caching
- **Redux Toolkit**: State management
- **NextAuth.js**: Authentication
- **date-fns**: Date formatting
- **recharts**: Data visualization
- **lucide-react**: Icon library

### Backend

- **Next.js API Routes**: RESTful API endpoints
- **In-Memory Storage**: Device data stored in memory (no database required)
- **Zod Validation**: Request/response validation
- **TypeScript**: Type-safe API development

## 📋 Prerequisites

- Node.js 18+
- npm or yarn or pnpm

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd task1
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_BACKEND_API="http://localhost:3000"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-nextauth-key-change-in-production-2024"
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

### Demo Credentials

The application includes hardcoded credentials for development:

- **Admin User**

  - Email: `admin@example.com`
  - Password: `admin123`

- **Test User**
  - Email: `user@example.com`
  - Password: `user123`

> **Note**: In production, these should be replaced with a proper authentication system using a database and hashed passwords.

## 📡 API Endpoints

### Authentication

#### `POST /api/auth/login`

Login endpoint for user authentication.

**Request Body:**

```json
{
	"email": "admin@example.com",
	"password": "admin123"
}
```

**Response:**

```json
{
	"status": true,
	"message": "Login successful",
	"data": {
		"accessToken": "mock-access-token-1-1234567890",
		"refreshToken": "mock-refresh-token-1-1234567890",
		"user": {
			"id": 1,
			"name": "Admin User",
			"email": "admin@example.com"
		}
	},
	"statusCode": 200,
	"meta": null
}
```

### Device Management

#### `GET /api/devices`

Get all devices with optional status filtering.

**Query Parameters:**

- `status` (optional): `online` | `offline`

**Headers:**

- `X-API-Key`: `device-api-key-2024` (default)

**Example:**

```
GET /api/devices?status=online
```

**Response:**

```json
[
	{
		"uuid": "550e8400-e29b-41d4-a716-446655440000",
		"deviceId": "DEV-001",
		"deviceName": "Temperature Sensor",
		"deviceType": "Sensor",
		"status": "online",
		"lastUpdated": "2024-01-15T10:30:00.000Z"
	}
]
```

#### `POST /api/devices/register`

Register a new device.

**Request Body:**

```json
{
	"deviceId": "DEV-001",
	"deviceName": "Temperature Sensor",
	"deviceType": "Sensor",
	"status": "online"
}
```

**Response:**

```json
{
	"uuid": "550e8400-e29b-41d4-a716-446655440000",
	"deviceId": "DEV-001",
	"deviceName": "Temperature Sensor",
	"deviceType": "Sensor",
	"status": "online",
	"lastUpdated": "2024-01-15T10:30:00.000Z"
}
```

#### `PATCH /api/devices/:uuid`

Update device details (name and type).

**Request Body:**

```json
{
	"deviceName": "Updated Name",
	"deviceType": "Updated Type"
}
```

#### `PATCH /api/devices/:uuid/status`

Update device status.

**Request Body:**

```json
{
	"status": "online"
}
```

#### `DELETE /api/devices/:uuid`

Delete a device.

**Response:**

```json
{
	"message": "Device deleted successfully"
}
```

#### `GET /api/devices/:uuid/data`

Get mock test results for a device.

**Response:**

```json
[
	{
		"id": "test-1",
		"timestamp": "2024-01-15T10:30:00.000Z",
		"testType": "Temperature",
		"value": 25.5,
		"unit": "°C",
		"status": "normal"
	}
]
```

## 📁 Project Structure

```
task1/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   └── devices/        # Device management endpoints
│   │   ├── dashboard/          # Protected dashboard pages
│   │   │   └── devices/        # Device management page
│   │   ├── login/              # Login page
│   │   └── page.tsx            # Home/Login page
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── common/             # Shared components
│   ├── lib/                    # Utility functions
│   │   ├── device-store.ts     # In-memory device storage
│   │   ├── api-auth.ts         # API authentication
│   │   └── auth.ts             # NextAuth configuration
│   ├── store/                  # Redux store
│   │   └── features/           # Feature slices
│   │       ├── api/            # API slice configuration
│   │       ├── auth/           # Authentication feature
│   │       └── device/          # Device management feature
│   ├── types/                  # TypeScript type definitions
│   └── hooks/                  # Custom React hooks
├── public/                     # Static assets
├── .env.local                  # Environment variables
├── middleware.ts               # Next.js middleware (route protection)
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔒 Security Considerations

### Current Implementation

- Hardcoded credentials (development only)
- In-memory data storage (data lost on server restart)
- Mock JWT tokens

### Production Recommendations

1. **Database Integration**: Replace in-memory storage with a proper database (PostgreSQL, MongoDB, etc.)
2. **Password Hashing**: Use bcrypt or similar for password hashing
3. **JWT Tokens**: Implement proper JWT token generation and validation
4. **API Security**: Add rate limiting, CORS configuration, and input sanitization
5. **Environment Variables**: Use secure secret management for production
6. **HTTPS**: Always use HTTPS in production
7. **Authentication**: Implement proper OAuth or database-backed authentication

## 🎨 UI Components

The project uses shadcn/ui components including:

- Button, Input, Select, Checkbox
- Card, Badge, Table
- Dialog, Sheet, Dropdown Menu
- Form components with validation
- Toast notifications

## 📊 Features in Detail

### Statistics Toolbar

- Real-time device count statistics
- Color-coded cards (blue for total, emerald for online, amber for offline)
- Percentage calculations
- Responsive grid layout

### Device List

- Sortable and filterable table
- Search functionality with debouncing
- Status badges with color indicators
- Action dropdown menu for each device
- Responsive design

### Device Details Sheet

- Comprehensive device information
- Recent test results table
- Chart visualization (optional)
- Real-time data updates

## 🚧 Development Notes

- The application uses in-memory storage, so data is lost on server restart
- Authentication is hardcoded for development purposes
- All API endpoints require the `X-API-Key` header (default: `device-api-key-2024`)
- The middleware protects `/dashboard/*` routes

## 📝 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For questions or issues, please contact the project maintainer.

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using Next.js, React, and TypeScript**
