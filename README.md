# Burton Latimer Community

A modern social platform designed to bring together individuals, charities, and businesses in the Burton Latimer community. This platform enables local connections, mutual support, and community engagement.

![Brand Colors: Black, Gold, White](https://img.shields.io/badge/Colors-Black%20%7C%20Gold%20%7C%20White-FFD700)

## 🌟 Features

### Core Functionality
- **Multi-Account Types**: Support for individuals, charities, and businesses
- **Social Feed**: Post updates, share photos, and engage with the community
- **Direct Messaging**: Private conversations between community members
- **Community Groups**: Create and join groups based on interests or neighborhoods
- **Help Requests**: Dedicated post type for community members seeking assistance
- **Business Advertising**: Local businesses can promote their services
- **Event Sharing**: Share and discover local events

### User Features
- GDPR-compliant registration and data management
- Customizable user profiles
- Post creation with multiple types (general, help requests, business ads, events)
- Like and comment on posts
- Follow other community members
- Privacy settings and data controls

### Technical Features
- Built with Next.js 14 (App Router)
- TypeScript for type safety
- PostgreSQL database with Prisma ORM
- JWT-based authentication
- Responsive design with TailwindCSS
- Modern UI components with shadcn/ui
- Mobile-ready architecture for future app conversion

## 🚀 Quick Start

See [SETUP.md](./SETUP.md) for detailed installation instructions.

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon.tech recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd burton-latimer-community
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://username:password@host/database"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
burton-latimer-community/
├── app/                      # Next.js App Router pages
│   ├── api/                 # API routes
│   ├── dashboard/           # Main dashboard
│   ├── groups/              # Groups feature
│   ├── messages/            # Messaging system
│   ├── profile/             # User profile
│   ├── login/               # Login page
│   └── register/            # Registration page
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard/           # Dashboard components
│   ├── groups/              # Group components
│   ├── messages/            # Messaging components
│   └── profile/             # Profile components
├── lib/                     # Utility functions
│   ├── prisma.ts           # Prisma client
│   └── auth.ts             # Authentication utilities
├── prisma/                  # Database schema
│   └── schema.prisma       # Prisma schema definition
└── public/                  # Static assets
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with jose
- **Styling**: TailwindCSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Form Validation**: Zod
- **Password Hashing**: bcryptjs

## 📊 Database Schema

The platform uses the following main models:

- **User**: Individual, charity, or company accounts
- **Post**: Social posts with types (general, help request, business ad, event)
- **Comment**: Post comments
- **Like**: Post likes
- **Message**: Direct messages
- **Group**: Community groups
- **GroupMember**: Group membership
- **Follow**: User following relationships

## 🔒 GDPR Compliance

This platform is built with GDPR compliance in mind:

- Explicit user consent for data collection
- Clear privacy policy and terms of service
- User data download capability (planned)
- Account deletion option (planned)
- Marketing consent opt-in/opt-out
- Secure password storage with bcrypt
- Data minimization principles

## 📱 Mobile App Conversion

The application is architected for easy conversion to mobile apps:

- **React Native**: Component structure is compatible with React Native
- **Capacitor**: Can be wrapped for iOS/Android deployment
- **PWA**: Progressive Web App support can be added
- **Expo**: Compatible with Expo for rapid mobile development

## 🚢 Deployment

### Vercel (Recommended for Next.js)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The application can be deployed to:
- Netlify
- Railway
- Render
- AWS
- Google Cloud Platform
- Azure

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For detailed setup instructions, see [SETUP.md](./SETUP.md)

For issues or questions, please open an issue on GitHub.

## 🎨 Brand Guidelines

**Colors:**
- Primary: Black (#000000)
- Secondary: Gold (#FFD700)
- Background: White (#FFFFFF)

**Typography:**
- Font Family: Geist Sans (default)
- Headings: Bold, Black
- Body: Regular, Black/Gray

---

Built with ❤️ for the Burton Latimer Community
