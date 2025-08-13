import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, FlatList, SafeAreaView, Alert } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';


// Enhanced countries data with calling codes
const countries = [
  { id: '1', name: 'United States', code: '+1' },
  { id: '2', name: 'United Kingdom', code: '+44' },
  { id: '3', name: 'Canada', code: '+1' },
  { id: '4', name: 'Australia', code: '+61' },
  { id: '5', name: 'Germany', code: '+49' },
  { id: '6', name: 'France', code: '+33' },
  { id: '7', name: 'India', code: '+91' },
  { id: '8', name: 'Japan', code: '+81' },
  { id: '9', name: 'United Arab Emirates', code: '+971' },
];

// Create Database Connection with Client
const SUPABASE_URL = "https://scohmflnytjpdxrgoxyg.supabase.co";
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjb2htZmxueXRqcGR4cmdveHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyMjcyNjYsImV4cCI6MjA1MzgwMzI2Nn0.04_6iQV1nNWDWaCThOew00j-Sxw6FRRpX6_YtRPail8";
const supabase = createClient(SUPABASE_URL, API_KEY);

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    nationality: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCountries, setFilteredCountries] = useState(countries);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');

  const searchCountries = (query) => {
    setSearchQuery(query);
    const filtered = countries.filter(country =>
      country.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCountries(filtered);
  };

  const selectCountry = (country) => {
    setFormData({ 
      ...formData, 
      nationality: country.name,
      phone: country.code // Set the country code as prefix
    });
    setSelectedCountryCode(country.code);
    setModalVisible(false);
  };

  const validateForm = () => {
    let newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Nationality validation
    if (!formData.nationality) {
      newErrors.nationality = 'Nationality is required';
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone === selectedCountryCode) {
      newErrors.phone = 'Please enter phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (text) => {
    // If no country is selected, don't allow phone input
    if (!selectedCountryCode) {
      Alert.alert('Select Country', 'Please select your nationality first');
      return;
    }

    // If user is trying to modify the country code, prevent it
    if (!text.startsWith(selectedCountryCode)) {
      text = selectedCountryCode;
    }

    setFormData({ ...formData, phone: text });
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const { data, error } = await supabase.from("users").insert([
          {
            username: formData.username,
            email: formData.email,
            nationality: formData.nationality,
            phone: formData.phone,
          }
        ]);
  
        if (error) {
          Alert.alert("Error", error.message);
        } else {
          Alert.alert("Success", "User registered successfully!");
          console.log('Form submitted:', formData);
          navigation.navigate("Camera");
        }
      } catch (err) {
        console.error("Error saving to Supabase:", err);
      }
    }

    // if (validateForm()) {
    //   console.log('Form submitted:', formData);
    //   navigation.navigate('Camera');
    // } else {
    //   Alert.alert('Error', 'Please fill all required fields correctly');
    // }


  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Register</Text>
        
        <View style={styles.formContainer}>
          {/* Username Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username*</Text>
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              placeholder="Enter your username"
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}
          </View>

          {/* Email Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email*</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Nationality Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nationality*</Text>
            <TouchableOpacity
              style={[styles.dropdownButton, errors.nationality && styles.inputError]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={formData.nationality ? styles.dropdownText : styles.placeholderText}>
                {formData.nationality || 'Select your nationality'}
              </Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
            {errors.nationality && <Text style={styles.errorText}>{errors.nationality}</Text>}
          </View>

          {/* Phone Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone*</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="Select nationality first"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={handlePhoneChange}
              editable={!!selectedCountryCode}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Country Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search countries..."
                value={searchQuery}
                onChangeText={searchCountries}
              />
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryItem}
                  onPress={() => selectCountry(item)}
                >
                  <Text style={styles.countryText}>{item.name} ({item.code})</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginTop: 4,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  dropdownArrow: {
    fontSize: 14,
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: '500',
  },
  countryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  countryText: {
    fontSize: 16,
    color: '#333',
  },
});

export default RegisterScreen;