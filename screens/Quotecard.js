import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React from 'react';
import * as Sharing from 'expo-sharing';


const Quotecard = () => {
    const shareQuote = async (quote) => {
        try {
          const shareOptions = {
            message: quote,
          };
      
          const shareResponse = await Sharing.shareAsync(shareOptions);
      
          if (shareResponse.action === Sharing.sharedAction) {
            console.log('Content shared successfully');
          } else if (shareResponse.action === Sharing.dismissedAction) {
            console.log('Sharing was dismissed');
          }
        } catch (error) {
          console.error('Error sharing quote:', error);
        }
      };
      
      
  return (
    <View style={styles.slide}>
    {/* <Image
      source={{ uri: quote.backgroundImageURL }}
      style={styles.backgroundImage}
    /> */}
    {/* <Text style={styles.text}>{quote.text}</Text> */}
    <View>
      <Text style={styles.text}>Welcome on board</Text>

    </View>
    <TouchableOpacity onPress={() => shareQuote(quote.text)}>
      <Text style={styles.shareButton}>Share</Text>
    </TouchableOpacity>
  </View>
  )
}

export default Quotecard

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        fontSize: 24,
        color: 'black',
        textAlign: 'center',
      },
})