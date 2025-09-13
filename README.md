# Miseda Inspect SRL - Client Notifications System

A React web application for managing automotive inspection notifications and customer communication for www.misedainspectsrl.ro. This system helps track vehicle inspection expiration dates and automatically notify customers via SMS or email.

## 🚗 Project Overview

This application provides a comprehensive dashboard for managing:
- Vehicle inspection notifications by license plate
- Customer contact information (phone numbers for SMS notifications)
- Expiration date tracking and automated alerts
- Bulk data import from CSV/Excel files
- Multi-environment deployment support

## 🛠️ Technology Stack

- **Frontend**: React 19.1.1 + React Router DOM 7.8.2
- **Styling**: Custom CSS with responsive design
- **HTTP Client**: Axios 1.12.0
- **Authentication**: JWT tokens with automatic expiration handling
- **File Processing**: CSV/Excel import support (csv-parser, xlsx)
- **Icons**: Feather Icons (react-icons)

## ⚙️ Environment Configuration

### API Base URL Configuration

The application automatically switches between development and production environments:

```javascript
// src/config/config.js
const config = {
    development: {
        API_BASE_URL: 'http://localhost:5000/api',
        APP_URL: 'http://localhost:3000'
    },
    production: {
        API_BASE_URL: 'https://misedainspectsrl.ro/api',
        APP_URL: 'https://misedainspectsrl.ro'
    }
};
```

### Environment Variables

For custom API endpoints, you can set:

```bash
# Development
REACT_APP_API_URL=http://localhost:5000/api

# Production
REACT_APP_API_URL=https://misedainspectsrl.ro/api
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- Access to the backend API server

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/AduAdrian/Statie-ITP-notificari-clienti.git
cd Statie-ITP-notificari-clienti
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
   - The app will automatically use the correct API URL based on NODE_ENV
   - For custom configuration, edit `src/config/config.js`

### Development

**Start the development server:**
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

**Key Features in Development:**
- Hot reloading for instant feedback
- Development API endpoint (localhost:5000)
- Browser DevTools integration
- Console logging for debugging

## 🏗️ Building for Production

### Standard Build
```bash
npm run build
```

### Production Build with Custom API
```bash
npm run build:prod
```

This creates an optimized production build in the `build` folder with:
- Minified and optimized code
- Production API endpoints
- Static assets with cache-friendly filenames

## 🧪 Testing

```bash
npm test
```

Run tests in interactive watch mode:
```bash
npm test -- --watch
```

## 📦 Deployment

### Static Hosting (Recommended)

1. **Build the project:**
```bash
npm run build:prod
```

2. **Deploy the `build` folder** to your hosting provider:
   - **Netlify**: Drag & drop or connect to Git
   - **Vercel**: `vercel --prod`
   - **GitHub Pages**: Use gh-pages package
   - **Apache/Nginx**: Upload build contents to web directory

### Server Configuration

Ensure your web server is configured for Single Page Applications:

**Apache (.htaccess):**
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

**Nginx:**
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## 🔐 Authentication & Security

### JWT Token Management
- Automatic token validation and refresh
- Secure token storage in localStorage
- Automatic logout on token expiration
- Protected routes with authentication guards

### Security Features
- CORS protection
- Input validation
- Secure password handling
- Rate limiting (server-side)

### Usage Tips
- Tokens expire after a set time - users will be automatically logged out
- "Remember me" option stores email for convenience
- All API calls include authentication headers automatically

## 📱 Features

### Dashboard
- **Notification Management**: Add, edit, delete vehicle inspection notifications
- **Search & Filter**: Find notifications by license plate or phone number
- **Sorting**: Sort by expiration date, status, or other fields
- **Pagination**: Handle large datasets efficiently
- **Bulk Import**: Upload CSV/Excel files with notification data

### User Management
- **Account Settings**: Update profile information
- **Subscription Plans**: Manage service tiers (Standard, Premium, Premium+)
- **Database Management**: Each user has a separate notification database

### Authentication Flow
- **Login/Register**: Secure user authentication
- **Password Recovery**: Email and SMS-based password reset
- **Multi-step Verification**: Secure account recovery process

## 🔧 Development Tips

### Project Structure
```
src/
├── components/
│   ├── auth/           # Login, register, password reset
│   ├── dashboard/      # Main app functionality
│   └── layout/         # Navigation, landing pages
├── config/             # Environment configuration
├── hooks/              # Custom React hooks
├── utils/              # Shared utilities
└── App.js             # Main application component
```

### Code Style
- Use functional components with hooks
- Implement proper error boundaries
- Follow consistent naming conventions
- Add loading states for better UX

### API Integration
All API calls use the centralized configuration from `src/config/config.js`, making environment switching seamless.

## 🐛 Troubleshooting

### Common Issues

**Build fails with dependency errors:**
```bash
npm install --legacy-peer-deps
```

**API connection issues:**
- Verify API_BASE_URL in config/config.js
- Check CORS settings on backend
- Ensure backend server is running

**Authentication problems:**
- Clear localStorage and login again
- Check JWT token expiration
- Verify backend authentication endpoints

### Development Debug Mode

Enable verbose logging in development:
```javascript
// In development, errors are logged to console
console.log('API Response:', response.data);
```

## 📞 Support & Maintenance

### Regular Maintenance
- Update dependencies monthly: `npm audit fix`
- Monitor application performance
- Review and update API endpoints
- Backup user data regularly

### Monitoring
- Check application logs for errors
- Monitor API response times
- Track user authentication issues
- Review security alerts

For technical support or feature requests, please contact the development team.

---

**Built with ❤️ for Miseda Inspect SRL**
