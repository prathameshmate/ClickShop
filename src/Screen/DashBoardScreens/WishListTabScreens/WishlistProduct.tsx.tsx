import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {add_To_Cart, remove_From_Wishlist} from '../../../Redux/actions';
import {CONS} from '../../../Constant/Constant';

const WishlistProduct = (props: any) => {
  const {id, name, img, price} = props.item;
  const dynamicProducts = useSelector(state => state.products);
  const [isAddedCart, setIsAddedCart] = useState(false);

  const myState = useSelector(state => state.cart);
  useEffect(() => {
    let flag = true;
    for (let i = 0; i < myState.length; i++) {
      if (myState[i].name === name) {
        setIsAddedCart(true);
        flag = false;
        break;
      }
    }
    if (flag) setIsAddedCart(false);
  }, [myState]);

  const dispatch = useDispatch();

  // wishlist handles
  const handleRemoveWishlist = (id: any) => {
    dispatch(remove_From_Wishlist(id));
  };

  //cart handles
  const handleAddCart = () => {
    dispatch(add_To_Cart(props.item));
  };

  return (
    <>
      <View style={styles.container}>
        <View style={{width: '100%', height: '60%'}}>
          <Image
            source={
              dynamicProducts.length ? {uri: `${CONS?.baseURL}${img}`} : img
            }
            style={styles.containerImg}
          />
          <TouchableOpacity
            style={styles.containerBtn1}
            onPress={() => {
              handleRemoveWishlist(id);
            }}>
            <Icon name="heart" size={25} color="red" />
          </TouchableOpacity>
        </View>
        <View style={styles.containerView1}>
          <Text style={styles.containerTxt1}>{name}</Text>
          <Text style={styles.containerTxt1}>
            {price} <Icon name="rupee" size={16} color="#000" />
          </Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <Icon name="star" color={'green'} size={18} />
          <Icon name="star" color={'green'} size={18} />
          <Icon name="star" color={'green'} size={18} />
          <Icon name="star" color={'green'} size={18} />
          <Icon name="star-o" color={'#000'} size={18} />
        </View>
        <View style={styles.containerView2}>
          {isAddedCart ? (
            <View style={styles.containerView3}>
              <Text style={{fontWeight: 'bold', color: 'green'}}>
                {' '}
                ✔ Item in cart
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.continerBtn2}
              onPress={handleAddCart}>
              <Text style={{fontWeight: 'bold', color: 'blue'}}>
                Add to cart
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
    width: '47%',
    height: 220,
    margin: 5,
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 15,
  },
  containerImg: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  containerBtn1: {
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerView1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  containerView2: {
    alignItems: 'center',
    paddingTop: 5,
  },
  containerView3: {
    borderWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    elevation: 5,
    width: '60%',
    alignItems: 'center',
  },
  containerTxt1: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
  continerBtn2: {
    borderWidth: 1,
    padding: 5,
    backgroundColor: '#fff',
    elevation: 5,
    width: '60%',
    alignItems: 'center',
  },
});
export default WishlistProduct;
