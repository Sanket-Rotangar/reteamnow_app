// src/screens/RegisterScreen.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../context/authContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../config/colors';
import { fontSizes, fontWeights } from '../../config/typography';
import RegisterIllustration from '../../components/RegisterIllustration';

const RegisterScreen = ({ navigation }) => {
  // Basic Information (Screen 1)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');

  // Validation states
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
  });

  const validateFirstName = (name: string) => {
    if (!name.trim()) {
      return 'First name is required';
    }
    if (name.length < 2) {
      return 'First name must be at least 2 characters';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return 'First name can only contain letters and spaces';
    }
    return '';
  };

  const validateLastName = (name: string) => {
    if (!name.trim()) {
      return 'Last name is required';
    }
    if (name.length < 2) {
      return 'Last name must be at least 2 characters';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return 'Last name can only contain letters and spaces';
    }
    return '';
  };

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validateUsername = (username: string) => {
    if (!username.trim()) {
      return 'Username is required';
    }
    if (username.length < 3) {
      return 'Username must be at least 3 characters';
    }
    if (username.length > 20) {
      return 'Username cannot exceed 20 characters';
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return '';
  };

  const validateField = (field: string, value: string) => {
    let error = '';
    switch (field) {
      case 'firstName':
        error = validateFirstName(value);
        break;
      case 'lastName':
        error = validateLastName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'username':
        error = validateUsername(value);
        break;
    }

    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const handleContinue = () => {
    const isFirstNameValid = validateField('firstName', firstName);
    const isLastNameValid = validateField('lastName', lastName);
    const isEmailValid = validateField('email', email);
    const isUsernameValid = validateField('username', username);

    if (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isUsernameValid
    ) {
      // Navigate to step 2 with basic info
      navigation.navigate('RegisterStep2Screen', {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
      });
    }
  };

  const getInputStyle = (field: string, value: string) => {
    if (errors[field]) {
      return [styles.input, styles.inputError];
    }
    if (value.trim()) {
      return [styles.input, styles.inputFilled];
    }
    return styles.input;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <RegisterIllustration step={1} />
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitle}>
              Let's get started with your basic information
            </Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, styles.progressActive]} />
              <View style={[styles.progressLine, styles.progressActive]} />
              <View style={[styles.progressDot, styles.progressActive]} />
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* First Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name *</Text>
              <TextInput
                style={getInputStyle('firstName', firstName)}
                placeholder="Enter your first name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={text => {
                  setFirstName(text);
                  if (errors.firstName) validateField('firstName', text);
                }}
                onBlur={() => validateField('firstName', firstName)}
                value={firstName}
              />
              {errors.firstName ? (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              ) : null}
            </View>

            {/* Last Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name *</Text>
              <TextInput
                style={getInputStyle('lastName', lastName)}
                placeholder="Enter your last name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={text => {
                  setLastName(text);
                  if (errors.lastName) validateField('lastName', text);
                }}
                onBlur={() => validateField('lastName', lastName)}
                value={lastName}
              />
              {errors.lastName ? (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              ) : null}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={getInputStyle('email', email)}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                onChangeText={text => {
                  setEmail(text);
                  if (errors.email) validateField('email', text);
                }}
                onBlur={() => validateField('email', email)}
                value={email}
              />
              {errors.email ? (
                <Text style={styles.errorText}>{errors.email}</Text>
              ) : null}
            </View>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username *</Text>
              <TextInput
                style={getInputStyle('username', username)}
                placeholder="Choose a username"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={text => {
                  setUsername(text);
                  if (errors.username) validateField('username', text);
                }}
                onBlur={() => validateField('username', username)}
                value={username}
              />
              {errors.username ? (
                <Text style={styles.errorText}>{errors.username}</Text>
              ) : null}
              <Text style={styles.helperText}>
                Username will be used for your profile
              </Text>
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
            >
              <LinearGradient
                colors={[colors.primary, colors.secondary]}
                style={styles.gradientButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginContainer}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>
                Already have an account?{' '}
                <Text style={styles.loginLink}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  progressLine: {
    height: 2,
    width: 40,
    marginHorizontal: 4,
  },
  progressActive: {
    backgroundColor: colors.primary,
  },
  progressInactive: {
    backgroundColor: colors.border,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.medium,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: fontSizes.md,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  inputFilled: {
    borderColor: colors.success,
    backgroundColor: `${colors.success}05`,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: `${colors.error}05`,
  },
  errorText: {
    fontSize: fontSizes.sm,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  helperText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 4,
    marginLeft: 4,
  },
  continueButton: {
    height: 56,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: colors.surface,
    textAlign: 'center',
  },
  loginContainer: {
    alignItems: 'center',
    paddingVertical: 6,
    marginBottom: 24,
  },
  loginText: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  loginLink: {
    color: colors.primary,
    fontWeight: fontWeights.semiBold,
  },
});
