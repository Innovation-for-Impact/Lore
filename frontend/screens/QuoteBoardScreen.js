import React, { useContext, useEffect } from "react";
import { Dimensions, View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const QuoteBoardScreen = () => {
    const navigation = useNavigation();
    
    const goBackToCommunity = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={{ position: 'absolute', top: 30, left: 15, zIndex: 10 }} 
                onPress={goBackToCommunity}
            >
                <Ionicons name="arrow-back" size={35} color="white" />
            </TouchableOpacity>
            <Text>This is the Quote Board!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        backgroundColor: "#AFB0E4",
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center" 
    },
});

export default QuoteBoardScreen;