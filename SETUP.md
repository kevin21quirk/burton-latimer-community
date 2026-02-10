# Burton Latimer Community - Setup Guide

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (we recommend [Neon.tech](https://neon.tech) for cloud hosting)
- Git installed

## Database Setup

### Option 1: Using Neon.tech (Recommended)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string (it will look like: `postgresql://username:password@host/database`)

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database: `createdb burton_latimer_community`
3. Your connection string will be: `postgresql://localhost:5432/burton_latimer_community`

## Installation Steps

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd burton-latimer-community
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@host/database"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"
```

**Important:** 
- Replace the `DATABASE_URL` with your actual database connection string
- Generate a secure random string for `NEXTAUTH_SECRET` (you can use: `openssl rand -base64 32`)

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run Database Migrations

```bash
npx prisma db push
```

This will create all the necessary tables in your database.

### 6. (Optional) Seed the Database

To add some test data, you can create a seed script or manually add users through the registration page.

### 7. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Database Schema Overview

The platform includes the following main models:

- **User**: Stores user accounts (individuals, charities, companies)
- **Post**: Social media posts with different types (general, help requests, business ads, events)
- **Comment**: Comments on posts
- **Like**: Post likes
- **Message**: Direct messages between users
- **Group**: Community groups
- **GroupMember**: Group membership tracking
- **Follow**: User following relationships

## GDPR Compliance

The platform collects the following data with user consent:

- **Required**: Email, password, first name, last name, account type
- **Optional**: Date of birth, phone number, address, city, postcode, bio
- **Business/Charity**: Company name or charity registration number
- **Consent Tracking**: GDPR consent and marketing consent flags

All data collection complies with GDPR requirements.

## Features

### Authentication
- User registration with GDPR-compliant data collection
- Secure login/logout
- JWT-based session management

### Social Features
- Create posts (general, help requests, business ads, events)
- Like and comment on posts
- Social feed with real-time updates
- User profiles

### Messaging
- Direct messaging between users
- Conversation history
- Real-time message updates

### Groups
- Create and join community groups
- Public and private groups
- Group membership management

### Profile Management
- Edit personal information
- Update privacy settings
- Manage communication preferences

## Production Deployment

### Environment Variables for Production

Update your `.env` file for production:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://your-domain.com"
NODE_ENV="production"
```

### Build the Application

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Mobile App Conversion

This application is built with React and Next.js, making it compatible with:

- **React Native**: Use React Native Web or Expo
- **Capacitor**: Convert to iOS/Android apps
- **Progressive Web App (PWA)**: Add PWA support for installable web app

The component structure and state management are designed to be easily portable to mobile platforms.

## Troubleshooting

### Database Connection Issues

If you see database connection errors:
1. Verify your `DATABASE_URL` is correct
2. Check that your database is running
3. Ensure your IP is whitelisted (for cloud databases like Neon)

### Prisma Client Errors

If you see "Cannot find module '@prisma/client'":
```bash
npx prisma generate
```

### Build Errors

Clear the Next.js cache:
```bash
rm -rf .next
npm run dev
```

## Support

For issues or questions, please open an issue on the GitHub repository.

## License

This project is licensed under the MIT License.
