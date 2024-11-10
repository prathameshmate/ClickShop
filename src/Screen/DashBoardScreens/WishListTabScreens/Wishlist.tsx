import React from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import WishlistProduct from './WishlistProduct.tsx';
import {useNavigation} from '@react-navigation/native';

const Wishlist = () => {
  const myState = useSelector(state => state.wishlist);

  console.log('=================myState in wishlist===================');
  console.log(myState.length);
  console.log('====================================');

  const navigation = useNavigation();
  const navigateToDestinationScreen = () => {
    navigation.navigate('Home');
  };
  return (
    <>
      <ScrollView style={{flex: 1}}>
        {myState.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../../../../Public/wishlist.png')}
              style={styles.emptyContainerImg}
            />
            <Text style={styles.emptyContainerTxt}>Your Wishlist is Empty</Text>
            <Text style={{fontSize: 15, fontWeight: 500}}>
              Look's like you haven't added anything to your Wishlist yet
            </Text>
            <View style={styles.emptyContainerView}>
              <TouchableOpacity
                style={styles.emptyContainerBtn}
                onPress={navigateToDestinationScreen}>
                <Text style={styles.emptyContainerBtnTxt}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            {myState.map((item: any, index: any) => {
              return <WishlistProduct key={index} item={item} />;
            })}
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
    backgroundColor: '#fff',
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
    color: 'red',
  },
});

export default Wishlist;
