/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

//@ts-nocheck

import React, {useState} from 'react';
import {View, TextInput, Button, Alert} from 'react-native';
import RNFS from 'react-native-fs';
import * as ytdl from 'react-native-ytdl';
import {request, PERMISSIONS} from 'react-native-permissions';

function App(): JSX.Element {
  const [videoUrl, setVideoUrl] = useState('');

  const handleDownload = async () => {
    try {
      // Request storage permission
      const permissionResult = await request(
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      );
      if (permissionResult !== 'granted') {
        throw new Error('Storage permission not granted');
      }

      // Parse YouTube video URL
      const videoInfo = await ytdl.getBasicInfo(videoUrl);
      const audioFormats = ytdl.filterFormats(videoInfo.formats, 'audioonly');
      const audioUrl = audioFormats[0].url; // Assuming the first audio format is the desired one

      // Create a download task
      const downloadDest = `${RNFS.ExternalDirectoryPath}/${videoInfo.title}.mp3`;
      const options = {
        fromUrl: audioUrl,
        toFile: downloadDest,
      };
      const task = RNFS.downloadFile(options);

      // Start the download task
      task.promise.then(() => {
        Alert.alert(
          'Download completed',
          `The audio has been saved to ${downloadDest}`,
        );
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Enter YouTube video URL"
        value={videoUrl}
        onChangeText={setVideoUrl}
      />
      <Button title="Download Audio" onPress={handleDownload} />
    </View>
  );
}

export default App;
