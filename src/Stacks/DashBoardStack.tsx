import {View, Text} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../Screen/DashBoardScreens/HomeTabScreens/Home';
import ProfileTab from '../Screen/DashBoardScreens/ProfileTabScreens/ProfileTab';
import Cart from '../Screen/DashBoardScreens/CartTabScreens/Cart';
import Wishlist from '../Screen/DashBoardScreens/WishListTabScreens/Wishlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/Feather';

//redux
import {useSelector} from 'react-redux';

const Tab = createBottomTabNavigator();

const DashBoardStack = () => {
  //useSelector of redux for printing how much item present in cart
  const myState = useSelector(state => state.cart);
  const wishhlist = useSelector(state => state.wishlist);
  const len = myState.length;
  const len1 = wishhlist.length;

  const [userData, updateUserData] = useState({});

  useEffect(() => {
    getDataAsyncStorage();
  }, []);

  const getDataAsyncStorage = async () => {
    const result: any = await AsyncStorage.getItem('LoginUserData');
    const userData = JSON.parse(result);
    updateUserData(userData);
  };

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false, // off the tab bar labels
          tabBarIconStyle: {
            width: 50,
          },
          tabBarActiveTintColor: 'red',
          tabBarInactiveTintColor: '#000',
          tabBarActiveBackgroundColor: '#A4DBD9',
        }}>
        <Tab.Screen
          name="Home"
          options={{
            headerTitle: 'ShoppingApp',
            // headerTitleAlign: "center",
            headerTintColor: '#000',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 22,
            },
            headerRight: () => {
              return (
                <View>
                  <Text
                    style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>
                    Hii {userData?.fullname?.trim()?.split(' ')[0]}
                  </Text>
                </View>
              );
            },
            headerRightContainerStyle: {
              // backgroundColor: "red",
              alignItems: 'center',
            },
            tabBarIcon: ({color, size}) => {
              return <Icon name="home" size={30} color={color} />;
            },
          }}
          component={Home}
        />
        <Tab.Screen
          name="ProfileTab"
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => {
              return <Icon1 name="user" size={30} color={color} />;
            },
          }}
          component={ProfileTab}
        />
        <Tab.Screen
          name="Wishlist"
          options={{
            tabBarIcon: ({color, size}) => {
              return <Icon name="heart" size={30} color={color} />;
            },
            tabBarBadge: len1,

            tabBarBadgeStyle: {
              backgroundColor: 'red',
              elevation: 5,
              fontWeight: 'bold',
            },
          }}
          component={Wishlist}
        />
        <Tab.Screen
          name="Cart"
          options={{
            tabBarIcon: ({color, size}) => {
              return <Icon name="shoppingcart" size={35} color={color} />;
            },
            tabBarBadge: len,
            tabBarBadgeStyle: {
              backgroundColor: 'red',
              elevation: 5,
              fontWeight: 'bold',
            },
          }}
          component={Cart}
        />
      </Tab.Navigator>
    </>
  );
};

export default DashBoardStack;
