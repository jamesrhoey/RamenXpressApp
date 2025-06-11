# RamenXpress

## Project Overview

RamenXpress is a comprehensive restaurant management system designed specifically for ramen restaurants. The system consists of three main components:

1. **Mobile App (Customer)**
   - Built with Flutter/Dart
   - Allows customers to:
     - Browse menu items
     - Place orders
     - Track order status
     - View order history
     - Make payments

2. **Web Admin Panel**
   - Built with HTML, CSS, and JavaScript
   - Features for administrators:
     - Manage menu items
     - Monitor inventory
     - View sales reports
     - Track business analytics

3. **Cashier Interface**
   - Built with HTML, CSS, and JavaScript
   - Features for cashiers:
     - Process orders
     - Manage transactions
     - View order queue
     - Handle payments
     - Print receipts

## Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM for MongoDB
- **JWT**: Authentication
- **Bcrypt**: Password hashing

### Frontend (Admin & Cashier)
- **HTML5**: Structure
- **CSS3**: Styling
- **JavaScript**: Interactivity
- **Bootstrap**: UI framework
- **Chart.js**: Data visualization

### Mobile App
- **Flutter**: UI framework
- **Dart**: Programming language
- **Provider**: State management
- **HTTP**: API communication

## System Architecture

The system follows a client-server architecture:
- Backend API serves all three interfaces
- RESTful API design for data communication
- JWT-based authentication for secure access
- Real-time updates using WebSocket
- Responsive design for all interfaces

## Key Features

### Customer Mobile App
- User authentication
- Menu browsing with categories
- Order customization
- Real-time order tracking
- Payment integration
- Order history
- Push notifications

### Admin Panel
- Dashboard with analytics
- Inventory management
- Menu management
- Staff management
- Sales reports
- Customer management
- System settings

### Cashier Interface
- Quick order processing
- Payment handling
- Order queue management
- Daily sales summary
- Receipt printing
- Cash drawer management

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Flutter SDK (for mobile development)
- Modern web browser

### Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

3. Start the server:
```bash
npm start
```