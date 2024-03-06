import { View, Text, Platform, PermissionsAndroid, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {
  createAgoraRtcEngine,
  ClientRoleType,
  IRtcEngine,
  ChannelProfileType,
} from 'react-native-agora'
import { customLogs } from './hooks/common'
import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import axios from 'axios';

const appId = '3d117a30950e4724a73c9f8b07aef599';
const channelName = 'KBC18';
const token = '0063d117a30950e4724a73c9f8b07aef599IAArU0QWOS5imIsL6LAFMjhstsuHScxO+f0bxPxArH2Vq0aCn0Qh39v0IgDrfQAAOVznZQQAAQDJGOZlAwDJGOZlAgDJGOZlBADJGOZl';
const uid = 0;
const randomId = () => {
  return Math.floor(Math.random() * 99) + 10;
}

const App = () => {

  const agoraEngineRef = React.useRef<IRtcEngine>();
  const [isJoin, setIsJoin] = React.useState(false);
  const [isSwitch, setIsSwitch] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [remoteUid, setRemoteUid] = useState(randomId());
  const [volume, setVolume] = useState(false);
  const [message, setMeassage] = useState(false);
  const [chatToken, setChatToken] = useState(null);
  const [id, setId] = useState(null);
  const [channelToken, setChannelToken] = useState(null);
  const [callingStatus, setCallingStatus] = useState(false);
  const userRef = `/users/123${remoteUid}`

  React.useEffect(() => {
    getDeviceToken();
  }, []);

  const getDeviceToken = async () => {
    let token = await messaging().getToken();
    setChatToken(token)
  }

  React.useEffect(() => {
    getTokenForCalls();
    // getDataFromFirebase();
  }, [])

  database()
    .ref(userRef)
    .set({
      name: 'Ada Lovelace',
      token: channelToken,
      channelName: channelName,
      fcmToken: chatToken
    })
    .then(() => console.log('Data set.'));

  const getDataFromFirebase = () => {
    database()
      .ref(userRef)
      .on('value', snapshot => {
        console.log('User data: ', snapshot.val());
      });
  }

  React.useEffect(() => {
    // Initialize Agora engine when the app starts
    // setupVoiceSDKEngine();
  });

  const getPermission = async () => {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
    }
  };

  const getTokenForCalls = () => {
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://tuitionbot.com/agora_live_token/KBC/sample/RtcTokenBuilderSample.php',
      headers: {
        'Authorization': 'Bearer '
      }
    };
    fetch('https://tuitionbot.com/agora_live_token/KBC/sample/RtcTokenBuilderSample.php')
      .then((response) => response.json())
      .then((json) => console.log("json>>>", json))
      .catch((error) => console.error(error))
      .finally(() => console.log('in finally'));
  
  // axios.request(config)
  //   .then((response) => {
  //     console.log("response in 95", response);
  //     if (Number(response?.data?.status) === 1) {
  //       setChannelToken(response?.data?.token1)
  //     }
  //   })
  //   .catch((error) => {
  //     console.log("errrrrrr", JSON.stringify(error));
  //   });
}

const setupVoiceSDKEngine = async () => {
  try {
    if (Platform.OS === 'android') { await getPermission() };

    agoraEngineRef.current = createAgoraRtcEngine();
    const AgoraEngine = agoraEngineRef.current;
    AgoraEngine.registerEventHandler({
      onJoinChannelSuccess: (connection, remoteUid) => {
        console.log("onJoinChannelSuccess", remoteUid)
        setIsJoin(true)
      }, onUserJoined(connection, remoteUid, elapsed) {
        console.log("remoteUid", remoteUid)
        setId(remoteUid)
      }, onUserOffline: (connection, remoteUid, reason) => {
        console.log("onUserOffline", remoteUid)
      },
    });
    AgoraEngine.initialize({
      appId: appId
    })
    customLogs("initialization partv 1 done", "vvb")
  } catch (error) {
    customLogs("error in handleJoin", error)
  }
}

React.useEffect(() => {
  const engine = createAgoraRtcEngine();
  engine.initialize({
    appId: appId
  })
  customLogs("initiali", "done")
}, [])

const handleJoin = () => {
  if (isJoin) {
    customLogs("inside isJoin")
    return
  }
  try {
    agoraEngineRef.current?.setChannelProfile(
      ChannelProfileType.ChannelProfileCommunication
    );
    agoraEngineRef.current?.joinChannel(token, channelName, uid, {
      clientRoleType: ClientRoleType.ClientRoleBroadcaster
    })
    customLogs("inside isJoin try")
  } catch (error) {
    customLogs("error in handleJoin", error)
  }

}

const handleLeave = () => {

  try {
    agoraEngineRef.current?.leaveChannel();
    customLogs("inside handleLeave")
  } catch (error) {
    customLogs("error in handleLeave", error)
  }
}

const handleMute = () => {

}

const handleSpeaker = () => {

}

return (
  <View style={{ flex: 1, margin: 10 }} >
    <TouchableOpacity style={{ paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#000', borderRadius: 5, elevation: 5, marginBottom: 5 }} onPress={handleJoin}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }} >JOIN</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{ paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#000', borderRadius: 5, elevation: 5, marginBottom: 5 }} onPress={handleLeave}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }} >LEAVE</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{ paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#000', borderRadius: 5, elevation: 5, marginBottom: 5 }} onPress={handleMute}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }} >MUTE</Text>
    </TouchableOpacity>
    <TouchableOpacity style={{ paddingVertical: 15, paddingHorizontal: 10, backgroundColor: '#000', borderRadius: 5, elevation: 5, marginBottom: 5 }} onPress={handleSpeaker} >
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }} >SPEAKER</Text>
    </TouchableOpacity>
    <Text>print{message}{isJoin}
      {isJoin ? id : "no id"}</Text>
  </View>
)
}

export default App