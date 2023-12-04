import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Platform, Alert, Share,
} from "react-native";
import Swiper from "react-native-swiper";
import { ScreenOrientation } from "expo";
import axios from "axios";
import * as Sharing from 'expo-sharing';
import ActionSheet from 'react-native-action-sheet';
import baseUrl from "../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import cardBackgroundImage from "../assets/edmayor.jpg";
import Toast from "react-native-root-toast";
import * as Notifications from 'expo-notifications';


const QuoteScreen = () => {
  const [isPortrait, setIsPortrait] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFloatingButtonVisible, setIsFloatingButtonVisible] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [filteredQuotes, setFilteredQuotes] = useState(quotes);
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);
  const swiperRef = useRef(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [reloadScreen, setReloadScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);



  const handleOrientationChange = (orientation) => {
    setIsAdmin(orientation === "LANDSCAPE" && isLoggedIn);
    setIsFloatingButtonVisible(orientation === "LANDSCAPE" && isLoggedIn);
  };

  useEffect(() => {
    const subscribeToOrientationChange = async () => {
      await ScreenOrientation.lockAsync(
        isPortrait
          ? ScreenOrientation.Orientation.PORTRAIT
          : ScreenOrientation.Orientation.LANDSCAPE
      );

      ScreenOrientation.addOrientationChangeListener(handleOrientationChange);

      return () => {
        ScreenOrientation.removeOrientationChangeListener(
          handleOrientationChange
        );
      };
    };

    subscribeToOrientationChange();

    // Periodically check for new quotes every 6 hours
    const fetchNewQuotesInterval = setInterval(() => {
      getNewQuotes();
    }, 6 * 60 * 60 * 1000);

    Notifications.addNotificationReceivedListener(handleNotification);

    // const fetchData = async () => {
    // Perform any data fetching logic here
    getQuotes();
    // };

    // if (reloadScreen) {
    //   fetchData();
    setReloadScreen(false); // Reset the state to false after reloading
    // }

    const adminLoggedIn = false; // Replace with your actual check
    setIsLoggedIn(adminLoggedIn);
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );



    return async () => {
      clearInterval(fetchNewQuotesInterval);
      await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
      ScreenOrientation.removeOrientationChangeListener(
        handleOrientationChange
      );
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();

    };
  }, [isPortrait, reloadScreen]);

  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);

    // Reload the screen when the search bar is closed
    if (!isSearchVisible) {
      setReloadScreen(true);
    }
  };



  const handleNotification = (notification) => {
    const newQuoteTimestamp = notification.request.content.data.newQuote.timestamp;

    // Check if the new quote is from the current day
    const currentDate = new Date();
    const currentDayStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()).getTime();
    const currentDayEnd = currentDayStart + 24 * 60 * 60 * 1000;

    if (newQuoteTimestamp >= currentDayStart && newQuoteTimestamp < currentDayEnd) {
      // Display the new quote in a modal
      showNewQuoteModal(notification.request.content.data.newQuote.description);
    }
  };



  const showNewQuoteModal = (newQuote) => {
    Toast.show(`New Quote: ${newQuote}`, {
      duration: Toast.durations.LONG,
      position: Toast.positions.CENTER,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  };



  const getQuotes = async () => {
    try {
      const response = await fetch("https://mayorapp-server.vercel.app/api/v1/Quotes/view");
      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          const quotesData = result.data; // Extract the array of quotes from the data
          console.log("quotesData", quotesData);
          setQuotes(quotesData);
          setFilteredQuotes(quotesData);
        } else {
          console.error('Error fetching quotes. Server returned:', result.message);
        }
      } else {
        console.error('Error fetching quotes. Server returned:', response.status);
      }
    } catch (error) {
      console.error('Error during quote retrieval:', error);
    }
  };


  const renderQuoteNumber = (index) => (
    <View style={styles.qutNumber}>
      <Text style={styles.textt}>{`${index + 1}.`}</Text>
    </View>
  );


  const getNewQuotes = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${baseUrl}Quotes/view`,
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Add timestamp to each quote
      const quotesWithTimestamp = response.data.map((quote) => ({
        ...quote,
        timestamp: new Date(quote.createdAt).getTime(), // Assuming createdAt is the timestamp from the server
      }));

      setQuotes(quotesWithTimestamp);
      setFilteredQuotes(quotesWithTimestamp);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    }
  };


  const CustomNextButton = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.customButton} onPress={onPress}>
        <Text style={styles.swpi}>Swipe</Text>
      </TouchableOpacity>
    );
  };

  const CustomPrevButton = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.customButton} onPress={onPress}>
        <Text style={styles.swpi}>Swipe</Text>
      </TouchableOpacity>
    );
  };


  const handleNextButtonPress = () => {
    if (swiperRef.current) {
      const newIndex = currentIndex + 1;
      // swiperRef.current.scrollBy(1, true); // Use true to animate the transition
      setCurrentIndex(newIndex);
    }
  };

  const handlePrevButtonPress = () => {
    if (swiperRef.current) {
      const newIndex = currentIndex - 1;
      swiperRef.current.scrollBy(-1, true); // Use true to animate the transition
      setCurrentIndex(newIndex);
    }
  };


  const handleSignIn = async () => {
    navigation.navigate("SignIn");
  };

  const shareQuote = async (quoteText) => {
    try {
      const result = await Share.share({
        message: quoteText,
      });

      console.log("Sharing Result:", result);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log("Shared with Activity Type:", result.activityType);
        } else {
          // shared
          console.log("Shared Successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log("Share Dismissed");
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);

    const idNumber = parseInt(query, 10);

    console.log('Original Quotes:', quotes);
    console.log('Search Query (ID):', idNumber);

    const filtered = quotes.filter((quote) => {
      console.log(`Checking quote with ID: ${quote.id}`);
      return quote.id === idNumber;
    });

    console.log('Filtered Quotes:', filtered);

    setFilteredQuotes(filtered);
  };




  const QuoteCard = ({ quote, index }) => (
    <View style={styles.card} key={index}>
      <ImageBackground
        source={cardBackgroundImage}
        style={styles.cardImageBackground}
      >
        <View style={styles.cardContent}>
          <View style={styles.qutNumber}>
            <Text style={styles.textt}>{`${index}.`}</Text>
          </View>
          <View style={{ width: "75%", height: "auto" }}>
            <Text style={styles.text}>{quote.quote}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => shareQuote(quote.quote)}
          style={styles.shareButton}
        >
          <Text style={styles.sharetxt}>Share</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );


  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <View style={styles.signbtn}>
          {!isSearchVisible && (
            <TouchableOpacity onPress={() => handleSignIn()}>
              <Text style={styles.txt}>LogIn</Text>
            </TouchableOpacity>
          )}
          {!isSearchVisible && (
            <MaterialIcons name="login" size={24} color="blue" style={{ marginTop: 15, marginLeft: -5 }} />
          )}
        </View>
        <View>
          <TouchableOpacity onPress={() => toggleSearchVisibility()}>
            <AntDesign name={isSearchVisible ? "close" : "search1"} size={24} color="blue" />
          </TouchableOpacity>
        </View>
      </View>

      {/* <View  style={styles.searchBa}> */}
      {isSearchVisible && (
        <TextInput
          placeholder="Search with quote number"
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
          onFocus={() => setIsSearchActive(true)}
          onBlur={() => setIsSearchActive(false)}
        />
      )}
      {/* </View> */}
      {/* <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      > */}
        <ScrollView showsVerticalScrollIndicator={false}
                 scrollEnabled={isKeyboardVisible}
        contentContainerStyle={styles.scrollViewContainer}
>
          <Swiper
            showsButtons={true}
            showsPagination={false}
            ref={swiperRef}
            nextButton={
              <CustomNextButton onPress={() => handleNextButtonPress()} />
            }
            prevButton={
              <CustomPrevButton onPress={() => handlePrevButtonPress()} />
            }
          >
            {searchQuery
              ? filteredQuotes.length > 0
                ? filteredQuotes.map((quote) => (
                  <QuoteCard key={quote.id} quote={quote} index={parseInt(quote.id, 10)} />
                ))
                : <Text style={{ textAlign: "center", marginTop: 165, alignSelf: "center", justifyContent: "center" }}>No matching quotes found for index: {parseInt(searchQuery, 10)}</Text>
              : quotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} index={parseInt(quote.id, 10)} />
              ))}
          </Swiper>
        </ScrollView>
      {/* </KeyboardAvoidingView> */}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,  // Add flex property to fill the available space
  },

  // card: {
  //   width: "95%",
  //   height: Platform.OS === 'ios' ? "65%" : "65%",
  //   alignSelf: "center",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: 45,
  //   backgroundColor: "white",
  // },


  card: {
    width: "95%",
    height: Platform.OS === 'ios' ? "50%" : "50%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 65,
    backgroundColor: "white",
  },

  swiperContainer: {
    marginTop: 10,
    height: Platform.OS === 'ios' ? "50%" : "50%",
  },

  backgroundImage: {
    height: 200, // Adjust the height as needed
  },

  shareButton: {
    width: 150,
    height: 60,
    backgroundColor: "blue", // Add your desired button styles
    borderRadius: 8,
    position: "absolute",
    bottom: Platform.OS === "ios" ? 45 : 40,
    alignSelf: "center",
  },
  scrollViewContainer: {
    minHeight: '50%', // Adjust the percentage as needed
  },

  sharetxt: {
    fontSize: 22,
    color: "#FFFFFF",
    alignSelf: "center",
    fontWeight: "600",
    padding: 15,
  },
  signbtn: {
    width: "40%",
    height: 40,

    //borderRadius: 8,
    //backgroundColor: "blue",
  },
  txt: {
    fontSize: 19,
    fontWeight: "normal",
    color: "blue",
    alignSelf: "center",
    padding: 13,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 80,
    marginHorizontal: 17,
  },
  signbtn: {
    flexDirection: "row",
    width: "50%",
    height: 50,
  },
  loginBtn: {
    width: "40%",
    height: 50,
    backgroundColor: "blue",
    borderRadius: 8,
  },
  newQuoteButton: {
    //flex: 1,
    width: "40%",
    height: 50,
    borderRadius: 8,
    backgroundColor: "green",
  },
  newQuoteButtonText: {
    fontSize: 1,
    fontWeight: "700",
    color: "#FFFFFF",
    alignSelf: "center",
    padding: 10,
  },
  swiperContainer: {
    marginTop: 10,
  },
  searchBar: {
    width: "95%",
    height: 50,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "gray",
    margin: 22,
    alignSelf: "center",
    paddingLeft: 5,
  },
  customButton: {
    marginTop: 245,
  },

  cardImageBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    alignItems: "center",
    justifyContent: "center",
    margin: 15,
    borderRadius: 5,
    //borderWidth: 0.5,
    overflow: 'hidden',
    backgroundColor: "rgba(0, 0, 0, 0)", // Set a transparent background color
    //opacity: 0.2, // Adjust the opacity value as needed
  },
  qutNumber: {
    width: 50,
    height: 50,
    borderRadius: 26,
    position: "absolute",
    top: 25,
    right: -65, // Adjusted the right position to 10 (or any value you prefer)
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    color: "#000000", // Set a contrasting color for visibility
    textAlign: "center",
    fontStyle: 'italic',
  },
  textt: {
    fontSize: 23,
    color: "blue",
    fontWeight: "bold",
    // zIndex: 1, // Set a higher zIndex to make it appear above the background image
    //position: "absolute",
    //right: 65
  },
  swpi: {
    fontSize: 18,
    fontWeight: "200",
    color: "blue",
    fontWeight: "600",
  },
  buttonText: {
    fontSize: 23,
    color: "blue",
    fontWeight: "bold",
    // zIndex: 1, // Set a higher zIndex to make it appear above the background image
    //position: "absolute",
    //right: 65
  },

});

export default QuoteScreen;
