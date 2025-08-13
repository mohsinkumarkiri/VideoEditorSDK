// import React, {useRef, useState} from 'react';
// import { View, Text, Button, Platform, PermissionsAndroid, TextInput, StyleSheet } from 'react-native';
// import QRCode from 'react-native-qrcode-svg';
// import ViewShot from 'react-native-view-shot';
// import RNFS from 'react-native-fs';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import 'text-encoding';




// const TextToQRScreen = () => {
//     const [QRcode, setQRCode] = useState('default');
//     const qrCodeRef = useRef(null);
//     const viewShotRef = useRef(null);

//     const handleDownloadQRCode = async () => {
//         try{
//             if(Platform.OS == 'android'){
//                 const granted = await PermissionsAndroid.request(
//                     PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
//                 )
//                 if (granted !== PermissionsAndroid.RESULTS.GRANTED){
//                     alert('Permission Denied')
//                 }
//             }

//             await viewShotRef.current.capture().then(async (uri) => {
//                 const path = RNFS.PicturesDirectoryPath + '/' + QRCode + '.png';
//                 await RNFS.moveFile(uri, path);
//                 await RNFS.scanFile(path);
//                 alert('QR Code has been downloaded successfully!')
//             })
//         } catch(error){
//             console.log(error)
//         }
//     }


//   return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0}}>
//             <QRCode ref={qrCodeRef} value={QRcode ? QRcode : 'default'} size={200} color='black' backgroundColor='white'/>
//         </ViewShot>
        
//         <TextInput style={{backgroundColor: 'lightgrey', width: '90%', margin:30}} onChangeText={(text) => setQRCode(text)}/>
//         <Button title="Download QR Code" onPress={handleDownloadQRCode} />
//       </View>
//   );
// };


// export default TextToQRScreen;



 import React, {useRef, useState} from 'react';
 import { View, Text, Button, Platform, PermissionsAndroid, TextInput, StyleSheet, DevSettings } from 'react-native';
 import QRCode from 'react-native-qrcode-svg';
 import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
 import { SafeAreaView } from 'react-native-safe-area-context';
 import 'text-encoding'
 import { TouchableOpacity } from 'react-native';
 import { useNavigation, CommonActions } from '@react-navigation/native';

const TextToQRScreen = ({ route }) => {

    const navigation = useNavigation();
  // Get the completeURL from navigation params
  const completeURL = route?.params?.completeURL || 'https://www.lazulite.ae';

  const resetApp = () =>{
    navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Home' }], // Change 'HomeScreen' to your actual first screen name
        })
      );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Thank You!</Text>
      <Text style={styles.subText}>Download your video here:</Text>
      <QRCode value={completeURL} size={200} />

      {/* Minimalist Home Button */}
      <TouchableOpacity style={styles.button} onPress={resetApp}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 100,
  },
  button: {
    marginTop: 40,
    backgroundColor: '#007AFF', // iOS blue color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3, // Android shadow
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default TextToQRScreen;

