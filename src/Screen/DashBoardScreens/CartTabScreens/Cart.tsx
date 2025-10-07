import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CartProduct from '../CartProduct';
import getDataFromAPI from '../../../Networks/Network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {navigateToLoginScreen} from '../../../CommonFunctions/CommonFunctions';
import {CONS} from '../../../Constant/Constant';
import {reset_Cart} from '../../../Redux/actions';

const DELIVERY_FEE = 60;

const Cart = () => {
  const navigation = useNavigation();
  const cartItems = useSelector(state => state.cart || []);
  const dispatch = useDispatch();
  const [totalPrice, setTotalPrice] = useState(0);
  const [quantities, setQuantities] = useState({});

  const handleNavigateHome = useCallback(() => {
    navigation.navigate('Home');
    setTotalPrice(0);
  }, [navigation]);

  const handlePriceChange = useCallback(
    (amount, actionType, itemId, newQty) => {
      setQuantities(prev => {
        return {
          ...prev,
          [itemId]: newQty,
        };
      });
      setTotalPrice(prev =>
        actionType === 'plus' ? prev + amount : prev - amount,
      );
    },
    [setTotalPrice],
  );

  const renderCartItem = ({item, index}) => (
    <CartProduct key={index} item={item} sendDataToParent={handlePriceChange} />
  );

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require('../../../../Public/emptyCart.png')}
        style={styles.emptyImage}
      />
      <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
      <Text style={styles.emptySubtitle}>
        Looks like you haven't added anything yet.
      </Text>
      <TouchableOpacity style={styles.shopButton} onPress={handleNavigateHome}>
        <Text style={styles.shopButtonText}>Start Shopping</Text>
      </TouchableOpacity>
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
  const placeOrderApicCall = async () => {
    try {
      const storedData: any = await AsyncStorage.getItem('LoginUserData');
      const parsed = JSON.parse(storedData);

      const customArray = cartItems.map(item => {
        return {
          productId: item?.id?.toString() || '', // from your product id
          name: item?.name || '',
          price: item?.price?.toString() || '',
          quantity: quantities[item.id]?.toString() || '1',
          img: item?.img || '', // optional
        };
      });
      const reqData = {
        items: customArray,
        totalAmount: (totalPrice + DELIVERY_FEE)?.toString(),
        token: parsed.token,
      };

      const response = await getDataFromAPI('placeOrder', reqData);
      if (response?.data?.success) {
        Alert.alert('', response?.data?.message, [
          {
            text: 'OK',
            onPress: async () => {
              handleNavigateHome();
              dispatch(reset_Cart());
            },
          },
        ]);
      } else {
        handleAPIError(response);
      }
    } catch (err) {
      console.log('error while calling placeOrder API:', err);
    }
  };

  const renderCartSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryHeader}>Order Summary</Text>

      <View style={styles.summaryRow}>
        <View>
          <Text style={styles.summaryLabel}>Order Amount</Text>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <Text style={styles.summaryValue}>
            <Icon name="rupee" size={14} /> {totalPrice.toFixed(2)}
          </Text>
          <Text style={styles.summaryValue}>
            <Icon name="rupee" size={14} /> {DELIVERY_FEE.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.summaryFooter}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={styles.totalAmount}>
          <Icon name="rupee" size={16} />{' '}
          {(totalPrice + DELIVERY_FEE).toFixed(2)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.paymentButton}
        onPress={placeOrderApicCall}>
        <Text style={styles.paymentButtonText}>Place Order</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length === 0 ? (
        renderEmptyCart()
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
          {renderCartSummary()}
        </>
      )}
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Empty cart
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 250,
    height: 250,
    marginBottom: 16,
    resizeMode: 'contain',
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
  shopButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#cc0697',
    elevation: 4,
    backgroundColor: '#fff',
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#cc0697',
  },

  // Cart summary
  summaryContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fafafa',
  },
  summaryHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#000',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 12,
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginVertical: 4,
  },
  summaryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: 'green',
  },
  paymentButton: {
    backgroundColor: '#fff',
    elevation: 5,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'green',
  },
  listContent: {
    paddingVertical: 10,
    alignItems: 'center',
  },
});
