import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";



const SignIn = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    var raw = JSON.stringify({
      email: email,
      password: password,
    });
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
  
    try {
      const response = await fetch("https://mayorapp-server.vercel.app/api/v1/auth/signin", requestOptions);
      const result = await response.json();
  
      if (response.ok) {
        const userId = result.data && result.data.uuid;
  
        if (userId) {
          console.log('User ID:', userId);
          await AsyncStorage.setItem('userInfor', userId);
          navigation.navigate("UploadQuotes");
        } else {
          console.log('User ID not found in the response data.');
        }
      } else {
        console.log('Signin failed. Server returned:', response.status);
      }
    } catch (error) {
      console.error('Error during signin:', error);
    }
  };
  

  const handleSignUp = () => {
          navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <TouchableOpacity
            style={{ left: 8, padding: 8, marginTop: Platform.OS === 'ios' ? 50 : 45 }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="leftcircleo" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{ flex:1, backgroundColor: "#FFFFFF", marginTop: 25 }}>
            <View style={styles.head}>
              <Text style={{ fontSize: 20, fontWeight: "600" }}>Admin Sign In</Text>
            </View>
            <View style={{ marginTop: 95 }}>
              <TextInput
                placeholder="Username"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
              />
              <TextInput
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
              />
            <View  style={{ marginTop: 75 }}>
            <TouchableOpacity onPress={() => handleSubmit()} style={styles.sharButton}>
              <Text style={styles.shartxt}>SignIn</Text>
            </TouchableOpacity>
            </View>
            {/* <View  style={{ marginTop: 12, flexDirection: 'row',justifyContent: 'center',marginHorizontal:15 }}>
              <Text style={styles.shartx}>Don't, have an account?</Text>
            <TouchableOpacity onPress={() => handleSignUp()}>
              <Text style={styles.shartxtt}>SignUp</Text>
            </TouchableOpacity>
            </View> */}
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
  },
  head: {
    alignSelf: 'center',
    marginTop: 45,
  },
  input: {
    width: "90%",
    height: 58,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: 'blue',
    alignSelf: 'center',
    margin: 5,
    paddingLeft: 10,
    fontSize: 18,
  },
  sharButton: {
    width: "75%",
    height: 60,
    backgroundColor: 'blue',
    borderRadius: 8,
    //position: 'absolute',
    //bottom: -98,
    alignSelf: 'center',
  },
  shartxt: {
    fontSize: 22,
    color: '#FFFFFF',
    alignSelf: 'center',
    fontWeight: '600',
    padding: 15,
  },
  shartxtt: {
    fontSize: 22,
    color: 'blue',
    alignSelf: 'center',
    fontWeight: '600',
    //padding: 15,
  },
  shartx: {
    fontSize: 16,
    color: 'blue',
    alignSelf: 'center',
    fontWeight: '600',
    //padding: 15,
  },
});











