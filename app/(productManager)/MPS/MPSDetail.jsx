import React, { useState, useEffect, useRef } from 'react';
import { getMPSByID, updateMPS, deleteMPS } from '../../../services/MPSServices';
import { useGlobalContext } from '../../../context/GlobalProvider';
import IconButton from '../../../components/IconButton';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FormField, ToastMessage } from "../../../components";
import CustomAlert from "../../../components/CustomAlert";
import AlertWithTwoOptions from "../../../components/AlertWithTwoOptions";

// Master Production Schedule Detail page
// Author: Pham Van Cao
const ProductionScheduleDetail = ({ route }) => {
    const { id } = route.params;
    const { token } = useGlobalContext();
    const [ mpsDetail, setMPSDetail ] = useState({});
    const navigation = useNavigation();
    const successToastRef = useRef(null);
    const errorToastRef = useRef(null);
    const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [alertMessage1, setAlertMessage1] = useState("");
    const [alertMessage2, setAlertMessage2] = useState("");

    // Fetch MPS by ID
    // Author: Pham Van Cao
    useEffect(() => {
        const fetchData = async () => {
            console.log("id: ", id);
            // Get MPS by ID
            // Author: Pham Van Cao
            const response = await getMPSByID(token, id); // replace token with actual token
            console.log("response: ", response);
            setMPSDetail(response.result);
        };
        fetchData();
    }, []);

    // Save MPS update
    // Author: Pham Van Cao
    const handleSave = async () => {
        try {
            console.log("mpsDetail: ", mpsDetail);
            // Update MPS
            // Author: Pham Van Cao
            const response = await updateMPS(token, mpsDetail);
            console.log("response: ", response);
            if (successToastRef.current) {
                successToastRef.current.show({
                    type: 'success',
                    text: 'Master Production Schedule',
                    description: 'MPS updated successfully.'
                });
            }
            setTimeout(() => {
                navigation.goBack();
            }, 3500);
        } catch (error) {
            console.error(error);
            if (errorToastRef.current) {
                errorToastRef.current.show({
                    type: 'danger',
                    text: 'Cannot update MPS',
                    description: 'MPS update failed: ' + error
                });
            }
        }
    };

    // Delete MPS
    // Author: Pham Van Cao
    const handleDelete = async () => {
        try {
            // Delete MPS by ID in the database
            // Author: Pham Van Cao
            const response = await deleteMPS(token, id);
            console.log("response: ", response);
            if (successToastRef.current) {
                successToastRef.current.show({
                    type: 'success',
                    text: 'Master Production Schedule',
                    description: 'MPS deleted successfully.'
                });
            }
            setTimeout(() => {
                navigation.goBack();
            }, 3500);
        } catch (error) {
            console.error(error);
            if (errorToastRef.current) {
                errorToastRef.current.show({
                    type: 'danger',
                    text: 'Cannot delete MPS',
                    description: 'MPS delete failed: ' + error
                });
            }
        }
    };

    // Handle start date change
    // Author: Pham Hien Nhan
    const handleStartDateChange = (selectedDate) => {
        if (selectedDate <= mpsDetail.dateEnd) {
            setMPSDetail(prevState => ({ ...prevState, dateStart: selectedDate }));
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
        if (selectedDate >= mpsDetail.dateStart) {
            setMPSDetail(prevState => ({ ...prevState, dateEnd: selectedDate }));
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
        <View className="bg-primary h-full" style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, margin: 20, marginBottom: 70 }}>
                <Card style={styles.card}>
                    <Card.Title
                        title={mpsDetail?.productName}
                        subtitle={"Product manager: " + mpsDetail?.productManagerName}
                        titleStyle={styles.title} />

                    <Card.Content>
                        <Text style={styles.text}>MPS ID: {mpsDetail?.mpsID}</Text>
                        <FormField
                            title="Start Date"
                            placeholder={mpsDetail.dateStart}
                            value={mpsDetail.dateStart}
                            otherStyles="mt-3"
                            edit={true}
                            onPress={handleStartDateChange}
                        />

                        <FormField
                            title="End Date"
                            placeholder={mpsDetail.dateEnd}
                            value={mpsDetail.dateEnd}
                            otherStyles="mt-3"
                            edit={true}
                            onPress={handleEndDateChange}
                        />

                        <FormField
                            title="Quantity"
                            placeholder={mpsDetail?.quantity ? mpsDetail.quantity.toString() : ''}
                            value={mpsDetail?.quantity ? mpsDetail.quantity.toString() : ''}
                            otherStyles="mt-3"
                            edit={true}
                            handleChangeText={text => setMPSDetail(prevState => ({ ...prevState, quantity: parseInt(text) }))}
                        />

                        <Card.Title title="Additional Details" titleStyle={styles.title} />
                        <Card style={styles.cardSecondContainer}>
                            <Card.Content>
                                <FormField
                                    title="Require Time"
                                    placeholder={mpsDetail?.requireTime ? mpsDetail.requireTime.toString() : ''}
                                    value={mpsDetail?.requireTime ? mpsDetail.requireTime.toString() : ''}
                                    otherStyles="mt-3"
                                    edit={true}
                                    handleChangeText={text => setMPSDetail(prevState => ({ ...prevState, requireTime: text }))}
                                />

                                <FormField
                                    title="Duration Hour"
                                    placeholder={mpsDetail?.durationHour ? mpsDetail.durationHour.toString() : ''}
                                    value={mpsDetail?.durationHour ? mpsDetail.durationHour.toString() : ''}
                                    otherStyles="mt-3"
                                    edit={true}
                                    handleChangeText={text => setMPSDetail(prevState => ({ ...prevState, durationHour: text }))}
                                />

                                <FormField
                                    title="Effort Hour"
                                    placeholder={mpsDetail?.effortHour ? mpsDetail.effortHour.toString() : ''}
                                    value={mpsDetail?.effortHour ? mpsDetail.effortHour.toString() : ''}
                                    otherStyles="mt-3"
                                    edit={true}
                                    handleChangeText={text => setMPSDetail(prevState => ({ ...prevState, effortHour: text }))}
                                />

                                <FormField
                                    // title="In Progress"
                                    placeholder="In Progress"
                                    value={mpsDetail?.in_progress ? mpsDetail.in_progress.toString() : ''}
                                    otherStyles="mt-1"
                                    edit={true}
                                    handleChangeText={text => { setMPSDetail(prevState => ({ ...prevState, in_progress: text })) }}
                                />
                            </Card.Content>
                        </Card>
                    </Card.Content>
                </Card>
            </ScrollView>

            <ToastMessage type={"success"} ref={successToastRef} />

            <ToastMessage type="danger" ref={errorToastRef} />

            <View style={styles.buttonContainer}>
                <IconButton onPress={() => navigation.navigate('ProductionScheduleHome')} iconName="arrow-left" />
                <IconButton onPress={handleSave} iconName="save" />
                <IconButton
					onPress={() => {
						setConfirmationModalVisible(true);
					}}
					iconName="trash"
				/>
            </View>
            <AlertWithTwoOptions
				visible={confirmationModalVisible}
				message="Are you sure?"
				onYesPress={() => {
					handleDelete();
					setConfirmationModalVisible(false);
				}}
				onNoPress={() => setConfirmationModalVisible(false)}
			/>
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
        margin: 10,
        padding: 10,
    },
    title: {
        color: '#FFA500', // Orange color
        fontSize: 20, // Font size
        fontWeight: 'bold', // Bold font,
        marginTop: 10
    },
    cardContent: {

    },
    text: {
        fontSize: 16,
    },
    cardSecondContainer: {
        // margin: 5,
    },
});

export default ProductionScheduleDetail;
