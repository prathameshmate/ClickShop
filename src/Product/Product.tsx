import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  InteractionManager,
  NativeEventEmitter,
  NativeModules,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useDispatch, useSelector} from 'react-redux';
import {
  add_To_Cart,
  remove_From_Cart,
  add_To_Wishlist,
  remove_From_Wishlist,
} from '../Redux/actions';
import {CONS} from '../Constant/Constant';

const eventEmitter = new NativeEventEmitter(NativeModules.ReactNativeEventEmitter);

const Product = ({item}: any) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart);
  const wishlist = useSelector((state: any) => state.wishlist);
  const dynamicProducts = useSelector((state: any) => state.products);

  const {id, name, price, img} = item;

  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // --- Update Cart state ---
  useEffect(() => {
    setIsInCart(cart.some((product: any) => product.name === name));
  }, [cart, name]);

  // --- Update Wishlist state ---
  useEffect(() => {
    setIsInWishlist(wishlist.some((product: any) => product.name === name));
  }, [wishlist, name]);

  // --- Helper: show/hide loader ---
  const withLoader = useCallback((action: () => void) => {
    eventEmitter.emit('showLoader', true);
    action();
    requestAnimationFrame(() => {
      InteractionManager.runAfterInteractions(() => {
        eventEmitter.emit('showLoader', false);
      });
    });
  }, []);

  // --- Cart Handlers ---
  const handleAddCart = () => withLoader(() => dispatch(add_To_Cart(item)));
  const handleRemoveCart = () => withLoader(() => dispatch(remove_From_Cart(id)));

  // --- Wishlist Handlers ---
  const handleAddWishlist = () => withLoader(() => dispatch(add_To_Wishlist(item)));
  const handleRemoveWishlist = () => withLoader(() => dispatch(remove_From_Wishlist(id)));

  // --- Product image source ---
  const imageSource = dynamicProducts.length
    ? {uri: `${CONS.baseURL}${img}`}
    : img;

  return (
    <View style={styles.card}>
      <Image
        source={imageSource}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.detailsContainer}>
        <Text style={styles.productName}>{name}</Text>

        <View style={styles.row}>
          <Text style={styles.price}>
            <Icon name="rupee" size={14} color="#000" /> {price}
          </Text>

          <TouchableOpacity
            style={[styles.cartButton, {borderColor: isInCart ? 'red' : '#FF5533'}]}
            onPress={isInCart ? handleRemoveCart : handleAddCart}>
            <Text style={[styles.cartButtonText, {color: isInCart ? 'red' : '#FF5533'}]}>
              {isInCart ? 'Remove' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.wishlistButton}
        onPress={isInWishlist ? handleRemoveWishlist : handleAddWishlist}>
        <Icon name={isInWishlist ? 'heart' : 'heart-o'} size={16} color={isInWishlist ? 'red' : '#000'} />
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(Product);

const styles = StyleSheet.create({
  card: {
    width: 200,
    height: 200,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 5,
    marginRight: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '60%',
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  cartButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    elevation: 4,
  },
  cartButtonText: {
    fontWeight: '600',
    fontSize: 13,
  },
  wishlistButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
