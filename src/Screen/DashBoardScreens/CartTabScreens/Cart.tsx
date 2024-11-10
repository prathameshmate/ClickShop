import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import CartProduct from '../CartProduct';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const Cart = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const myState = useSelector(state => state.cart);

  console.log('=================mystate in cart===================');
  console.log(myState);
  console.log('====================================');

  const navigation = useNavigation();

  const navigationToDestinationScreen = () => {
    navigation.navigate('Home');
    setTotalPrice(0);
  };

  // Function to receive data from the child
  const receiveDataFromChild = (data: any, str: any) => {
    if (str === 'plus') {
      setTotalPrice(totalPrice + data);
    } else {
      setTotalPrice(totalPrice - data);
    }
  };
  console.log('totalPrice :  :' + totalPrice);

  return (
    <>
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
        {myState.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../../../../Public/emptyCart.png')}
              style={styles.emptyContainerImg}
            />
            <Text style={styles.emptyContainerTxt}>Your Cart is Empty</Text>
            <Text style={{fontSize: 15, fontWeight: 500}}>
              Look's like you haven't added anything to your Cart yet
            </Text>
            <View style={styles.emptyContainerView}>
              <TouchableOpacity
                style={styles.emptyContainerBtn}
                onPress={navigationToDestinationScreen}>
                <Text style={styles.emptyContainerBtnTxt}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <View style={{alignItems: 'center'}}>
              {myState.map((item: any, index: any) => {
                return (
                  <CartProduct
                    key={index}
                    item={item}
                    sendDataToParent={receiveDataFromChild}
                  />
                );
              })}
            </View>
            <View style={styles.orderSummaryContainer}>
              <View style={styles.orderSummaryView1}>
                <Text style={styles.orderSummaryTxt1}>Order Summary :</Text>
              </View>
              <View style={styles.orderSummaryView2}>
                <View>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>
                    Order Ammout :{' '}
                  </Text>
                  <Text style={{fontSize: 16, fontWeight: '500'}}>
                    Delivery Fee :{' '}
                  </Text>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <Text style={styles.orderSummaryTxt1}>{totalPrice}</Text>
                  <Text style={styles.orderSummaryTxt2}>60</Text>
                </View>
              </View>
              <View style={styles.orderSummaryView3}>
                <View>
                  <Text style={styles.orderSummaryTxt1}>Total</Text>
                  <Text style={styles.orderSummaryTxt1}>
                    {totalPrice + 60}.00{' '}
                    <Icon name="rupee" size={20} color="#000" />{' '}
                  </Text>
                </View>
                <View>
                  <TouchableOpacity style={styles.orderSummaryBtn}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'green',
                      }}>
                      Make Payment
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    height: 580,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainerImg: {
    width: 300,
    height: 300,
    backgroundColor: '#fff',
  },
  emptyContainerTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  emptyContainerView: {
    width: '100%',
    height: 100,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  emptyContainerBtn: {
    width: '50%',
    height: 50,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 70,
    borderWidth: 0.5,
  },
  emptyContainerBtnTxt: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#cc0697',
  },
  orderSummaryContainer: {
    height: 220,
    padding: 10,
  },
  orderSummaryView1: {
    borderBottomWidth: 2,
    borderStyle: 'dashed',
    padding: 5,
  },
  orderSummaryView2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 25,
    borderBottomWidth: 2,
    borderStyle: 'dashed',
  },
  orderSummaryView3: {
    flexDirection: 'row',
    marginVertical: 15,
    justifyContent: 'space-between',
  },
  orderSummaryTxt1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  orderSummaryTxt2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  orderSummaryBtn: {
    width: 150,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 5,
  },
});

export default Cart;
