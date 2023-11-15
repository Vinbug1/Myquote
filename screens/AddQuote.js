import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Dimensions, StyleSheet } from 'react-native';
import axios from 'axios';
import baseUrl from '../assets/common/baseUrl';
import Toast from "react-native-root-toast";

const { width, height } = Dimensions.get('window');

const AddQuote = ({ isVisible, onClose }) => {
  const [description, setDescription] = useState('');

 
const handleAddQuote = async () => {
  const quot = { description: description }; // Assuming 'description' is defined somewhere

  try {
    const response = await axios.post(`${baseUrl}quotes/`, quot, {
      headers: {
        'Content-Type': 'application/json', // Change to 'application/json'
      },
    });

    if (response.status === 201) {
      onClose(); 
      setDescription('');
    }
  } catch (error) {
    Toast.show(error.message, Toast.LENGTH_SHORT); 
  }
};


  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.centeredView}>
        <ScrollView contentContainerStyle={styles.modalView}>
          <Text>Add New Quote</Text>
          <TextInput
               multiline
              // numberOfLines={4} // Set the number of lines you want to display
            placeholder="Enter your new quote here"
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={styles.input}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => onClose()} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleAddQuote()} style={styles.addButton}>
              <Text style={styles.buttonText}>Add Quote</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:265
  },
  modalView: {
    backgroundColor: 'lightblue',
    width: width * 0.85,
    height: "60%",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    width: '100%',
    height: 90,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: 'gray',
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 16,
    minHeight: 200, // Minimum height for the input field

  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 45,
  },
  cancelButton: {
    width: '40%',
    height: 50,
    backgroundColor: 'red',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: '40%',
    height: 50,
    backgroundColor: 'blue',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 19,
    fontWeight:"700",
    color: '#FFFFFF',
    alignSelf: 'center',
    padding:13
  },
});

export default AddQuote;













// import React, { useState } from 'react';
// import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
// import axios from 'axios';
// import baseUrl from '../assets/common/baseUrl';

// const { width, height } = Dimensions.get('window');

// const AddQuote = ({ isVisible, onClose }) => {
//   const [newQuoteText, setNewQuoteText] = useState('');

//   const handleAddQuote = async () => {
//     try {
//       const response = await axios.post(baseUrl, { quoteText: newQuoteText });
//       console.log('Response:', response.data);
//       setNewQuoteText('');
//       onClose();
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <Modal visible={isVisible} animationType="slide" transparent={true}>
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
//           <View style={{ backgroundColor: 'lightblue', width: width * 0.85, padding: 20, borderRadius: 10 }}>
//             <Text>Add New Quote</Text>
//             <TextInput
//               placeholder="Enter your new quote here"
//               value={newQuoteText}
//               onChangeText={setNewQuoteText}
//               style={{ width: '100%', height: 100, borderRadius: 6, borderWidth: 0.5 }}
//             />

//             <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginTop: 20 }}>
//               <TouchableOpacity onPress={onClose} style={{ width: '40%', height: 50, backgroundColor: 'red', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
//                 <Text style={{ color: 'white' }}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={handleAddQuote} style={{ width: '40%', height: 50, backgroundColor: 'blue', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
//                 <Text style={{ color: 'white' }}>Add Quote</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </Modal>
//   );
// };

// export default AddQuote;











// import React, { useState } from 'react';
// import { View, Text, Modal, TextInput, TouchableOpacity } from 'react-native';
// import axios from 'axios';

// const AddQuote = ({ isVisible, onClose }) => {
//   const [newQuoteText, setNewQuoteText] = useState('');

//   const handleAddQuote = async () => {
//     try {
//       // Replace 'your-api-endpoint' with your actual API URL.
//       const apiUrl = 'https://your-api-endpoint';
//       const response = await axios.post(apiUrl, { quoteText: newQuoteText });
      
//       // Handle the response here (e.g., show a success message).
//       console.log('Response:', response.data);
      
//       // Clear the input and close the modal.
//       setNewQuoteText('');
//       onClose();
//     } catch (error) {
//       // Handle any errors here (e.g., show an error message).
//       console.error('Error:', error);
//     }
//   };

//   return (

//     <Modal visible={isVisible} animationType="slide" transparent={true}>
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <View style={{ backgroundColor: 'lightblue', height: '35%', width: '85%', padding: 20, borderRadius: 10 }}>
//         <Text>Add New Quote</Text>
//         <TextInput
//           placeholder="Enter your new quote here"
//           value={newQuoteText}
//           onChangeText={setNewQuoteText}
//         />

//         <View style={{flexDirection:"row", justifyContent:"space-evenly"}}>
//             <TouchableOpacity onPress={() => handleAddQuote()} style={{width: "40%",height: 50,backgroundColor: 'blue',borderRadius: 8,position:'absolute',top: 95,alignSelf: 'center'  }}>
//                 <Text>Add Quote</Text>
//             </TouchableOpacity>

//             <TouchableOpacity onPress={() => onClose()}  style={{width: "40%",height: 50,backgroundColor: 'blue',borderRadius: 8,position:'absolute',top: 95,alignSelf: 'center'  }}>
//                 <Text>Cancel</Text>
//             </TouchableOpacity>
//         </View>
//         {/* <Button title="Add Quote" onPress={handleAddQuote} /> */}
//         {/* <Button title="Cancel" onPress={onClose} /> */}
//       </View>
//     </View>
//   </Modal>

//     // <Modal visible={isVisible} animationType="slide" transparent style={{ flex: 1, width: "95%", justifyContent: 'center', alignItems: 'center' }}>
//     //   <View style={{ flex: 1, width: "95%", justifyContent: 'center', alignItems: 'center' }}>
//     //     <View style={{ backgroundColor: 'lightblue', padding: 20, borderRadius: 10 }}>
//     //       <Text>Add New Quote</Text>
//     //       <TextInput
//     //         placeholder="Enter your new quote here"
//     //         value={newQuoteText}
//     //         onChangeText={setNewQuoteText}
//     //       />
//     //       <Button title="Add Quote" onPress={handleAddQuote} />
//     //       <Button title="Cancel" onPress={onClose} />
//     //     </View>
//     //   </View>
//     // </Modal>
//   );
// };

// export default AddQuote;

















// import React, { useState } from 'react';
// import { View, Text, Modal, TextInput, Button } from 'react-native';


// const AddQuote = ({ isVisible, onClose, onAddQuote })  => {
//     const [newQuoteText, setNewQuoteText] = useState('');

//   const handleAddQuote = () => {
//     onAddQuote(newQuoteText);
//     setNewQuoteText('');
//     onClose();
//   };

//   return (
//     <Modal visible={isVisible} animationType="slide" >
//     <View style={{ flex:1, width:"95%", justifyContent: 'center', alignItems: 'center' }}>
//       <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
//         <Text>Add New Quote</Text>
//         <TextInput
//           placeholder="Enter your new quote here"
//           value={newQuoteText}
//           onChangeText={setNewQuoteText}
//         />
//         <Button title="Add Quote" onPress={handleAddQuote} />
//         <Button title="Cancel" onPress={onClose} />
//       </View>
//     </View>
//   </Modal>
//   )
// }

// export default AddQuote

