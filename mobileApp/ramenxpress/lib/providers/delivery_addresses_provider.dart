import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../models/delivery_address.dart';

class DeliveryAddressesProvider extends ChangeNotifier {
  final List<DeliveryAddress> _addresses = [];
  final _uuid = const Uuid();

  List<DeliveryAddress> get addresses => List.unmodifiable(_addresses);

  DeliveryAddress? get defaultAddress {
    try {
      return _addresses.firstWhere((address) => address.isDefault);
    } catch (e) {
      return _addresses.isNotEmpty ? _addresses.first : null;
    }
  }

  void addAddress({
    required String street,
    required String barangay,
    required String municipality,
    required String province,
    required String zipCode,
    bool isDefault = false,
  }) {
    if (isDefault) {
      // Remove default status from other addresses
      for (var i = 0; i < _addresses.length; i++) {
        if (_addresses[i].isDefault) {
          _addresses[i] = DeliveryAddress(
            id: _addresses[i].id,
            street: _addresses[i].street,
            barangay: _addresses[i].barangay,
            municipality: _addresses[i].municipality,
            province: _addresses[i].province,
            zipCode: _addresses[i].zipCode,
            isDefault: false,
          );
        }
      }
    }

    _addresses.add(
      DeliveryAddress(
        id: _uuid.v4(),
        street: street,
        barangay: barangay,
        municipality: municipality,
        province: province,
        zipCode: zipCode,
        isDefault: isDefault,
      ),
    );
    notifyListeners();
  }

  void updateAddress({
    required String id,
    required String street,
    required String barangay,
    required String municipality,
    required String province,
    required String zipCode,
    bool isDefault = false,
  }) {
    final index = _addresses.indexWhere((address) => address.id == id);
    if (index != -1) {
      if (isDefault) {
        // Remove default status from other addresses
        for (var i = 0; i < _addresses.length; i++) {
          if (_addresses[i].isDefault) {
            _addresses[i] = DeliveryAddress(
              id: _addresses[i].id,
              street: _addresses[i].street,
              barangay: _addresses[i].barangay,
              municipality: _addresses[i].municipality,
              province: _addresses[i].province,
              zipCode: _addresses[i].zipCode,
              isDefault: false,
            );
          }
        }
      }

      _addresses[index] = DeliveryAddress(
        id: id,
        street: street,
        barangay: barangay,
        municipality: municipality,
        province: province,
        zipCode: zipCode,
        isDefault: isDefault,
      );
      notifyListeners();
    }
  }

  void deleteAddress(String id) {
    _addresses.removeWhere((address) => address.id == id);
    notifyListeners();
  }

  void setDefaultAddress(String id) {
    for (var i = 0; i < _addresses.length; i++) {
      _addresses[i] = DeliveryAddress(
        id: _addresses[i].id,
        street: _addresses[i].street,
        barangay: _addresses[i].barangay,
        municipality: _addresses[i].municipality,
        province: _addresses[i].province,
        zipCode: _addresses[i].zipCode,
        isDefault: _addresses[i].id == id,
      );
    }
    notifyListeners();
  }
} 