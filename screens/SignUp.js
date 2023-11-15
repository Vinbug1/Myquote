import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";


const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      name: name,
      email: email,
      phone: phone,
      password: password,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch(
      "https://mayorapp-server.vercel.app/api/v1/auth/signup",
      requestOptions
    )
      .then((response) => {
        if (response.ok) {
          console.log(response);
          navigation.navigate("UploadQuotes");
        } else {
          console.log("Registration failed. Server returned:", response.status);
        }
      })
      .catch((error) => {
        console.error("Error during registration:", error);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <TouchableOpacity
            style={{
              left: 8,
              padding: 8,
              marginTop: Platform.OS === "ios" ? 50 : 45,
            }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="leftcircleo" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ height: "100%", backgroundColor: "#FFFFFF" }}>
            <View style={styles.head}>
              <Text style={{ fontSize: 20, fontWeight: "600" }}>
                Admin SignIn
              </Text>
            </View>
            <View style={{ marginTop: 65 }}>
              <TextInput
                placeholder="name"
                value={name}
                onChangeText={(text) => setName(text)}
                style={styles.input}
              />
              <TextInput
                placeholder="Phone Number"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                style={styles.input}
              />
              <TextInput
                placeholder="Email"
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
              <View style={{ marginTop: 95 }}>
                <TouchableOpacity
                  onPress={() => handleSubmit()}
                  style={styles.sharButton}
                >
                  <Text style={styles.shartxt}>SignUp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
  },
  head: {
    alignSelf: "center",
    marginTop: 35,
  },
  input: {
    width: "90%",
    height: 58,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: "blue",
    alignSelf: "center",
    margin: 5,
    paddingLeft: 10,
    fontSize: 18,
  },
  sharButton: {
    width: "75%",
    height: 60,
    backgroundColor: "blue",
    borderRadius: 8,
    //position: 'absolute',
    //bottom: -98,
    alignSelf: "center",
  },
  shartxt: {
    fontSize: 22,
    color: "#FFFFFF",
    alignSelf: "center",
    fontWeight: "600",
    padding: 15,
  },
});

export default SignUp;
