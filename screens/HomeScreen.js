import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const buttonScale = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Abstract shapes for visual interest */}
      <View style={styles.shape1} />
      <View style={styles.shape2} />
      
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.descriptionText}>
            Experience the feature of Video Booth with Lazulite Technology Services.

          </Text>

          {/* <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('TextToQR')}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.buttonText}>Text To QR</Text>
            </TouchableOpacity> */}
        </View>

        <View style={styles.buttonContainer}>
          <Animated.View 
            style={[
              styles.buttonWrapper,
              { transform: [{ scale: buttonScale }] }
            ]}
          >
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => navigation.navigate('Register')}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.termsText}>
            By registering, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  shape1: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: '#F8F9FF',
    transform: [{ rotate: '45deg' }],
  },
  shape2: {
    position: 'absolute',
    bottom: -height * 0.15,
    left: -width * 0.25,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: '#F0F2FF',
    transform: [{ rotate: '-30deg' }],
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingTop: height * 0.1,
    paddingBottom: height * 0.05,
  },
  headerContainer: {
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 18,
    color: '#666666',
    lineHeight: 26,
    maxWidth: '80%',
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  buttonWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  registerButton: {
    backgroundColor: '#000000',
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  termsText: {
    fontSize: 13,
    color: '#999999',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default HomeScreen;