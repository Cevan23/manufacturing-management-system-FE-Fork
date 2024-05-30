import { StyleSheet } from 'react-native';

const images ={
    logo: require('../../assets/images/logo.png'),
};

// Styles of the CustomAlert component
// Author: Pham Hien Nhan
const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    modalContainer: {
        flex:1,
        backgroundColor: 'rgba(0,0,0, 0.25)',
        justifyContent: "center",
        alignItems: "center",
    },
    modal: {
        backgroundColor: '#102d66',
        width: 330,
        height: 270,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center'
    },
    singleButtonContainer: {
        height: 70,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 10,
    },
    doubleButtonContainer: {
        height: 70,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    logo: {
        width: 90,
        height: 90,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    text: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#ff9c01',
        width: '47%',
        height: '100%',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export { images, styles };