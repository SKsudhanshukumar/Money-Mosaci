# Professional Finance Dashboard

A comprehensive, modern finance dashboard application built with the MERN stack, featuring professional banking-style UI, advanced filtering, search capabilities, and real-time analytics.

## 🚀 Features

### 📊 Dashboard & Analytics
- **Real-time Financial Overview**: Live KPIs, revenue, expenses, and profit tracking
- **Interactive Charts**: Professional charts using Recharts with multiple visualization types
- **Monthly Trends**: Revenue vs expenses analysis with growth indicators
- **Expense Breakdown**: Category-wise expense distribution with pie charts
- **Performance Metrics**: Detailed monthly performance analysis

### 🔍 Advanced Search & Filtering
- **Global Search**: Intelligent search across transactions, buyers, and amounts
- **Advanced Filters**: Date range, amount range, category-based filtering
- **Quick Filters**: Pre-defined time periods (today, week, month, quarter, year)
- **Saved Filters**: Save and reuse custom filter combinations
- **Real-time Results**: Instant filtering with debounced search

### 📈 Transaction Management
- **Dual View Modes**: Table and grid views for transaction display
- **Bulk Operations**: Select multiple transactions for batch operations
- **Pagination**: Efficient data loading with customizable page sizes
- **Export Options**: CSV, Excel, and PDF export capabilities
- **Transaction Details**: Comprehensive transaction information display

### 📋 Reports & Analytics
- **Pre-built Templates**: Financial summary, transaction reports, monthly analysis
- **Custom Reports**: Create custom report templates
- **Scheduled Reports**: Automated report generation and email delivery
- **Multiple Formats**: PDF, Excel, and CSV export options
- **Email Integration**: Direct email delivery of reports

### 🎨 Professional UI/UX
- **Banking-Style Design**: Clean, corporate interface with professional color scheme
- **Dark/Light Themes**: Automatic theme switching with system preference detection
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Smooth Animations**: Framer Motion animations for enhanced user experience
- **Accessibility**: WCAG compliant with keyboard navigation support

### ⚙️ Settings & Customization
- **User Profile Management**: Complete profile editing with avatar upload
- **Theme Preferences**: Light/dark mode with system sync
- **Currency Settings**: Multi-currency support with localization
- **Notification Controls**: Granular notification preferences
- **Data Management**: Backup, retention, and privacy settings

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Material-UI v5** - Professional component library
- **Redux Toolkit** - State management with RTK Query
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Professional chart library
- **React Router v6** - Client-side routing
- **Date-fns** - Date manipulation and formatting

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

### Development Tools
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **Nodemon** - Development server auto-restart

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Clone Repository
```bash
git clone <repository-url>
cd finance-app-master
```

### Backend Setup
```bash
cd server
npm install

# Create .env file with your MongoDB connection string
echo "MONGO_URI=your_mongodb_connection_string" > .env
echo "PORT=9000" >> .env

# Start development server
npm run dev
```

### Frontend Setup
```bash
cd client
npm install

# Start development server
npm run dev
```

### Environment Variables

#### Server (.env)
```env
MONGO_URI=mongodb://localhost:27017/financeapp
PORT=9000
NODE_ENV=development
```

#### Client (src/.env.local)
```env
VITE_API_URL=http://localhost:9000
VITE_APP_NAME=FinanceApp
```

## 🚀 Usage

### Development
1. Start MongoDB service
2. Run backend server: `cd server && npm run dev`
3. Run frontend server: `cd client && npm run dev`
4. Open http://localhost:5173 in your browser

### Production Build
```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

## 📱 Features Overview

### Dashboard
- Financial KPIs with trend indicators
- Interactive revenue vs expenses charts
- Monthly performance analysis
- Recent transactions overview
- Quick action buttons

### Transactions Page
- Advanced search and filtering
- Table and grid view modes
- Bulk selection and operations
- Export functionality
- Pagination with customizable limits

### Analytics Page
- Comprehensive financial analysis
- Multiple chart types (line, area, bar, pie)
- Performance metrics table
- Growth rate calculations
- Top-performing products analysis

### Reports Page
- Pre-built report templates
- Custom report generation
- Scheduled report automation
- Multiple export formats
- Email delivery options

### Settings Page
- User profile management
- Theme and appearance settings
- Notification preferences
- Data and privacy controls
- Security settings

## 🎨 Design System

### Color Palette
- **Primary**: Professional Blue (#2196f3)
- **Secondary**: Trust Teal (#009688)
- **Success**: Growth Green (#4caf50)
- **Warning**: Attention Orange (#ff9800)
- **Error**: Alert Red (#f44336)

### Typography
- **Font Family**: Inter, Roboto, sans-serif
- **Headings**: 700 weight for primary, 600 for secondary
- **Body Text**: 400 weight regular, 500 weight medium
- **Captions**: 300 weight light

### Spacing
- **Base Unit**: 8px
- **Component Padding**: 16px, 24px, 32px
- **Section Margins**: 24px, 32px, 48px

## 🔧 API Endpoints

### KPIs
- `GET /kpi` - Get all KPI data

### Transactions
- `GET /transaction` - Get transactions with filtering
- `GET /transaction/search` - Search transactions
- `GET /transaction/:id` - Get single transaction

### Products
- `GET /product` - Get products with filtering

### Analytics
- `GET /analytics` - Get comprehensive analytics
- `GET /dashboard/summary` - Get dashboard summary
- `POST /analytics/export/:dataType` - Export data

### CSV Data
- `POST /api/csv-data/upload` - Upload CSV file
- `GET /api/csv-data` - Get uploaded CSV files
- `DELETE /api/csv-data/:id` - Delete CSV file

## 🧪 Testing

### Frontend Testing
```bash
cd client
npm run test
```

### Backend Testing
```bash
cd server
npm run test
```

## 📈 Performance Optimizations

- **Code Splitting**: Lazy loading of pages and components
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Analysis**: Webpack bundle analyzer for optimization
- **Caching**: Browser caching for static assets
- **Database Indexing**: Optimized MongoDB queries

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Proper cross-origin resource sharing
- **Helmet Security**: Security headers and protection
- **Authentication**: JWT-based authentication (ready for implementation)
- **Data Sanitization**: MongoDB injection prevention

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## 🎯 Roadmap

### Upcoming Features
- [ ] Real-time notifications
- [ ] Advanced user authentication
- [ ] Multi-tenant support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics with ML
- [ ] Integration with banking APIs
- [ ] Automated financial insights
- [ ] Custom dashboard widgets

---

**Built with ❤️ for modern financial management**