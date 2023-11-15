import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  KeyboardAvoidingView
} from "react-native";
import Swiper from "react-native-swiper";
import { ScreenOrientation } from "expo";
import axios from "axios";
import { Share } from "expo-sharing";
import baseUrl from "../assets/common/baseUrl";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, MaterialIcons  } from "@expo/vector-icons";
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
  const [quoteIndex, setQuoteIndex] = useState(0);
  const swiperRef = useRef(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [reloadScreen, setReloadScreen] = useState(false);


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
    
    const fetchData = async () => {
      // Perform any data fetching logic here
      getQuotes();
    };

    if (reloadScreen) {
      fetchData();
      setReloadScreen(false); // Reset the state to false after reloading
    }

    const adminLoggedIn = false; // Replace with your actual check
    setIsLoggedIn(adminLoggedIn);


    return async () => {
      clearInterval(fetchNewQuotesInterval);
      await ScreenOrientation.lockAsync(ScreenOrientation.Orientation.PORTRAIT);
      ScreenOrientation.removeOrientationChangeListener(
        handleOrientationChange
      );
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



  
  const handleSearch = (query) => {
    setSearchQuery(query);

    const filtered = quotes.filter((quote, index) => {
      const isNumber = /^\d+$/.test(query);
      const quoteNumberString = (index + 1).toString();

      const includesText =
        quote.description &&
        quote.description.toLowerCase().includes(query.toLowerCase());
      const matchesNumber = isNumber && quoteNumberString.includes(query);

      return includesText || matchesNumber;
    });

    setFilteredQuotes(filtered);
  };


  
  const CustomNextButton = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.customButton} onPress={onPress}>
        <AntDesign name="right" size={45} color="blue" />
      </TouchableOpacity>
    );
  };

  const CustomPrevButton = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.customButton} onPress={onPress}>
        <AntDesign name="left" size={40} color="blue" />
      </TouchableOpacity>
    );
  };


  const handleNextButtonPress = () => {
    if (swiperRef.current) {
      const currentIndex = swiperRef.current.state.index;
      swiperRef.current.scrollBy(1, true); // Use true to animate the transition
    }
  };
  
  const handlePrevButtonPress = () => {
    if (swiperRef.current) {
      const currentIndex = swiperRef.current.state.index;
      swiperRef.current.scrollBy(-1, true); // Use true to animate the transition
    }
  };
  

  const handleSignIn = async () => {
    navigation.navigate("SignIn");     
  };

  const shareQuote = async (quoteText) => {
    try {
      await Share.share({
        message: quoteText,
      });
    } catch (error) {
      console.error('Error sharing quote:', error.message);
    }
  };


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
            <MaterialIcons name="login" size={24} color="blue" style={{ marginTop: 12, marginLeft: -5 }} />
          )}
        </View>
        <View>
          <TouchableOpacity onPress={() => toggleSearchVisibility()}>
            <AntDesign name={isSearchVisible ? "close" : "search1"} size={24} color="blue" />
          </TouchableOpacity>
        </View>
      </View>

      {isSearchVisible && (
        <TextInput
          placeholder="Search for quotes"
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchBar}
        />
      )}
  
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
             {filteredQuotes.map((item, index) => (
               <View
                 style={ styles.card }
                 key={index}
               >
                 <ImageBackground
                   source={cardBackgroundImage}
                   style={styles.cardImageBackground}
                 >
                   <View style={styles.cardContent}>
                    <View style={styles.qutNumber}>
                       <Text style={styles.textt}>{`${index + 1}.`}</Text>
                    </View>
                    <View style={{width:"75%",height:"auto"}}>
                       <Text style={styles.text}>{item.quote}</Text>
                    </View>
                   </View>
                   <View style={{ alignSelf: "center",marginTop:45 }}>
                     <TouchableOpacity
                       onPress={() => shareQuote(item.quote)}
                       style={styles.shareButton}
                     >
                       <Text style={styles.sharetxt}>Share</Text>
                     </TouchableOpacity>
                   </View>
                 </ImageBackground>
               </View>
             ))}
           </Swiper>
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
    
  card: {
    width: "95%",
    height: Platform.OS === 'ios' ? "68%" : "65%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 45,
    backgroundColor: "white",
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
    top: Platform.OS === "ios" ? 95 : 70,
    alignSelf: "center",
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
    height: "5%",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "gray",
    margin: 15,
    paddingLeft: 5,
  },
  customButton: {
    marginTop: -95,
  },

  cardImageBackground: {
  width: "100%",
  height: "100%",
  resizeMode: "contain",
  alignItems: "center",
  justifyContent: "center",
  margin: 20,
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
    top: 10,
    right: -65,
    alignSelf: "flex-end",  // Corrected typo here
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
    zIndex: 1, // Set a higher zIndex to make it appear above the background image
  },
  

});

export default QuoteScreen;
