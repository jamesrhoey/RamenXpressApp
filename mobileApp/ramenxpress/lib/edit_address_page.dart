import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/delivery_addresses_provider.dart';
import 'models/delivery_address.dart';

class EditAddressPage extends StatefulWidget {
  final DeliveryAddress? address;

  const EditAddressPage({super.key, this.address});

  @override
  State<EditAddressPage> createState() => _EditAddressPageState();
}

class _EditAddressPageState extends State<EditAddressPage> {
  final _formKey = GlobalKey<FormState>();
  final _streetController = TextEditingController();
  final _barangayController = TextEditingController();
  final _municipalityController = TextEditingController();
  final _provinceController = TextEditingController();
  final _zipCodeController = TextEditingController();
  bool _isDefault = false;

  @override
  void initState() {
    super.initState();
    if (widget.address != null) {
      _streetController.text = widget.address!.street;
      _barangayController.text = widget.address!.barangay;
      _municipalityController.text = widget.address!.municipality;
      _provinceController.text = widget.address!.province;
      _zipCodeController.text = widget.address!.zipCode;
      _isDefault = widget.address!.isDefault;
    }
  }

  @override
  void dispose() {
    _streetController.dispose();
    _barangayController.dispose();
    _municipalityController.dispose();
    _provinceController.dispose();
    _zipCodeController.dispose();
    super.dispose();
  }

  void _saveAddress() {
    if (_formKey.currentState!.validate()) {
      final provider = context.read<DeliveryAddressesProvider>();
      
      if (widget.address != null) {
        provider.updateAddress(
          id: widget.address!.id,
          street: _streetController.text,
          barangay: _barangayController.text,
          municipality: _municipalityController.text,
          province: _provinceController.text,
          zipCode: _zipCodeController.text,
          isDefault: _isDefault,
        );
      } else {
        provider.addAddress(
          street: _streetController.text,
          barangay: _barangayController.text,
          municipality: _municipalityController.text,
          province: _provinceController.text,
          zipCode: _zipCodeController.text,
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
        title: Text(widget.address == null ? 'Add New Address' : 'Edit Address'),
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
              TextFormField(
                controller: _streetController,
                decoration: const InputDecoration(
                  labelText: 'Street Address',
                  hintText: 'Enter your street address',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your street address';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _barangayController,
                decoration: const InputDecoration(
                  labelText: 'Barangay',
                  hintText: 'Enter your barangay',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your barangay';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _municipalityController,
                decoration: const InputDecoration(
                  labelText: 'Municipality/City',
                  hintText: 'Enter your municipality or city',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your municipality or city';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _provinceController,
                decoration: const InputDecoration(
                  labelText: 'Province',
                  hintText: 'Enter your province',
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your province';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _zipCodeController,
                decoration: const InputDecoration(
                  labelText: 'ZIP Code',
                  hintText: 'Enter your ZIP code',
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter your ZIP code';
                  }
                  if (!RegExp(r'^\d{4}$').hasMatch(value)) {
                    return 'Please enter a valid 4-digit ZIP code';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 24),
              SwitchListTile(
                title: const Text('Set as default address'),
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
                  onPressed: _saveAddress,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.deepOrange,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: Text(
                    widget.address == null ? 'Add Address' : 'Save Changes',
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