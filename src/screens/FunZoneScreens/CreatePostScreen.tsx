import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { createPost } from '../../services/eventService';
import CustomImagePicker from '../../components/ImagePicker';

interface Props {
  navigation: any;
  route: {
    params: {
      competitionId: string;
      competitionTitle: string;
      onPostCreated?: () => void;
    };
  };
}

const CreatePostScreen: React.FC<Props> = ({ navigation, route }) => {
  const { competitionId, competitionTitle, onPostCreated } = route.params;

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const handleImageSelected = (imageUri: string) => {
    setSelectedImage(imageUri);
    setShowImagePicker(false);
  };

  const selectImage = () => {
    setShowImagePicker(true);
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createPost(competitionId, {
        media_url: selectedImage,
        caption: caption.trim(),
      });

      if (result) {
        Alert.alert('Success', 'Post created successfully!', [
          {
            text: 'OK',
            onPress: () => {
              onPostCreated?.();
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Create Post</Text>
          <Text style={styles.headerSubtitle}>{competitionTitle}</Text>
        </View>
        <TouchableOpacity
          style={[styles.submitHeaderButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.submitHeaderButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Selection */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Select Photo</Text>
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <TouchableOpacity
                style={styles.changeImageButton}
                onPress={selectImage}
              >
                <Icon name="camera" size={20} color="#007AFF" />
                <Text style={styles.changeImageText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.selectImageButton} onPress={selectImage}>
              <Icon name="camera" size={32} color="#007AFF" />
              <Text style={styles.selectImageText}>Select Photo</Text>
              <Text style={styles.selectImageSubtext}>
                Choose from gallery or take a photo
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Caption Input */}
        <View style={styles.captionSection}>
          <Text style={styles.sectionTitle}>Caption</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption for your photo..."
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>
            {caption.length}/500 characters
          </Text>
        </View>

        {/* Competition Info */}
        <View style={styles.competitionInfo}>
          <Text style={styles.sectionTitle}>Competition</Text>
          <View style={styles.competitionCard}>
            <Icon name="trophy" size={24} color="#FFD700" />
            <View style={styles.competitionDetails}>
              <Text style={styles.competitionName}>{competitionTitle}</Text>
              <Text style={styles.competitionSubtext}>Photo Competition</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Image Picker Modal */}
      <CustomImagePicker
        visible={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onImageSelected={handleImageSelected}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  submitHeaderButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#8E8E93',
  },
  submitHeaderButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  selectImageButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
  },
  selectImageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginTop: 8,
  },
  selectImageSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  selectedImageContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
  },
  changeImageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  captionSection: {
    marginBottom: 24,
  },
  captionInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  characterCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 8,
  },
  competitionInfo: {
    marginBottom: 24,
  },
  competitionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  competitionDetails: {
    flex: 1,
  },
  competitionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  competitionSubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default CreatePostScreen;
