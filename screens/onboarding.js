import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from "react-native";
import React from "react";
import cardBackgroundImage from "../assets/mayor.png";
import { useNavigation } from '@react-navigation/native';

const onboarding = () => {
  const navigation = useNavigation();

  const move = () => {
     navigation.navigate("QuoteScreen");
  };

  return (
    <ImageBackground
      source={cardBackgroundImage}
      style={styles.backgroundImage}
    >
      <TouchableOpacity style={styles.sharButton} onPress={() => move()}>
         <Text style={styles.shartxt}>Get Start</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default onboarding;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
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
});











// import { StyleSheet, Text, View,TouchableOpacity } from "react-native";
// import React from "react";
// import cardBackgroundImage from "../assets/mayor.jpg";
// import { useNavigation } from '@react-navigation/native';


// const onboarding = () => {
//   const navigation = useNavigation();

//   const move = () => {
//      navigation.navigate("QuotScreen")
//   };
//   return (
//     <View
//       style={[ { backgroundImage: `url(${cardBackgroundImage})` }]}
//     >
//     <TouchableOpacity style={styles.sharButton} onPress={() => move()}>
//        <Text style={styles.shartxt}>Get Start</Text>
//     </TouchableOpacity>
//     </View>
//   );
// };

// export default onboarding;

// const styles = StyleSheet.create({
//   sharButton: {
//     width: "50%",
//     height: 60,
//     backgroundColor: 'blue',
//     borderRadius: 8,
//     position: 'absolute',
//     bottom:  185,
//     alignSelf: 'center',
//   },
//   shartxt: {
//     fontSize: 22,
//     color: '#FFFFFF',
//     alignSelf: 'center',
//     fontWeight: '600',
//     padding: 15,
//   },
// });
