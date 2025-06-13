# RamenXpress Mobile App

A Flutter-based mobile application for a ramen restaurant, featuring menu browsing, ordering, and delivery management.

## Features

- **Menu Management**
  - Browse ramen menu items
  - View item details and customizations
  - Add items to cart with customizations

- **Cart System**
  - Add/remove items
  - Customize orders
  - View order summary
  - Calculate totals

- **Order Management**
  - Place orders for delivery or pickup
  - Track order status
  - View order history
  - Generate invoices

- **Delivery System**
  - Multiple delivery addresses
  - Set default delivery address
  - Delivery fee calculation
  - Delivery status tracking

- **Payment System**
  - Multiple payment methods (GCash, Maya)
  - Cash on Delivery option
  - Payment status tracking

- **User Profile**
  - Personal information management
  - Delivery address management
  - Payment method management
  - Order history

## Project Structure

```
lib/
├── models/              # Data models
│   ├── delivery_address.dart
│   ├── payment_method.dart
│   └── ...
├── providers/           # State management
│   ├── cart_provider.dart
│   ├── delivery_addresses_provider.dart
│   ├── order_history_provider.dart
│   ├── payment_methods_provider.dart
│   └── profile_provider.dart
├── screens/            # UI screens
│   ├── cart_page.dart
│   ├── delivery_addresses_page.dart
│   ├── edit_address_page.dart
│   ├── edit_payment_method_page.dart
│   ├── edit_profile_page.dart
│   ├── invoice_page.dart
│   ├── menu_page.dart
│   ├── order_history_page.dart
│   ├── payment_page.dart
│   └── profile_page.dart
└── main.dart           # App entry point
```

## Getting Started

### Prerequisites

- Flutter SDK (latest stable version)
- Dart SDK (latest stable version)
- Android Studio / VS Code with Flutter extensions
- Android SDK / Xcode (for iOS development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ramenxpress.git
```

2. Navigate to the project directory:
```bash
cd ramenxpress
```

3. Install dependencies:
```bash
flutter pub get
```

4. Run the app:
```bash
flutter run
```

## Dependencies

- `flutter`: The core Flutter framework
- `provider`: For state management
- `intl`: For date and number formatting
- Additional dependencies can be found in `pubspec.yaml`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Flutter team for the amazing framework
- All contributors who have helped shape this project
