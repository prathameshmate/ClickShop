import { useNavigation } from '@react-navigation/native';
import React from 'react'
import { View, Text, TouchableOpacity,ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import Address from './Address';

const MyAddress = () => {

    const navigation = useNavigation();
    const navigateToDestinationScreeen = () => {
        navigation.navigate("NewAddress")
    }

    const myState = useSelector((state) => state.address)
    console.log('===================myState in MyAddress=================');
    console.log(myState);
    console.log('====================================');


    return (
        <>
            <View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: 60, paddingHorizontal: 10, backgroundColor: "#fff", elevation: 5 }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>Saved Addresses</Text>
                    <TouchableOpacity style={{ padding: 5, borderRadius: 10, backgroundColor: "#fff", elevation: 5, height: 40, justifyContent: "center" }} onPress={navigateToDestinationScreeen}>
                        <Text style={{ fontSize: 16, color: "blue", fontWeight: "bold" }}> + Add a new address</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView >
                    {
                        myState.map((item: any, index: any) => {
                            return (
                                <Address key={index} item={item} id={index} />
                            );
                        })
                    }
                </ScrollView>
            </View>
        </>
    )
}

export default MyAddress;