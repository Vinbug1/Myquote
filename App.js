import { StatusBar } from 'expo-status-bar';
import {LogBox, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import MainNavigation from './screens/navigations/MainNavigation';

LogBox.ignoreAllLogs();

export default function App() {
  return (
    <NavigationContainer>
      <MainNavigation />
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
