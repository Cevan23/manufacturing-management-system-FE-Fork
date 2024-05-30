import React, { useState } from 'react';
import {  getAllMPSofPM } from '../../services/MPSServices'
import { useGlobalContext } from '../../context/GlobalProvider';
import { Card } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { CustomButton } from '../../components';

// Production Schedule page
// Author: Pham Van Cao
const ProductionSchedule = () => {
  const { token, userId, searchText  } = useGlobalContext();
  const [mpsData, setMpsData] = useState([]);
  const navigation = useNavigation();

  // Filter searched data by Production Schedule name
	// Author: Pham Hien Nhan
  const getFilteredData = () => {
    if (searchText.trim() === '') {
      return mpsData;
    }
    return mpsData.filter(item =>
      item.productName.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filteredData = getFilteredData();

  // Refetch data when focus
	// Author: Pham Van Cao
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        const response = await getAllMPSofPM(token,userId); 
        setMpsData(response.result);
        console.log("res: ",response.result);
      };

      fetchData();
      console.log("mpsData: ",mpsData);
    }, [])
  );

  // Navigate to Production Schedule Detail page
  // Author: Pham Van Cao
  const handleCardPress = async (id) => {
    console.log(`Card with id ${id} was pressed.`);
    try {
      navigation.navigate('ProductionScheduleDetail', { id });
    } catch (error) {
      console.error(error);
    }
  };

  // Navigate to Create MPS page
  // Author: Pham Van Cao
  const handleInsert = async () => {
    try {
      navigation.navigate('MPSCreateForm');
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <View className="bg-primary h-full" styles={{flex: 1}}>
      <FlatList
        data={filteredData}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        keyExtractor={item => item.mpsID.toString()}
        renderItem={({ item }) => (
          <Card 
            key={item.mpsID} 
            style={styles.card} 
            onPress={() => handleCardPress(item.mpsID)}>
            <Card.Title title={item.productName} titleStyle={styles.title} />
            <Card.Content>
              <Text style={styles.text}>MPS ID: {item.mpsID}</Text>
              <Text style={styles.text}>Start Date: {item.dateStart}</Text>
              <Text style={styles.text}>End Date: {item.dateEnd}</Text>
              <Text style={styles.text}>Quantity: {item.quantity}</Text>
            </Card.Content>
          </Card>
        )}
      />

      <View>  
        <CustomButton
          icon={"plus"}
          iconSize={28}
          containerStyles="p-0 absolute bottom-20 self-end right-4 h-12 w-12 rounded-full bg-green-500 items-center justify-center"
          isLoading={false}
          handlePress={handleInsert}
        />
      </View>
    </View>
  )
}

// Styles for Production Schedule page
// Author: Pham Van Cao
const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
  },
  title: {
    color: '#FFA500', // Orange color
    fontSize: 20, // Font size
    fontWeight: 'bold', // Bold font
  },
  cardContent: {
    
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
});


export default ProductionSchedule