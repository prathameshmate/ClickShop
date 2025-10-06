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
import {useNavigation} from '@react-navigation/native';
import WishlistProduct from './WishlistProduct.tsx';

const Wishlist = () => {
  const wishlist = useSelector((state: any) => state.wishlist);
  const navigation = useNavigation();

  const handleStartShopping = () => navigation.navigate('Home');

  const isEmpty = wishlist.length === 0;

  return (
    <View style={styles.container}>
      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../../../Public/wishlist.png')}
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Looks like you haven’t added anything to your Wishlist yet
          </Text>

          <TouchableOpacity
            style={styles.startShoppingButton}
            onPress={handleStartShopping}>
            <Text style={styles.startShoppingText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer}>
          {wishlist.map((item: any, index: number) => (
            <WishlistProduct key={index.toString()} item={item} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginTop: 5,
  },
  startShoppingButton: {
    marginTop: 30,
    backgroundColor: '#ff3b30',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
  },
  startShoppingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  listContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});
