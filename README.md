This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Device API Authentication

The device API endpoints are protected with basic API key authentication.

### Default API Key
- **API Key**: `device-api-key-2024` (hardcoded for development)

### Configuration
You can set custom API keys using environment variables:

```env
# Server-side (for API route validation)
DEVICE_API_KEY=your-secret-api-key

# Client-side (for frontend requests)
NEXT_PUBLIC_DEVICE_API_KEY=your-secret-api-key
```

### Usage

#### Using RTK Query (Automatic)
The RTK Query setup automatically includes the API key in all requests via the `X-API-Key` header.

#### Direct Fetch Calls
When making direct fetch calls, include the API key:

```typescript
const apiKey = process.env.NEXT_PUBLIC_DEVICE_API_KEY || 'device-api-key-2024';
const res = await fetch('/api/devices', {
  headers: {
    'X-API-Key': apiKey,
  },
});
```

#### External API Calls
For external API calls (e.g., from desktop applications), include the API key in headers:

```bash
# Using X-API-Key header
curl -H "X-API-Key: device-api-key-2024" http://localhost:3000/api/devices

# Or using Authorization header
curl -H "Authorization: Bearer device-api-key-2024" http://localhost:3000/api/devices
```

### Protected Endpoints
All device API endpoints require authentication:
- `GET /api/devices` - List devices
- `POST /api/devices/register` - Register new device
- `PATCH /api/devices/:uuid` - Update device
- `PATCH /api/devices/:uuid/status` - Update device status
- `DELETE /api/devices/:uuid` - Delete device
- `GET /api/devices/:uuid/data` - Get device test results

### Security Notes
⚠️ **For Production:**
- Change the default API key
- Store API keys in environment variables
- Use HTTPS for all API communications
- Consider implementing JWT tokens or OAuth2 for more robust authentication
- Implement rate limiting
- Add request signing/HMAC for device-to-server communication

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
