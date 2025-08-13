import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform, NativeModules, TouchableOpacity, Image, Dimensions, PermissionsAndroid, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//var RNFS = require("react-native-fs");
import RNFS from 'react-native-fs';
import 'react-native-url-polyfill/auto';
import axios from 'axios';


const { SdkEditorModule } = NativeModules;
const { width } = Dimensions.get('window');

const LICENSE_TOKEN = "Qk5CIMKNaiiVbLRc5fTaykz/ojcGB8xmSZE7LWCf59+vPLNb3t5pveWGWNBh/IZzAUrmWgYwiyNOpzQ6f4JKp4N+U6l1BRmFgx1uHCVlTs2rtDktp9Q4qLMPcVULRlgkHhvqeWbqhAjGXQn7mn6NZ/ERsbrnu91loGi+qbcu69dOpzRD6t+fSzjmrpHyjsf+5TqCcdsmfSiq/isuSaikbY2DdVBfXUpOOzwhbw9/0yYSWRjlAN5muOxPK0rYl6fvikR5dMjD0Bv8k6Kd8/WDXjNAMry+LLQwZ261aNTWQcDouIF/jCV5qRJfb50pxsvTmXVGWYyfhsua8OQFWZQ/03Ghj+euvtku54Wg/rDstO0U11NhYr/0Zf5AP+fwqeWhx8EZVmv1jZa/DlwT2HbzmR31cU8QCZJWsSI45N6/dzMFYwNqCpm++pxwj8m4/70g+0EJ6d6XK2tDqF3JF+/pFIYEpLucrUXCTU538jpxNQHnSNBQ7Ood5vn/McdG50C2FW98GgyEBBP1wdHiF6ihpSNk4sOT2gom0Jj1afgNcQYuJnrTloDLjzQCc7lXJQEgiM7KDQgMQp0EGHYKLxWLO6azEwbz03QqCn/6J0z3A+ML4C7WVQhJ9lfKFTlMM6qrcn/jJri1tEXClBiF4uLuIg=="

function initVideoEditorSDK() {
  SdkEditorModule.initVideoEditorSDK(LICENSE_TOKEN);
}

async function openVideoEditor() {
  initVideoEditorSDK();
  return await SdkEditorModule.openVideoEditor();
}

const imagePaths = [
  require('../assets/frame1.png'), // Image for Card 1
  require('../assets/frame2.png'), // Image for Card 2
  require('../assets/frame3.png'), // Image for Card 3
  require('../assets/frame4.png'), // Image for Card 4
  require('../assets/frame5.png'), // Image for Card 5
];

const selectedFrameImage = require('../assets/background.jpg');

async function saveImageToGallery(imagePath) {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to save images.',
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.error('Storage permission denied');
        return;
      }
    }

    const fileName = imagePath.split('/').pop();
    const destinationPath = `${RNFS.PicturesDirectoryPath}/${fileName}`;

    await RNFS.copyFile(imagePath, destinationPath);

    console.log(`Image saved to gallery: ${destinationPath}`);
  } catch (error) {
    console.error('Error saving image:', error);
  }
}


export default class CameraScreen extends Component  {
  constructor(props) {
    super(props);
    this.state = {
      errorText: '',
      selectedCard: null,
    };
  }

  handleVideoExport(response) {
    console.log("function called");
    console.log('Export completed successfully: video = ' + response?.videoUri + '; videoPreview = '
      + response?.previewUri);

      // Now upload the video to the server
    const videoUri = response?.videoUri;

    if (videoUri) {
      this.uploadVideo(videoUri);
    }
  }

  uploadVideo(videoUri) {
    // Define the URL to upload to
    const uploadUrl = 'http://15.185.43.17:8000/frost/upload-video/';

    // Check if the video URI is valid
    if (!videoUri) {
      Alert.alert('Error', 'No video file to upload');
      console.log('Error', 'No video file to upload');
      return;
    }

    // Create FormData to send the video as multipart/form-data
    const formData = new FormData();
    formData.append('video', {
      uri: `file://${videoUri}`,
      type: 'video/mp4',  // Assuming the file is MP4, adjust if necessary
      name: `video_${Date.now()}.mp4`, // Use current time for dynamic file name
    });

    // Send the POST request using axios
    axios.post(uploadUrl, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((response) => {
      if (response.status === 200) {
        const uploadedFileUrl = `${uploadUrl}${response.data.fileName}`;
        console.log("recieved", response.data); //gives filename
        const completeURL = `http://15.185.43.17:8000/frost/DownloadVideo?filename=${response.data}`;

        console.log("Final Download URL:", completeURL); // Log the final complete URL
        Alert.alert('Success', 'Video uploaded successfully');
        console.log('Success', 'Video uploaded successfully');

        this.props.navigation.navigate("TextToQR", { completeURL });
      } else {
        Alert.alert('Error', 'Failed to upload the video');
        console.log('Error', 'Failed to upload the video');
      }
    })
    .catch((error) => {
      console.error('Upload error', error);
      Alert.alert('Error', 'Failed to upload the video');
    });
  }

  handleSdkError(e) {
    console.log('handle sdk error = ' + e.code);

    var message = '';
    switch (e.code) {
      case 'ERR_SDK_NOT_INITIALIZED':
        message = 'Banuba Video Editor SDK is not initialized: license token is unknown or incorrect.\nPlease check your license token or contact Banuba';
        break;
      case 'ERR_SDK_EDITOR_LICENSE_REVOKED':
        message = 'License is revoked or expired. Please contact Banuba https://www.banuba.com/support';
        break;
      case 'ERR_MISSING_EXPORT_RESULT':
        message = 'Missing video export result!';
        break;
      case 'ERR_CODE_NO_HOST_CONTROLLER':
        message = "Host Activity or ViewController does not exist!";
        break;
      case 'ERR_VIDEO_EXPORT_CANCEL':
        message = "Video export is canceled";
        break;
      default:
        message = '';
        console.log(
        'Banuba ' +
          Platform.OS.toUpperCase() +
          ' Video Editor export video failed = ' +
            e,
          );
        break;
    }
    this.setState({ errorText: message });
  }

  handleCardPress = (cardId) => {
    this.setState({ selectedCard: cardId }, () => {
      // Show selection message
      console.log(`Frame: ${cardId} selected`);
      // Trigger video editor
      openVideoEditor()
        .then(response => this.handleVideoExport(response))
        .catch(e => this.handleSdkError(e));
        //this.props.navigation.navigate("TextToQR");
    });
  }

  // renderCard = (cardId) => {
  //   return (
  //     <TouchableOpacity
  //       key={cardId}
  //       style={[
  //         styles.card,
  //         this.state.selectedCard === cardId && styles.selectedCard
  //       ]}
  //       onPress={() => this.handleCardPress(cardId)}
  //     >
  //       <Image
  //         source={imagePaths[cardId - 1]} // Replace with your actual image source
  //         style={styles.cardImage}
  //       />
  //       <Text style={styles.cardText}>Frame {cardId}</Text>
  //     </TouchableOpacity>
  //   );
  // }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => openVideoEditor()
            .then(response => this.handleVideoExport(response))
            .catch(e => this.handleSdkError(e))}
        >
          <Text style={styles.buttonText}>Open Video Editor</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

