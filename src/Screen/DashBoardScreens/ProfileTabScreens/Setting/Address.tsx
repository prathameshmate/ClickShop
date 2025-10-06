import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import { useDispatch } from 'react-redux';
import { delete_Address } from '../../../../Redux/actions';
//
const Address = (props: any) => {
    const { name, number, pin, state, city, locality, home, work } = props.item; // object destucture
    const id = props.id;

    const dispatch = useDispatch();
    const handleDeleteAddress = (id: any) => {
        dispatch(delete_Address(id))

    }

    return (
        <>
            <View style={{ backgroundColor: "#fff", elevation: 5, marginVertical: 8, padding: 10 }}>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>{name} </Text>
                    <Text style={{ backgroundColor: "lightgray", paddingVertical: 3, paddingHorizontal: 5, color: "#000" }}>{home ? "HOME" : "WORK"}</Text>
                </View>
                <View style={{ flexDirection: "row", marginVertical: 5 }}>
                    <Text style={{ fontSize: 16, color: "#000" }}>{`${city}, ${locality} ,${city} , ${state} - ${pin}`} </Text>

                </View>
                <View style={{ marginVertical: 5 }}>
                    <Text style={{ fontSize: 16, color: "#000", }}>{number}</Text>
                </View>
                <TouchableOpacity style={{ position: "absolute", top: 10, right: 10 }} onPress={() => { handleDeleteAddress(id) }}>
                    <Icon name='delete' size={22} color={"red"} />
                </TouchableOpacity>
            </View>
        </>
    );
}

export default Address; 