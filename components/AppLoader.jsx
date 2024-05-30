import React from 'react';
import { View, StyleSheet } from "react-native";
import LottieView from 'lottie-react-native';

// Author: Nguyen Cao Nhan
const AppLoader = () => {
    // Importing the loading animation JSON file
    const loadingAnimation = require('../assets/images/loading.json');
    
    return (
        <View style={[StyleSheet.absoluteFillObject, styles.container]}>
            {/* Rendering the Lottie animation */}
            <LottieView source={loadingAnimation} autoPlay loop style={styles.loading}/>
        </View>
    );
};

// Create loading animation styles
const styles = StyleSheet.create({
    container:  {
        // Fill the entire screen
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // Semi-transparent background color
        backgroundColor: 'rgba(0,0,0,0.3)',
        // Ensure it's on top of other components
        zIndex: 1,
    },
    loading: {
        // Size of the loading animation
        width: 130,
        height: 130,
    },
});

export default AppLoader;
