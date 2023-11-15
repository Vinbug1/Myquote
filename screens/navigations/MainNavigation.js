import { StyleSheet, Text, View } from 'react-native'
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import QuoteScreen from '../QuoteScreen';
import SignIn from '../SignIn';
import NewQuote from '../NewQuote';
import onboarding from '../onboarding';
import SignUp from '../SignUp';


const Stack = createNativeStackNavigator();


const MainNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="StartQuotes">
      <Stack.Screen
       name="StartQuotes"
        component={onboarding} 
        options={{
          headerShown: false,
        }}
        />
      <Stack.Screen
       name="UploadQuotes"
        component={NewQuote} 
        options={{
          headerShown: false,
        }}
        />
    <Stack.Screen
     name="QuoteScreen" 
     component={QuoteScreen}
      options={{
    headerShown: false,
     }}
 />
    <Stack.Screen 
    name="SignIn" 
    component={SignIn} 
    options={{
    headerShown: false,
  }}
 />
  <Stack.Screen 
    name="Signup" 
    component={SignUp} 
    options={{
    headerShown: false,
  }}
 />
  </Stack.Navigator>

  )
}

export default MainNavigation

const styles = StyleSheet.create({})