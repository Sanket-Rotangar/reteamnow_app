/**
 * CUSTOM IMAGE PICKER COMPONENT - Reteamnow App
 * 
 * Reusable image picker modal for event photo uploads
 * 
 * Features:
 * - Clean modal interface with camera/gallery options
 * - Image compression and quality optimization
 * - Error handling for permissions and failures
 * - Consistent design with app theme
 * 
 * Usage: Event photo uploads, profile pictures, etc.
 */

import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { 
  launchCamera, 
  launchImageLibrary, 
  MediaType, 
  ImagePickerResponse 
} from 'react-native-image-picker';

// ===== INTERFACES =====
interface ImagePickerProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (imageUri: string) => void;
}

const { width } = Dimensions.get('window');

const CustomImagePicker: React.FC<ImagePickerProps> = ({
  visible,
  onClose,
  onImageSelected,
}) => {
  
  // ===== IMAGE PICKER OPTIONS =====
  const imagePickerOptions = {
    mediaType: 'photo' as MediaType,
    includeBase64: false,
    maxHeight: 2000,
    maxWidth: 2000,
    quality: 0.8 as any,
  };

  // ===== CAMERA FUNCTIONS =====
  
  /**
   * Handle camera capture
   */
  const openCamera = () => {
    launchCamera(imagePickerOptions, (response: ImagePickerResponse) => {
      handleImagePickerResponse(response, 'Camera');
    });
  };

  /**
   * Handle gallery selection
   */
  const openGallery = () => {
    launchImageLibrary(imagePickerOptions, (response: ImagePickerResponse) => {
      handleImagePickerResponse(response, 'Gallery');
    });
  };

  /**
   * Process image picker response
   * @param response - Response from image picker
   * @param source - Source type (Camera/Gallery) for error messages
   */
  const handleImagePickerResponse = (
    response: ImagePickerResponse, 
    source: string
  ) => {
    // Handle user cancellation
    if (response.didCancel) {
      return;
    }
    
    // Handle errors
    if (response.errorMessage) {
      console.error(`${source} error:`, response.errorMessage);
      Alert.alert(
        'Error',
        `Failed to ${source.toLowerCase()} image. Please try again.`
      );
      return;
    }
    
    // Handle successful selection
    if (response.assets && response.assets[0] && response.assets[0].uri) {
      onImageSelected(response.assets[0].uri);
      onClose();
    } else {
      Alert.alert(
        'Error',
        'No image was selected. Please try again.'
      );
    }
  };


  // ===== RENDER =====
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Upload Photo</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Icon name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Choose how you'd like to add your photo
          </Text>

          {/* Options */}
          <View style={styles.options}>
            {/* Camera Option */}
            <TouchableOpacity
              style={styles.option}
              activeOpacity={0.8}
              onPress={openCamera}
            >
              <View style={styles.optionIconCamera}>
                <Icon name="camera" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.optionTitle}>Take Photo</Text>
              <Text style={styles.optionSubtitle}>
                Use camera to capture moment
              </Text>
            </TouchableOpacity>

            {/* Gallery Option */}
            <TouchableOpacity
              style={styles.option}
              activeOpacity={0.8}
              onPress={openGallery}
            >
              <View style={styles.optionIconGallery}>
                <Icon name="images" size={32} color="#FFFFFF" />
              </View>
              <Text style={styles.optionTitle}>Choose from Gallery</Text>
              <Text style={styles.optionSubtitle}>
                Select from your photos
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ===== STYLES =====
const styles = StyleSheet.create({
  // Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // Modal Content
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width - 40,
    maxWidth: 400,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },

  // Header Section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 8,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Subtitle
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
    paddingHorizontal: 24,
    marginBottom: 24,
    textAlign: 'center',
  },

  // Options Section
  options: {
    paddingHorizontal: 24,
  },

  option: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },

  // Option Icons
  optionIconCamera: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#007AFF',
  },

  optionIconGallery: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    backgroundColor: '#34C759',
  },

  // Option Text
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    fontFamily: 'SF Pro Display',
    marginBottom: 4,
  },

  optionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
    textAlign: 'center',
  },

  // Footer Section
  footer: {
    padding: 24,
  },

  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    fontFamily: 'SF Pro Text',
  },
});

export default CustomImagePicker;
