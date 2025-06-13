import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import '../models/payment_method.dart';

class PaymentMethodsProvider extends ChangeNotifier {
  final List<PaymentMethod> _paymentMethods = [];
  final _uuid = const Uuid();

  List<PaymentMethod> get paymentMethods => _paymentMethods;

  PaymentMethod? get defaultPaymentMethod {
    try {
      return _paymentMethods.firstWhere((method) => method.isDefault);
    } catch (e) {
      return null;
    }
  }

  void addPaymentMethod({
    required PaymentType type,
    required String title,
    required String accountNumber,
    bool isDefault = false,
  }) {
    if (isDefault) {
      // Remove default status from other methods
      for (var method in _paymentMethods) {
        if (method.isDefault) {
          _paymentMethods[_paymentMethods.indexOf(method)] = PaymentMethod(
            id: method.id,
            type: method.type,
            title: method.title,
            accountNumber: method.accountNumber,
            isDefault: false,
          );
        }
      }
    }

    _paymentMethods.add(PaymentMethod(
      id: _uuid.v4(),
      type: type,
      title: title,
      accountNumber: accountNumber,
      isDefault: isDefault,
    ));

    notifyListeners();
  }

  void updatePaymentMethod(PaymentMethod method) {
    final index = _paymentMethods.indexWhere((m) => m.id == method.id);
    if (index != -1) {
      _paymentMethods[index] = method;
      notifyListeners();
    }
  }

  void deletePaymentMethod(String id) {
    _paymentMethods.removeWhere((method) => method.id == id);
    notifyListeners();
  }

  void setDefaultPaymentMethod(String id) {
    for (var i = 0; i < _paymentMethods.length; i++) {
      final method = _paymentMethods[i];
      _paymentMethods[i] = PaymentMethod(
        id: method.id,
        type: method.type,
        title: method.title,
        accountNumber: method.accountNumber,
        isDefault: method.id == id,
      );
    }
    notifyListeners();
  }
} 