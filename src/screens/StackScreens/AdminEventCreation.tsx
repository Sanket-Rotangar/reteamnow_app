/**
 * Admin Event Creation Component
 * 
 * This is a simple admin interface for creating events (for backend testing purposes)
 * In production, this would be part of an admin dashboard or web interface
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { eventPhotosAPI } from '../services/eventPhotosAPI';

interface Props {
  navigation: any;
}

const AdminEventCreation: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    reminder: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Event title is required');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Event description is required');
      return false;
    }
    return true;
  };

  const handleCreateEvent = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim() || undefined,
        reminder: formData.reminder ? new Date(formData.reminder).toISOString() : undefined,
      };

      const response = await eventPhotosAPI.admin.createEvent(eventData);

      if (response.success) {
        Alert.alert(
          'Success',
          'Event created successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  title: '',
                  description: '',
                  location: '',
                  reminder: '',
                });
                // Navigate back or to event details
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to create event');
      }
    } catch (error) {
      console.error('Create event error:', error);
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create event'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Event</Text>
        <Text style={styles.subtitle}>Admin Panel - Event Photo Competition</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Event Title *</Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
            placeholder="e.g., Company Annual Picnic 2025"
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Describe the event and photo competition..."
            multiline
            numberOfLines={4}
            maxLength={500}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location (Optional)</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            placeholder="e.g., Central Park Pavilion"
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reminder Date (Optional)</Text>
          <TextInput
            style={styles.input}
            value={formData.reminder}
            onChangeText={(value) => handleInputChange('reminder', value)}
            placeholder="YYYY-MM-DD HH:MM (e.g., 2025-08-25 10:00)"
          />
          <Text style={styles.helpText}>
            Format: YYYY-MM-DD HH:MM (24-hour format)
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.createButton, loading && styles.buttonDisabled]}
          onPress={handleCreateEvent}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.createButtonText}>Create Event</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>📋 Event Creation Guidelines</Text>
        <Text style={styles.infoText}>
          • Events will be visible to all users immediately{'\n'}
          • Users can upload photos and participate in competitions{'\n'}
          • Leaderboards are automatically generated based on engagement{'\n'}
          • Events can be updated or cancelled after creation
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },

  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
  },

  subtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
    marginTop: 4,
  },

  form: {
    padding: 20,
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Text',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'SF Pro Text',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    color: '#1D1D1F',
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  helpText: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
    marginTop: 4,
    fontStyle: 'italic',
  },

  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'SF Pro Text',
  },

  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#8E8E93',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },

  infoSection: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 8,
  },

  infoText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
    lineHeight: 20,
  },
});

export default AdminEventCreation;
