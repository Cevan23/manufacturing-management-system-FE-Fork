import React, { useState, useEffect, useRef } from 'react';
import { createMPS } from '../../../services/MPSServices'
import { useGlobalContext } from '../../../context/GlobalProvider';
import IconButton from '../../../components/IconButton';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import { getAllProduct } from '../../../services/ProductServices';
import { FormField, ToastMessage } from "../../../components";
import CustomAlert from "../../../components/CustomAlert";

// Master Production Schedule create page
// Author: Pham Van Cao
const MPSCreateForm = () => {
    const { token, userId  } = useGlobalContext();
    const successToastRef = useRef(null);
    const errorToastRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [timeProduction, setTimeProduction] = useState(0);
    const [dateStart, setDateStart] = useState(new Date().toISOString().split('T')[0]);
    const [dateEnd, setDateEnd] = useState(new Date().toISOString().split('T')[0]);
    const [mpsRequest, setMPSRequest] = useState({
        product_manager_ID: userId,
        productId: '',
        dateStart: dateStart,
        dateEnd: dateEnd,
        quantity: '',
        requireTime: '',
        durationHour: '',
        effortHour: '',
        in_progress: '0.0'
    });
    const navigation = useNavigation();

    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [alertMessage1, setAlertMessage1] = useState("");
    const [alertMessage2, setAlertMessage2] = useState("");
    
    // Fetch all products
    // Author: Pham Van Cao
    useEffect(() => {
        const fetchData = async () => {
            console.log("dateStart: ", dateStart);
            // Get all products
            // Author: Pham Van Cao
            const response = await getAllProduct(token);
            console.log("response: ",response);
            const products = response.result.map(product => ({
                id: product.id,
                name: product.name,
                timeProduction: product.bom && product.bom.timeProduction ? product.bom.timeProduction : 0
            }));
            setProducts(products);
        };
        fetchData();
    }, []);
    
    // Save Master Production Schedule
    // Author: Pham Van Cao
    const handleSave = async () => {
        console.log("mpsRequest: ",mpsRequest);
        try {
            // Create Master Production Schedule
            // Author: Pham Van Cao
            const response = await createMPS(token, mpsRequest);
            console.log("response: ",response);
            if (successToastRef.current) {
                successToastRef.current.show({
                    type: 'success',
                    text: 'Master Production Schedule',
                    description: 'MPS created successfully.'
                });
            }
            setTimeout(() => {
                navigation.goBack();
            }, 3500);
        } catch (error) {
            console.error(error);
        }
    };

    // Handle start date change
    // Author: Pham Hien Nhan
    const handleStartDateChange = (selectedDate) => {
        if (selectedDate <= dateEnd) {
            setDateStart(selectedDate || dateStart);
            setMPSRequest(prevState => ({ ...prevState, dateStart: selectedDate }));
        } else {
            setModalVisible(true);
            setErrorMessage("Start date cannot be after end date");
            setAlertMessage1("Close");
            setAlertMessage2("");
        }
    };
    
    // Handle end date change
    // Author: Pham Hien Nhan
    const handleEndDateChange = (selectedDate) => {
        if (selectedDate >= dateStart) {
            setDateEnd(selectedDate || dateEnd);
            setMPSRequest(prevState => ({ ...prevState, dateEnd: selectedDate }));
        } else {
            setModalVisible(true);
            setErrorMessage("End date cannot be before start date");
            setAlertMessage1("Close");
            setAlertMessage2("");
        }
    };
    
    // Handle close alert box
    // Author: Pham Hien Nhan
    const handCloseAlertBox = () => {
        setModalVisible(false); 
    };

    return (
        <View className="bg-primary h-full" style={{flex: 1}}>
            <ScrollView style={{borderWidth: 1, }} alwaysBounceVertical={true} vertical={true}>
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        {products.map((product, index) => (
                            <TouchableOpacity 
                                key={index} 
                                onPress={() => {
                                    setMPSRequest(prevState => ({ ...prevState, productId: product.id, productName: product.name}));
                                    setTimeProduction(product.timeProduction);
                                    console.log("timeProduction: ", product.timeProduction);
                                }}>
                                <View style={{ borderBottomWidth: 1, margin: 10 }}>
                                    <Text>Product ID: {product.id}</Text>
                                    <Text>Product Name: {product.name}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </Card.Content>
                </Card>
            </ScrollView>

            <ScrollView>
                <Card style={styles.cardSecond}>
                    <Card.Content>
                        <FormField
                            title="Product Name"
                            placeholder={mpsRequest?.productName}
                            value={mpsRequest?.productName}
                            otherStyles="mt-3"
                            edit={true}
                            onPress={text => setMPSRequest(prevState => ({ ...prevState, productName: text }))}
                        />

                        <FormField
                            title="Start Date"
                            placeholder={dateStart}
                            value={dateStart}
                            otherStyles="mt-3"
                            edit={true}
                            onPress={handleStartDateChange}
                        />

                        <FormField
                            title="End Date"
                            placeholder={dateEnd}
                            value={dateEnd}
                            otherStyles="mt-3"
                            edit={true}
                            onPress={handleEndDateChange}
                        />

                        <FormField
                            title="Quantity"
                            placeholder={mpsRequest?.quantity ? mpsRequest.quantity.toString() : ''}
                            value={mpsRequest?.quantity ? mpsRequest.quantity.toString() : ''}
                            otherStyles="mt-3"
                            edit={true}
                            handleChangeText={text => {
                                const newQuantity = parseInt(text);
                                setMPSRequest(prevState => ({ 
                                    ...prevState, 
                                    quantity: newQuantity,
                                    
                                }));
                                setMPSRequest(prevState => ({ ...prevState, requireTime: newQuantity *  timeProduction}));
                                console.log("requireTime: ", mpsRequest.requireTime);
                            }}
                        />

                        <Card.Title title="Additional Details" titleStyle={styles.title}/>
                        <Card style={styles.cardThird}>
                            <Card.Content>
                                <FormField
                                    title="Require Time"
                                    placeholder={mpsRequest?.requireTime ? mpsRequest.requireTime.toString() : ''}
                                    value={mpsRequest?.requireTime ? mpsRequest.requireTime.toString() : ''}
                                    otherStyles="mt-3"
                                    edit={true}
                                />

                                <FormField
                                    title="Duration Hour"
                                    placeholder={mpsRequest?.durationHour ? mpsRequest.durationHour.toString() : ''}
                                    value={mpsRequest?.durationHour ? mpsRequest.durationHour.toString() : ''}
                                    otherStyles="mt-3"
                                    edit={true}
                                    handleChangeText={text => setMPSRequest(prevState => ({ ...prevState, durationHour: text }))}
                                />

                                <FormField
                                    title="Effort Hour"
                                    placeholder={mpsRequest?.effortHour ? mpsRequest.effortHour.toString() : ''}
                                    value={mpsRequest?.effortHour ? mpsRequest.effortHour.toString() : ''}
                                    otherStyles="mt-3"
                                    edit={true}
                                    handleChangeText={text => setMPSRequest(prevState => ({ ...prevState, effortHour: text }))}
                                />

                                <FormField
                                    title="In Progress"
                                    placeholder="In Progress"
                                    value={mpsRequest?.in_progress ? mpsRequest.in_progress : ''}
                                    otherStyles="mt-3"
                                    edit={true}
                                    handleChangeText={text => {setMPSRequest(prevState => ({ ...prevState, in_progress: text }));}}
                                />
                            </Card.Content>
                        </Card>
                    </Card.Content>
                </Card>
                <View style={{ height: 50 }} />
            </ScrollView>

            <ToastMessage type={"success"} ref={successToastRef} />

            <ToastMessage type="danger" ref={errorToastRef} />

            <CustomAlert
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title="Error"
                error={errorMessage}
                message1={alertMessage1}
                message2={alertMessage2}
                isSingleButton={modalVisible}
                onPressButton1={handCloseAlertBox}
            />

            <View style={styles.buttonContainer}>
                <IconButton onPress={() => navigation.navigate('ProductionScheduleHome')} iconName="arrow-left" />
                <IconButton onPress={handleSave} iconName="save" />
            </View>
        </View>
    
        
    )
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 15,
        width: '100%',
    },
    card: {
        backgroundColor: '#FFA500',
        margin: 10,
        padding: 10,
    },
    cardContent: {
        backgroundColor: '#fff',
        margin: 10,
        borderRadius: 10,
    },
    cardSecond: {
        backgroundColor: '#fff',
        margin: 10,
        padding: 10,
    },
    cardThird: {
        backgroundColor: '#FFA500',
        padding: 10,
    },
    title: {
        color: '#FFA500', // Orange color
        fontSize: 20, // Font size
        fontWeight: 'bold', // Bold font
        marginTop: 10,
    },
    text: {
        fontSize: 16,
    },
});


export default MPSCreateForm;