# LogiFlow - Transportation Logistics Company Website

A modern, responsive website for a transportation logistics company featuring a public homepage and secure admin dashboard for content management.

![LogiFlow](./generated-icon.png)

## 🚀 Features

### Public Website
- **Professional Homepage** - Clean, modern design showcasing company services
- **Company Overview** - Dynamic section highlighting expertise and mission
- **Core Values** - Safety, Confidence, Speed, and Reliability showcase
- **Services Portfolio** - Transportation, IT Management, and Tracking services
- **Team Showcase** - Meet the leadership team
- **Contact Form** - Direct communication channel for potential clients
- **Responsive Design** - Optimized for all devices and screen sizes

### Admin Dashboard
- **Secure Authentication** - Protected admin access with session management
- **Content Management** - Real-time editing of all homepage sections
- **Overview Management** - Update company description and mission
- **Values Management** - Add, edit, and remove company values
- **Services Management** - Manage service offerings with descriptions
- **Team Management** - Add and update team member profiles
- **Contact Submissions** - View and manage customer inquiries
- **Real-time Updates** - Changes appear instantly in the interface

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible component library
- **Wouter** - Lightweight client-side routing
- **TanStack Query** - Powerful data fetching and caching
- **React Hook Form** - Efficient form handling
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Server-side type safety
- **PostgreSQL** - Robust database solution
- **Drizzle ORM** - Type-safe database operations
- **Session-based Auth** - Secure authentication system
- **bcryptjs** - Password hashing

### Development
- **Vite** - Fast build tool and dev server
- **Hot Module Replacement** - Instant development feedback
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** database (local or cloud)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd logiflow-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/logiflow_db"
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=logiflow_db

# Session Secret (generate a secure random string)
SESSION_SECRET="your-secure-session-secret-here"

# Node Environment
NODE_ENV=development
```

### 4. Database Setup
```bash
# Push database schema
npm run db:push

# Optional: Seed with initial data
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 🔐 Admin Access

### Default Admin Credentials
- **Email:** `safarelsarl@gmail.com`
- **Password:** `Mayache+1234`

### Accessing Admin Dashboard
1. Navigate to `/admin` or `/admin/login`
2. Enter the credentials above
3. Manage all website content in real-time

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── App.tsx         # Main application component
├── server/                 # Backend Express application
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   ├── auth.ts             # Authentication logic
│   └── db.ts               # Database connection
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schema and types
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## 🎯 Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Database
npm run db:push          # Push schema changes to database
npm run db:studio        # Open Drizzle Studio (database GUI)
npm run seed             # Seed database with initial data

# Production
npm run build            # Build for production
npm start                # Start production server
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/overview` - Get company overview
- `GET /api/values` - Get company values
- `GET /api/services` - Get services list
- `GET /api/team` - Get team members
- `POST /api/contact` - Submit contact form

### Admin Endpoints (Protected)
- `POST /api/login` - Admin login
- `POST /api/logout` - Admin logout
- `GET /api/auth/check` - Check authentication status
- `PUT /api/overview` - Update company overview
- `POST /api/values` - Create new value
- `PUT /api/values/:id` - Update value
- `DELETE /api/values/:id` - Delete value
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `POST /api/team` - Create team member
- `PUT /api/team/:id` - Update team member
- `DELETE /api/team/:id` - Delete team member
- `GET /api/contact-submissions` - View contact submissions

## 🎨 Customization

### Colors and Branding
The project uses a professional blue and amber color scheme suitable for logistics companies. To customize:

1. Edit `client/src/index.css` for color variables
2. Update the company logo and branding elements
3. Modify the color scheme in `tailwind.config.ts`

### Content Management
All content is manageable through the admin dashboard:
- Company overview and mission
- Core values and descriptions
- Service offerings
- Team member profiles
- Contact form submissions

## 🔒 Security Features

- **Password Hashing** - bcrypt for secure password storage
- **Session Management** - Server-side session handling
- **Protected Routes** - Authentication middleware for admin routes
- **Input Validation** - Zod schema validation
- **CSRF Protection** - Built-in Express security measures

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Ensure PostgreSQL is running
   - Check database credentials

2. **Authentication Problems**
   - Verify SESSION_SECRET is set
   - Clear browser cookies and try again
   - Check admin credentials

3. **Build Errors**
   - Delete `node_modules` and run `npm install`
   - Clear browser cache
   - Check for TypeScript errors

## 📞 Support

For questions or support regarding this transportation logistics website:

- **Admin Email:** safarelsarl@gmail.com
- **Technical Issues:** Check the troubleshooting section above
- **Feature Requests:** Use the admin dashboard to manage content

## 📄 License

This project is proprietary software developed for LogiFlow Transportation Logistics Company.

---

**Built with ❤️ for modern transportation logistics**


