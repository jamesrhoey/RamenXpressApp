import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/payment_methods_provider.dart';
import 'models/payment_method.dart';

class EditPaymentMethodPage extends StatefulWidget {
  final PaymentMethod? paymentMethod;

  const EditPaymentMethodPage({super.key, this.paymentMethod});

  @override
  State<EditPaymentMethodPage> createState() => _EditPaymentMethodPageState();
}

class _EditPaymentMethodPageState extends State<EditPaymentMethodPage> {
  final _formKey = GlobalKey<FormState>();
  PaymentType _selectedType = PaymentType.gcash;
  final _titleController = TextEditingController();
  final _accountNumberController = TextEditingController();
  bool _isDefault = false;

  @override
  void initState() {
    super.initState();
    if (widget.paymentMethod != null) {
      _selectedType = widget.paymentMethod!.type;
      _titleController.text = widget.paymentMethod!.title;
      _accountNumberController.text = widget.paymentMethod!.accountNumber;
      _isDefault = widget.paymentMethod!.isDefault;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _accountNumberController.dispose();
    super.dispose();
  }

  void _savePaymentMethod() {
    if (_formKey.currentState!.validate()) {
      final provider = context.read<PaymentMethodsProvider>();
      
      if (widget.paymentMethod != null) {
        provider.updatePaymentMethod(
          PaymentMethod(
            id: widget.paymentMethod!.id,
            type: _selectedType,
            title: _titleController.text,
            accountNumber: _accountNumberController.text,
            isDefault: _isDefault,
          ),
        );
      } else {
        provider.addPaymentMethod(
          type: _selectedType,
          title: _titleController.text,
          accountNumber: _accountNumberController.text,
          isDefault: _isDefault,
        );
      }

      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.paymentMethod == null ? 'Add Payment Method' : 'Edit Payment Method'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Payment Type',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              SegmentedButton<PaymentType>(
                segments: const [
                  ButtonSegment<PaymentType>(
                    value: PaymentType.gcash,
                    label: Text('GCash'),
                    icon: Icon(Icons.account_balance_wallet),
                  ),
                  ButtonSegment<PaymentType>(
                    value: PaymentType.maya,
                    label: Text('Maya'),
                    icon: Icon(Icons.account_balance),
                  ),
                ],
                selected: {_selectedType},
                onSelectionChanged: (Set<PaymentType> selected) {
                  setState(() {
                    _selectedType = selected.first;
                  });
                },
                style: ButtonStyle(
                  backgroundColor: MaterialStateProperty.resolveWith<Color>(
                    (Set<MaterialState> states) {
                      if (states.contains(MaterialState.selected)) {
                        return Colors.deepOrange.withAlpha((0.08 * 255).toInt());
                      }
                      return Colors.grey[50]!;
                    },
                  ),
                  foregroundColor: MaterialStateProperty.resolveWith<Color>(
                    (Set<MaterialState> states) {
                      if (states.contains(MaterialState.selected)) {
                        return Colors.deepOrange;
                      }
                      return Colors.grey;
                    },
                  ),
                ),
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Account Name',
                  hintText: 'Enter account holder name',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter account holder name';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _accountNumberController,
                decoration: const InputDecoration(
                  labelText: 'Account Number',
                  hintText: 'Enter account number',
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter account number';
                  }
                  if (!RegExp(r'^\d{11}$').hasMatch(value)) {
                    return 'Please enter a valid 11-digit account number';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              SwitchListTile(
                title: const Text('Set as default payment method'),
                value: _isDefault,
                onChanged: (value) {
                  setState(() {
                    _isDefault = value;
                  });
                },
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _savePaymentMethod,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepOrange,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    widget.paymentMethod == null ? 'Add Payment Method' : 'Save Changes',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
} 