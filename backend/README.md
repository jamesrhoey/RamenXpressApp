# RamenXpress Backend API Documentation

This is the backend API for the RamenXpress application, built with Node.js, Express, and MongoDB.

## Setup Instructions

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

## API Endpoints

### Inventory Management

#### Get All Inventory Items
- **GET** `/api/inventory`
- **Response**: List of all inventory items
```json
[
  {
    "name": "Noodles",
    "stocks": 100,
    "units": "kg",
    "restocked": "2024-03-20T10:00:00.000Z",
    "status": "in stock"
  }
]
```

#### Add New Inventory Item
- **POST** `/api/inventory`
- **Body**:
```json
{
  "name": "Noodles",
  "stocks": 100,
  "units": "kg",
  "status": "in stock"
}
```

#### Update Inventory Quantity
- **PATCH** `/api/inventory/:id/quantity`
- **Body**:
```json
{
  "quantity": 50
}
```

#### Edit Inventory Item
- **PUT** `/api/inventory/:id`
- **Body**:
```json
{
  "name": "Noodles",
  "stocks": 150,
  "units": "kg",
  "status": "in stock"
}
```

#### Delete Inventory Item
- **DELETE** `/api/inventory/:id`

### Menu Management

#### Get All Menu Items
- **GET** `/api/menu`
- **Response**: List of all menu items sorted by category and name
```json
[
  {
    "name": "Tonkotsu Ramen",
    "price": 12.99,
    "category": "ramen",
    "ingredients": [
      {
        "inventoryItem": "Noodles",
        "quantity": 200
      },
      {
        "inventoryItem": "Broth",
        "quantity": 500
      }
    ]
  }
]
```

#### Get Menu Items by Category
- **GET** `/api/menu/category/:category`
- **Response**: List of menu items in the specified category
- **Categories Available**:
  - ramen
  - rice bowls
  - side dishes
  - sushi
  - party trays
  - add-ons
  - drinks

#### Create New Menu Item
- **POST** `/api/menu`
- **Body**:
```json
{
  "name": "test Ramen",
  "price": 350,
  "category": "ramen",
  "image": "imagesPATH",
  "ingredients": [
    { "inventoryItem": "Noodles", "quantity": 1 },
    { "inventoryItem": "Chashu Pork", "quantity": 2 },
    { "inventoryItem": "Ajitsuke Tamago", "quantity": 1 }
  ]
}
```

#### Edit Menu Item
- **PUT** `/api/menu/:id`
- **Body**:
```json
{
  "name": "Tonkotsu Ramen",
  "price": 13.99,
  "category": "ramen",
  "ingredients": [
    {
      "inventoryItem": "Noodles",
      "quantity": 200
    },
    {
      "inventoryItem": "Broth",
      "quantity": 500
    }
  ]
}
```

#### Delete Menu Item
- **DELETE** `/api/menu/:id`

### Sales Management

#### Place Order
- **POST** `/api/sales/order`
- **Body**:
```json
{
  "items": [
    {
      "menuId": "menu_id_here",
      "quantity": 2
    }
  ],
  "orderType": "dine-in",
  "paymentMethod": "gcash"
}
```

#### Get All Sales
- **GET** `/api/sales`
- **Response**: List of all sales records sorted by date

#### Get Sales by Date Range
- **GET** `/api/sales/range`
- **Query Parameters**:
  - startDate: YYYY-MM-DD
  - endDate: YYYY-MM-DD
- **Response**: List of sales records within the date range

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message describing the issue"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

## Data Models

### Inventory Item
```javascript
{
  name: String,      // required
  stocks: Number,    // required, min: 0
  units: String,     // required
  restocked: Date,   // default: Date.now
  status: String     // enum: ['in stock', 'low stock', 'out of stock']
}
```

### Menu Item
```javascript
{
  name: String,      // required
  price: Number,     // required
  category: String,  // required, enum: ['ramen', 'rice bowls', 'side dishes', 'sushi', 'party trays', 'add-ons', 'drinks']
  ingredients: [     // required
    {
      inventoryItem: String,  // required
      quantity: Number       // required
    }
  ]
}
```

### Sales Record
```javascript
{
  orderId: Number,   // required, unique
  items: [{          // required
    name: String,    // required
    price: Number,   // required
    quantity: Number,// required
    total: Number    // required
  }],
  total: Number,     // required
  orderType: String, // required, enum: ['takeout', 'dine-in']
  paymentMethod: String, // required, enum: ['gcash', 'paymaya', 'cash']
  orderDate: Date    // default: Date.now
}
```

## Dependencies

- express: Web framework
- mongoose: MongoDB object modeling
- dotenv: Environment variable management
- cors: Cross-origin resource sharing
- bcrypt: Password hashing 