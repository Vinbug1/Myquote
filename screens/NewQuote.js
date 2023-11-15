import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation,useFocusEffect } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";
// import baseUrl from '../assets/common/baseUrl';
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewQuote = () => {
  const navigation = useNavigation();
const  [quote,setQuote] = useState("");
const [userDetails, setUserDetails] = useState();


useFocusEffect(
  useCallback(() => {
    AsyncStorage.getItem("userInfor")
    .then((userId) => {
      if (userId) {
        setUserDetails(userId);
       // console.log("trying things out", userDetails);
      } else {
        console.log("Object not found in AsyncStorage");
      }
    })
    .catch((error) => {
      console.error("Error retrieving object:", error);
    });
  
    return () => {
      setUserDetails();
    };
  }, [])
);

//const userId = userDetails;
// const handleSubmit = async () => {
//   var myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");

//   var raw = JSON.stringify({
//     quote: quote,
//     user: userDetails,
//   });

//   var requestOptions = {
//     method: 'POST',
//     headers: myHeaders,
//     body: raw,
//     redirect: 'follow'
//   };

//   try {
//     console.log("what are waiting for",userDetails);
//     const response = await fetch("https://mayorapp-server.vercel.app/api/v1/Quotes/add", requestOptions);
//     const result = await response.json();
//       console.log("still fixing",result);
//     if (response.success === true) {
//       console.log('Quote added successfully:', result.data);
//       setQuote("");
//     } else {
//       console.log(result.message);
//     }
//   } catch (error) {
//     console.error('Error during signin:', error);
//   }

  
// };
const handleSubmit = async () => {
  try {
    const myHeaders = new Headers({
      'Content-Type': 'application/json',
    });

    const raw = JSON.stringify({
      quote: quote,
      user: userDetails,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    console.log('Request Payload:', raw);

    const response = await fetch('https://mayorapp-server.vercel.app/api/v1/Quotes/add', requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API Response:', result);

    if (result.success === true) {
      console.log('Quote added successfully:', result.data);
      setQuote('');
    } else {
      console.log('Quote addition failed:', result.message);
    }
  } catch (error) {
    console.error('Error during quote addition:', error);
  }
};


  return (
    <View style={styles.container}>
    <View>
      <TouchableOpacity
        style={{ left: 8, padding: 8, marginTop:Platform.OS === 'ios' ? 50 : 45 }}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="leftcircleo" size={28} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ marginTop:5}}
  >
    <View style={{ height: "100%", backgroundColor: "#FFFFFF", marginTop: 25 }}>
      <View style={styles.head}>
        <Text style={{ fontSize: 20, fontWeight: "600" }}>New Quotes</Text>
      </View>

      <View style={{ marginTop: 45 }}>
        <TextInput
          multiline
          //maxLength={120}
          placeholder="Quotes"
          value={quote}
          onChangeText={(text) => setQuote(text)}
          style={styles.input} 
        />
        </View>
      <TouchableOpacity onPress={() => handleSubmit()} style={styles.sharButton}>
        <Text style={styles.shartxt}>Submit</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
</View>
  )
}

export default NewQuote

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  input: {
    width: "95%",
    height: "45%",
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'blue',
    alignSelf: 'center',
    margin: 5,
    paddingLeft: 10
  },
  sharButton: {
    width: "50%",
    height: 60,
    backgroundColor: 'blue',
    borderRadius: 8,
    position: 'absolute',
    bottom:  185,
    alignSelf: 'center',
  },
  shartxt: {
    fontSize: 22,
    color: '#FFFFFF',
    alignSelf: 'center',
    fontWeight: '600',
    padding: 15,
  },
  head: {
    alignSelf: 'center',
    marginTop: 45,
  },
})




