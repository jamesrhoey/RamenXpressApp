import 'package:flutter/material.dart';

class ProfileProvider extends ChangeNotifier {
  String _name = 'John Doe';
  String _email = 'john.doe@example.com';
  String _phone = '+63 912 345 6789';
  String _profileImage = 'assets/adminPIC.png';

  // Getters
  String get name => _name;
  String get email => _email;
  String get phone => _phone;
  String get profileImage => _profileImage;

  // Update profile
  Future<void> updateProfile({
    String? name,
    String? email,
    String? phone,
    String? profileImage,
  }) async {
    if (name != null) _name = name;
    if (email != null) _email = email;
    if (phone != null) _phone = phone;
    if (profileImage != null) _profileImage = profileImage;
    
    notifyListeners();
  }

  // Logout
  Future<void> logout() async {
    // Clear profile data
    _name = '';
    _email = '';
    _phone = '';
    _profileImage = 'assets/adminPIC.png';
    
    notifyListeners();
  }
} 