/**
 * Profile Screen - Complete User Details
 *
 * Following the same 10-30-60 design rule with consistent UI
 * Features: Complete user profile information, edit navigation
 * Modern card-based layout with organized sections
 */

import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/authContext';
import { colors } from '../../config/colors';

const ProfileScreen = () => {
  const { userInfo } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleEditProfile = () => {
    (navigation as any).navigate('EditProfile');
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderDetailRow = (label: string, value: string | undefined, icon: string) => (
    <View style={styles.detailRow}>
      <View style={styles.detailLeft}>
        <View style={styles.detailIcon}>
          <Icon name={icon} size={18} color={colors.primary} />
        </View>
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value || 'Not provided'}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Icon name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Details</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
          <Icon name="pencil" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://img.freepik.com/premium-photo/hooded-hacker-logo-mascot_941097-24659.jpg',
              }}
              style={styles.avatar}
            />
            <View style={styles.statusBadge}>
              <View style={styles.statusIndicator} />
            </View>
          </View>
          <Text style={styles.userName}>
            {userInfo ? `${userInfo.fname} ${userInfo.lname}` : 'User Name'}
          </Text>
          <Text style={styles.userRole}>
            {userInfo?.jobRole || 'Employee'}
          </Text>
          <Text style={styles.userUsername}>
            @{userInfo?.username || 'username'}
          </Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👤 Personal Information</Text>
          <View style={styles.card}>
            {renderDetailRow('First Name', userInfo?.fname, 'person')}
            {renderDetailRow('Last Name', userInfo?.lname, 'person')}
            {renderDetailRow('Username', userInfo?.username, 'at')}
            {renderDetailRow('Email Address', userInfo?.email, 'mail')}
            {renderDetailRow('User ID', userInfo?._id, 'key')}
          </View>
        </View>

        {/* Professional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💼 Professional Information</Text>
          <View style={styles.card}>
            {renderDetailRow('Job Role', userInfo?.jobRole, 'briefcase')}
            {renderDetailRow('System Role', userInfo?.role, 'shield')}
            {renderDetailRow(
              'Team Titles', 
              userInfo?.teamTitle?.length ? userInfo.teamTitle.join(', ') : undefined, 
              'people'
            )}
            {renderDetailRow(
              'Workspaces', 
              userInfo?.workspaceName?.length ? userInfo.workspaceName.join(', ') : undefined, 
              'business'
            )}
          </View>
        </View>

        {/* Management Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Reporting Structure</Text>
          <View style={styles.card}>
            {renderDetailRow('Direct Manager', userInfo?.directManager, 'person-circle')}
            {renderDetailRow('Dotted Line Manager', userInfo?.dottedLineManager, 'person-circle-outline')}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.editProfileButton} onPress={handleEditProfile}>
            <Icon name="pencil" size={20} color={colors.surface} />
            <Text style={styles.editProfileText}>Edit Profile Information</Text>
          </TouchableOpacity>
        </View>
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

  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  profileHeaderCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: colors.border,
  },

  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },

  statusBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
  },

  statusIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
  },

  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },

  userRole: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 4,
  },

  userUsername: {
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

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },

  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${colors.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    flex: 1,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'right',
  },

  actionSection: {
    marginBottom: 40,
  },

  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  editProfileText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.surface,
    marginLeft: 8,
  },
});

export default ProfileScreen;
