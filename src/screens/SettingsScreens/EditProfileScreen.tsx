/**
 * Edit Profile Screen - User Information Editor
 *
 * Following the same 10-30-60 design rule with consistent UI
 * Features: Editable form fields, validation, save functionality
 * Modern form layout with organized sections
 */

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { AuthContext } from '../../context/authContext';
import { colors } from '../../config/colors';

const EditProfileScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const navigation = useNavigation();

  // Form state
  const [formData, setFormData] = useState({
    fname: userInfo?.fname || '',
    lname: userInfo?.lname || '',
    username: userInfo?.username || '',
    email: userInfo?.email || '',
    jobRole: userInfo?.jobRole || '',
    teamTitle: userInfo?.teamTitle?.join(', ') || '',
    workspaceName: userInfo?.workspaceName?.join(', ') || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleGoBack = () => {
    if (hasUnsavedChanges()) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          { text: 'Stay', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const hasUnsavedChanges = () => {
    const originalData = {
      fname: userInfo?.fname || '',
      lname: userInfo?.lname || '',
      username: userInfo?.username || '',
      email: userInfo?.email || '',
      jobRole: userInfo?.jobRole || '',
      teamTitle: userInfo?.teamTitle?.join(', ') || '',
      workspaceName: userInfo?.workspaceName?.join(', ') || '',
    };

    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fname.trim()) {
      newErrors.fname = 'First name is required';
    }
    if (!formData.lname.trim()) {
      newErrors.lname = 'Last name is required';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the errors before saving',
      });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement API call to save profile data
      // Prepare data for API - convert comma-separated strings to arrays
      const updatedData = {
        ...formData,
        teamTitle: formData.teamTitle.split(',').map(item => item.trim()).filter(item => item),
        workspaceName: formData.workspaceName.split(',').map(item => item.trim()).filter(item => item),
      };

      // For now, show success message
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been successfully updated! ✅',
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Failed to update profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormField = (
    label: string,
    field: string,
    icon: string,
    placeholder: string,
    multiline: boolean = false
  ) => (
    <View style={styles.formField}>
      <View style={styles.fieldHeader}>
        <Icon name={icon} size={18} color={colors.primary} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <TextInput
        style={[styles.textInput, multiline && styles.multilineInput, errors[field] && styles.errorInput]}
        value={formData[field as keyof typeof formData]}
        onChangeText={(value) => handleInputChange(field, value)}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Icon name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity 
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <Icon name="hourglass" size={20} color={colors.surface} />
          ) : (
            <Icon name="checkmark" size={20} color={colors.surface} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://img.freepik.com/premium-photo/hooded-hacker-logo-mascot_941097-24659.jpg',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Icon name="camera" size={18} color={colors.surface} />
            </TouchableOpacity>
          </View>
          <Text style={styles.avatarText}>Tap to change profile picture</Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Personal Information</Text>
          <View style={styles.card}>
            {renderFormField('First Name', 'fname', 'person', 'Enter your first name')}
            {renderFormField('Last Name', 'lname', 'person', 'Enter your last name')}
            {renderFormField('Username', 'username', 'at', 'Enter your username')}
            {renderFormField('Email Address', 'email', 'mail', 'Enter your email address')}
          </View>
        </View>

        {/* Professional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 Professional Information</Text>
          <View style={styles.card}>
            {renderFormField('Job Role', 'jobRole', 'briefcase', 'Enter your job title')}
            {renderFormField('Team Titles', 'teamTitle', 'people', 'Enter team names (comma separated)', true)}
            {renderFormField('Workspaces', 'workspaceName', 'business', 'Enter workspace names (comma separated)', true)}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={[styles.saveProfileButton, isLoading && styles.saveProfileButtonDisabled]} 
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <Icon name="hourglass" size={20} color={colors.surface} />
          ) : (
            <Icon name="save" size={20} color={colors.surface} />
          )}
          <Text style={styles.saveProfileText}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonDisabled: {
    backgroundColor: colors.textLight,
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  avatarSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },

  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },

  avatarText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    marginLeft: 4,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: colors.border,
  },

  formField: {
    marginBottom: 20,
  },

  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 8,
  },

  textInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },

  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },

  errorInput: {
    borderColor: colors.danger,
  },

  errorText: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.danger,
    marginTop: 4,
    marginLeft: 4,
  },

  saveProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  saveProfileButtonDisabled: {
    backgroundColor: colors.textLight,
    shadowOpacity: 0.1,
  },

  saveProfileText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
    marginLeft: 8,
  },

  bottomPadding: {
    height: 40,
  },
});

export default EditProfileScreen;
