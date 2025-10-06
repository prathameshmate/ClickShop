import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {remove_From_Cart} from '../../Redux/actions';
import {CONS} from '../../Constant/Constant';

const CartProduct = (props: any) => {
  var {
    id,
    name,
    img,
    price,
    orderId = '',
    quantity: qyt = '1',
    placedAt = '',
  } = props.item || {}; // obj destructure
  var {from = ''} = props || {}; // obj destructure
  const dynamicProducts = useSelector(state => state.products);

  const sendDataToParent = props.sendDataToParent; // fuction destructure

  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();

  const handleRemoveCart = (id: any) => {
    sendDataToParent(price * quantity, 'minus', id, 0);
    dispatch(remove_From_Cart(id));
  };

  //quantity handle
  const handlePlusQty = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    sendDataToParent(price, 'plus', id, newQty);
  };
  const handleMinusQty = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      sendDataToParent(price, 'minus', id, newQty);
    }
  };

  // first time render
  useEffect(() => {
    sendDataToParent(price, 'plus');
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={{flex: 1.5}}>
          <Image
            source={
              from !== 'order'
                ? dynamicProducts.length
                  ? {uri: `${CONS?.baseURL}${img}`}
                  : img
                : {uri: `${CONS?.baseURL}${img}`}
            }
            style={[
              styles.containerImg,
              {height: from === 'order' ? '100%' : '82%'},
            ]}
          />

          {from !== 'order' && (
            <View style={styles.containerView1}>
              <Text style={styles.containerViewTxt1}>Qtys :</Text>
              <TouchableOpacity
                style={{paddingHorizontal: 5}}
                onPress={handleMinusQty}>
                <Icon1 name="minus" size={20} color={'#000'} />
              </TouchableOpacity>
              <Text style={styles.containerViewTxt2}>{quantity}</Text>
              <TouchableOpacity
                style={{paddingHorizontal: 5}}
                onPress={handlePlusQty}>
                <Icon1 name="plus" size={20} color={'#000'} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.containerView2}>
          <Text
            style={[
              styles.containerViewTxt3,
              {alignSelf: from === 'order' ? 'flex-start' : 'center'},
            ]}>
            {name} Premium Quality
          </Text>
          {from === 'order' && (
            <View>
              <Text
                style={[
                  styles.containerViewTxt2,
                  {fontSize: 14, alignSelf: 'flex-start'},
                ]}>
                <Text style={styles.containerViewTxt5}>Order ID : </Text>
                {orderId}
              </Text>
              <Text
                style={[
                  styles.containerViewTxt2,
                  {fontSize: 14, alignSelf: 'flex-start', marginTop: 2},
                ]}>
                <Text style={styles.containerViewTxt5}>Order Quantity : </Text>
                {qyt}
              </Text>
              <Text
                style={[
                  styles.containerViewTxt2,
                  {fontSize: 14, alignSelf: 'flex-start', marginTop: 2},
                ]}>
                <Text style={styles.containerViewTxt5}>Order Date : </Text>
                {placedAt}
              </Text>
            </View>
          )}
          {from !== 'order' && (
            <View style={{flexDirection: 'row'}}>
              <Icon name="star" color={'green'} size={18} />
              <Icon name="star" color={'green'} size={18} />
              <Icon name="star" color={'green'} size={18} />
              <Icon name="star" color={'green'} size={18} />
              <Icon name="star-o" color={'#000'} size={18} />
            </View>
          )}
          <Text
            style={[
              styles.containerViewTxt4,
              {alignSelf: from === 'order' ? 'flex-start' : 'center'},
              {fontSize: from === 'order' ? 14 : 18},
              {marginLeft: from === 'order' ? 15 : 0},
            ]}>
            {from === 'order' ? (
              <Text style={styles.containerViewTxt5}>Price : </Text>
            ) : (
              'Price :'
            )}
            <Icon name="rupee" size={16} color="#000" />
            {price * quantity}{' '}
          </Text>
          {from !== 'order' && (
            <TouchableOpacity
              style={styles.containerBtn}
              onPress={() => {
                handleRemoveCart(id);
              }}>
              <Text style={{fontWeight: 500, color: 'red'}}>
                Remove <Icon1 name="delete" size={18} />
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 150,
    backgroundColor: '#fff',
    elevation: 5,
    marginTop: 10,
    flexDirection: 'row',
  },
  containerImg: {
    width: '100%',
    borderBottomRightRadius: 10,
  },
  containerView1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  containerView2: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  containerViewTxt1: {
    color: 'red',
    fontSize: 15,
    fontWeight: 'bold',
  },
  containerViewTxt2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    paddingHorizontal: 5,
  },
  containerViewTxt3: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'center',
    marginHorizontal: 10,
  },
  containerViewTxt4: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  containerViewTxt5: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'green',
  },
  containerBtn: {
    borderBottomWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    elevation: 5,
  },
});

export default CartProduct;
