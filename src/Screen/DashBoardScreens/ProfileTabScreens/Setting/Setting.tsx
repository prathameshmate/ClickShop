import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import Icon from "react-native-vector-icons/FontAwesome6"

const Setting = () => {
    const navigation = useNavigation()
    const navigateToDestinationScreen = () => {
        navigation.navigate("MyAddresses")
    }
    return (
        <>
            <View style={{ flex: 1 }}>
                <TouchableOpacity style={{ borderBottomWidth: 1.5, height: 40, margin: 10, padding: 5, borderRadius: 5, backgroundColor: "#fff" ,elevation :5 }} onPress={navigateToDestinationScreen}>
                    <Text style={{ fontSize: 17, fontWeight: "bold", color: "blue" }}> <Icon name="location-dot" size={18} color="blue" /> Saved Address</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

export default Setting;