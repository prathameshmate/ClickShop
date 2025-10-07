import React, {useCallback, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import getDataFromAPI from '../../../../Networks/Network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigateToLoginScreen} from '../../../../CommonFunctions/CommonFunctions';
import CartProduct from '../../CartProduct';
import {CONS} from '../../../../Constant/Constant';

const Orders = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);

  // --- Fetch orders data when screen focused
  useFocusEffect(
    useCallback(() => {
      fetchOrderData();
    }, []),
  );

  const renderOrderItem = ({item, index}) => (
    <CartProduct
      from={'order'}
      key={index}
      item={item}
      sendDataToParent={() => {}}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>Your Order is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Looks like you haven't Order anything yet.
      </Text>
    </View>
  );

  const handleAPIError = (response: any) => {
    if (response?.status === 498) {
      Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage, [
        {
          text: 'OK',
          onPress: async () => {
            await AsyncStorage.removeItem('LoginUserData');
            navigateToLoginScreen(navigation, dispatch);
          },
        },
      ]);
    } else {
      Alert.alert('', response?.data?.errorMessage || CONS?.errorMessage);
    }
  };
  const fetchOrderData = async () => {
    try {
      const storedData: any = await AsyncStorage.getItem('LoginUserData');
      if (!storedData) return;

      const parsed = JSON.parse(storedData);
      const response = await getDataFromAPI('pastOrders', {
        token: parsed.token,
      });

      if (response?.data?.success) {
        if (response?.data?.data?.length > 0) {
          let customArray: any = [];

          response?.data?.data?.forEach(element => {
            element.items.forEach(item => {
              customArray.push({
                ...item,
                orderId: element.orderId,
                placedAt: new Date(
                  element?.placedAt?.toString(),
                ).toLocaleDateString(),
              });
            });
          });

          setOrders(customArray);
        }
      } else handleAPIError(response);
    } catch (err) {
      console.log('Profile fetch error:', err);
    }
  };

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        renderEmpty()
      ) : (
        <>
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </View>
  );
};

export default Orders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Empty order
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  emptySubtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#555',
    textAlign: 'center',
    marginVertical: 8,
  },
  listContent: {
    paddingVertical: 10,
    alignItems: 'center',
  },
});
