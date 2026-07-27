// src/screens/RegisterStep2Screen.tsx
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
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import { AuthContext } from '../../context/authContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../config/colors';
import { fontSizes, fontWeights } from '../../config/typography';
import RegisterIllustration from '../../components/RegisterIllustration';

const RegisterStep2Screen = ({ navigation, route }) => {
  const { firstName = '', lastName = '', email = '', username = '' } = route.params || {};
  
  // Professional Information (Screen 2)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [branch, setBranch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation states
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    jobRole: '',
    companyName: '',
    branch: '',
  });

  // importing register function from AuthContext
  const { register } = useContext(AuthContext);

  const branches = [
    'Select Branch',
    'Technology',
    'Marketing', 
    'Sales',
    'Human Resources',
    'Finance',
    'Operations',
    'Customer Service',
    'Research & Development',
    'Quality Assurance',
    'Other'
  ];

  const validatePassword = (pwd: string) => {
    if (!pwd) {
      return 'Password is required';
    }
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(pwd)) {
      return 'Password must contain uppercase, lowercase, and number';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPwd: string, pwd: string) => {
    if (!confirmPwd) {
      return 'Please confirm your password';
    }
    if (confirmPwd !== pwd) {
      return 'Passwords do not match';
    }
    return '';
  };

  const validateJobRole = (role: string) => {
    if (!role.trim()) {
      return 'Job role is required';
    }
    if (role.length < 2) {
      return 'Job role must be at least 2 characters';
    }
    return '';
  };

  const validateCompanyName = (name: string) => {
    if (!name.trim()) {
      return 'Company name is required';
    }
    if (name.length < 2) {
      return 'Company name must be at least 2 characters';
    }
    return '';
  };

  const validateBranch = (branchValue: string) => {
    if (!branchValue || branchValue === 'Select Branch') {
      return 'Please select a branch';
    }
    return '';
  };

  const validateField = (field: string, value: string, compareValue?: string) => {
    let error = '';
    switch (field) {
      case 'password':
        error = validatePassword(value);
        break;
      case 'confirmPassword':
        error = validateConfirmPassword(value, compareValue || password);
        break;
      case 'jobRole':
        error = validateJobRole(value);
        break;
      case 'companyName':
        error = validateCompanyName(value);
        break;
      case 'branch':
        error = validateBranch(value);
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error }));
    return error === '';
  };

  const handleRegister = async () => {
    const isPasswordValid = validateField('password', password);
    const isConfirmPasswordValid = validateField('confirmPassword', confirmPassword);
    const isJobRoleValid = validateField('jobRole', jobRole);
    const isCompanyNameValid = validateField('companyName', companyName);
    const isBranchValid = validateField('branch', branch);

    if (isPasswordValid && isConfirmPasswordValid && isJobRoleValid && isCompanyNameValid && isBranchValid) {
      setIsLoading(true);
      try {
        await register(
          firstName,
          lastName, 
          username,
          email,
          password
        );
        
        Alert.alert(
          'Registration Successful!',
          'Your account has been created successfully. You can now sign in.',
          [
            { 
              text: 'Sign In Now', 
              onPress: () => navigation.navigate('Login'),
              style: 'default'
            }
          ]
        );
      } catch (err: any) {
        Alert.alert(
          'Registration Failed',
          err.response?.data?.message || 'Something went wrong. Please try again.',
          [{ text: 'OK', style: 'default' }]
        );
      } finally {
        setIsLoading(false);
      }
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
            <RegisterIllustration step={2} />
            <Text style={styles.welcomeText}>Almost Done!</Text>
            <Text style={styles.subtitle}>Complete your professional profile</Text>
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, styles.progressActive]} />
              <View style={[styles.progressLine, styles.progressActive]} />
              <View style={[styles.progressDot, styles.progressActive]} />
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formContainer}>
            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password *</Text>
              <TextInput
                style={getInputStyle('password', password)}
                placeholder="Create a secure password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                autoCorrect={false}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) validateField('password', text);
                  if (confirmPassword && errors.confirmPassword) {
                    validateField('confirmPassword', confirmPassword, text);
                  }
                }}
                onBlur={() => validateField('password', password)}
                value={password}
              />
              {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
              <Text style={styles.helperText}>
                At least 8 characters with uppercase, lowercase, and number
              </Text>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput
                style={getInputStyle('confirmPassword', confirmPassword)}
                placeholder="Confirm your password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                autoCorrect={false}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) validateField('confirmPassword', text);
                }}
                onBlur={() => validateField('confirmPassword', confirmPassword)}
                value={confirmPassword}
              />
              {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
            </View>

            {/* Job Role Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Job Role *</Text>
              <TextInput
                style={getInputStyle('jobRole', jobRole)}
                placeholder="e.g. Software Developer, Marketing Manager"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={(text) => {
                  setJobRole(text);
                  if (errors.jobRole) validateField('jobRole', text);
                }}
                onBlur={() => validateField('jobRole', jobRole)}
                value={jobRole}
              />
              {errors.jobRole ? <Text style={styles.errorText}>{errors.jobRole}</Text> : null}
            </View>

            {/* Company Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Company Name *</Text>
              <TextInput
                style={getInputStyle('companyName', companyName)}
                placeholder="Enter your company name"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="words"
                autoCorrect={false}
                onChangeText={(text) => {
                  setCompanyName(text);
                  if (errors.companyName) validateField('companyName', text);
                }}
                onBlur={() => validateField('companyName', companyName)}
                value={companyName}
              />
              {errors.companyName ? <Text style={styles.errorText}>{errors.companyName}</Text> : null}
            </View>

            {/* Branch Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Branch/Department *</Text>
              <View style={[
                getInputStyle('branch', branch === 'Select Branch' ? '' : branch),
                styles.pickerContainer
              ]}>
                <Picker
                  selectedValue={branch || 'Select Branch'}
                  style={styles.picker}
                  onValueChange={(itemValue) => {
                    setBranch(itemValue);
                    if (errors.branch) validateField('branch', itemValue);
                  }}
                >
                  {branches.map((branchOption, index) => (
                    <Picker.Item 
                      key={index} 
                      label={branchOption} 
                      value={branchOption}
                      color={branchOption === 'Select Branch' ? colors.textSecondary : colors.text}
                    />
                  ))}
                </Picker>
              </View>
              {errors.branch ? <Text style={styles.errorText}>{errors.branch}</Text> : null}
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={[styles.registerButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <LinearGradient
                colors={[colors.success, colors.primary]}
                style={styles.gradientButton}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
              >
                <Text style={styles.registerButtonText}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity 
              style={styles.backContainer}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>← Back to Previous Step</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    paddingVertical: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
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
    backgroundColor: colors.success,
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
  pickerContainer: {
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  picker: {
    height: 56,
    color: colors.text,
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
  registerButton: {
    height: 56,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  gradientButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  registerButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semiBold,
    color: colors.surface,
    textAlign: 'center',
  },
  backContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  backText: {
    fontSize: fontSizes.md,
    color: colors.primary,
    fontWeight: fontWeights.medium,
  },
});

export default RegisterStep2Screen;
