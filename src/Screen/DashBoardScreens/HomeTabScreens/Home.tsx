import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Alert,
  Dimensions,
  TextInput,
} from 'react-native';
import {Products} from '../Products';
import Product from '../../../Product/Product';
import {useFocusEffect} from '@react-navigation/native';
import {logoutAlterBox} from '../../../CommonFunctions/CommonFunctions';
import {useSelector, useDispatch} from 'react-redux';
import {CONS} from '../../../Constant/Constant';
import HomeShimmer from './HomeShimmer';
import Icon from 'react-native-vector-icons/Feather';

const {width} = Dimensions.get('window');

interface Category {
  category: string;
  data: any[]; // Replace 'any' with the actual type of data in Products.categorys
}

const Home = ({navigation}: any) => {
  const [front, updateFront] = useState<any[]>([]);
  const [categorys, updateCategorys] = useState<Category[]>([]);
  const [tShirt, updateTShirt] = useState<any[]>([]);
  const [shirt, updateShirt] = useState<any[]>([]);
  const [jacket, updateJacket] = useState<any[]>([]);
  const [jeansNightTrouserPants, updatejeansNightTrouserPants] = useState<
    any[]
  >([]);
  const [sportShoes, updateSportShoes] = useState<any[]>([]);
  const [casualShoes, updateCasualShoes] = useState<any[]>([]);
  const [formalShoes, updateFormalShoes] = useState<any[]>([]);
  const [watchesSmartWatches, updatewatchesSmartWatches] = useState<any[]>([]);
  const [headset, updateHeadset] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const flatListRef = useRef(null);
  const timerRef = useRef(null);

  const dispatch = useDispatch();
  const dynamicProducts = useSelector(state => state.products);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);

    const source = dynamicProducts.length
      ? dynamicProducts
      : Products.categorys;

    updateFront(source[9]?.data || []);
    updateCategorys(source || []);
    updateTShirt(source[0]?.data || []);
    updateShirt(source[1]?.data || []);
    updateJacket(source[2]?.data || []);
    updatejeansNightTrouserPants(source[3]?.data || []);
    updateSportShoes(source[4]?.data || []);
    updateCasualShoes(source[5]?.data || []);
    updateFormalShoes(source[6]?.data || []);
    updatewatchesSmartWatches(source[7]?.data || []);
    updateHeadset(source[8]?.data || []);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dynamicProducts]);

  useEffect(() => {
    if (!loading) {
      timerRef.current = setTimeout(() => {
        let nextIndex = currentSlideIndex + 1;

        if (nextIndex >= front.length) {
          nextIndex = 0;
        }

        flatListRef.current.scrollToIndex({
          index: nextIndex,
          animated: true,
        });

        setCurrentSlideIndex(nextIndex);
      }, 3000); // scroll every 3 seconds

      return () => clearTimeout(timerRef.current);
    }
  }, [currentSlideIndex, front.length, loading]);

  // search product
  useEffect(() => {
    // Function to filter a category based on search text
    const filterCategory = (data: any[], query: string) => {
      if (!query) return data; // if no search, return original
      return data.filter(item =>
        item?.name
          ?.toString()
          ?.trim()
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
    };

    const source = dynamicProducts.length
      ? dynamicProducts
      : Products.categorys;

    if (search?.length > 0) {
      // Filter all categories
      updateTShirt(filterCategory(source[0]?.data || [], search));
      updateShirt(filterCategory(source[1]?.data || [], search));
      updateJacket(filterCategory(source[2]?.data || [], search));
      updatejeansNightTrouserPants(
        filterCategory(source[3]?.data || [], search),
      );
      updateSportShoes(filterCategory(source[4]?.data || [], search));
      updateCasualShoes(filterCategory(source[5]?.data || [], search));
      updateFormalShoes(filterCategory(source[6]?.data || [], search));
      updatewatchesSmartWatches(filterCategory(source[7]?.data || [], search));
      updateHeadset(filterCategory(source[8]?.data || [], search));
    } else {
      // Reset to original
      updateFront(source[9]?.data || []);
      updateCategorys(source || []);
      updateTShirt(source[0]?.data || []);
      updateShirt(source[1]?.data || []);
      updateJacket(source[2]?.data || []);
      updatejeansNightTrouserPants(source[3]?.data || []);
      updateSportShoes(source[4]?.data || []);
      updateCasualShoes(source[5]?.data || []);
      updateFormalShoes(source[6]?.data || []);
      updatewatchesSmartWatches(source[7]?.data || []);
      updateHeadset(source[8]?.data || []);
    }
  }, [search, dynamicProducts]);


  //BackHandler in Android
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
      return () =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          handleBackButtonClick,
        );
    }, []),
  );

  const handleBackButtonClick = () => {
    logoutAlterBox(navigation, dispatch);
    return true;
  };

  const ProductContainer = (list: any, name = '') => {
    return list?.length > 0 ? (
      <View>
        <View style={{paddingLeft: 10}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>
            {name}
          </Text>
        </View>
        <View style={{margin: 10}}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={list}
            renderItem={({item, index}) => {
              return <Product item={item} />;
            }}
          />
        </View>
      </View>
    ) : null;
  };
  return (
    <>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {loading ? (
          <HomeShimmer />
        ) : (
          <View style={{marginBottom: 30}}>
            {/* search */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 12,
                paddingHorizontal: 12,
                marginVertical: 16,
                backgroundColor: '#fff',
                elevation: 3,
                width: '90%',
                alignSelf: 'center',
                height: 45,
              }}>
              <Icon
                name="search"
                size={22}
                color="#777"
                style={{paddingHorizontal: 4}}
              />
              <TextInput
                placeholder="Search product"
                value={search}
                onChangeText={(value: any) => {
                  setSearch(value);
                }}
                style={{
                  flex: 1,
                  fontSize: 14,
                  color: '#000',
                }}
              />
            </View>
            <View style={{height: 180, width: '100%'}}>
              <FlatList
                ref={flatListRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={front}
                keyExtractor={(_, index) => index.toString()}
                onScrollBeginDrag={() => {
                  clearTimeout(timerRef.current);
                }}
                onMomentumScrollEnd={e => {
                  const contentOffsetX = e.nativeEvent.contentOffset.x;
                  const index = Math.round(contentOffsetX / width);
                  setCurrentSlideIndex(index);
                }}
                onScrollToIndexFailed={info => {
                  setTimeout(() => {
                    flatListRef.current?.scrollToIndex({
                      index: info.index,
                      animated: true,
                    });
                  }, 100); // slight delay to allow list to render
                }}
                renderItem={({item}) => (
                  <View style={{width: width}}>
                    <Image
                      source={
                        dynamicProducts.length
                          ? {uri: `${CONS?.baseURL}${item.img}`}
                          : item.img
                      }
                      resizeMode="contain"
                      style={{
                        height: 180,
                        width: width - 30, // Adjust width as needed
                        borderRadius: 10,
                        alignSelf: 'center',
                      }}
                    />
                  </View>
                )}
              />
            </View>

            <View style={{margin: 10}}>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={categorys}
                renderItem={({item, index}) => {
                  return index !== 9 ? (
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderRadius: 10,
                        marginRight: 20,
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                        marginVertical: 5,
                        backgroundColor: '#fff',
                        elevation: 5,
                      }}>
                      <Text
                        style={{
                          color: '#000',
                          fontSize: 16,
                          fontWeight: 'bold',
                        }}>
                        {item.category}
                      </Text>
                    </TouchableOpacity>
                  ) : null;
                }}
              />
            </View>
            {ProductContainer(tShirt, 'New T-Shirts')}
            {ProductContainer(shirt, 'New Shirts')}
            {ProductContainer(jacket, 'New Jackets')}
            {ProductContainer(
              jeansNightTrouserPants,
              'Jeans / Night / TrouserPants',
            )}
            {ProductContainer(sportShoes, 'Sport Shoes')}
            {ProductContainer(casualShoes, 'Casual Shoes')}
            {ProductContainer(formalShoes, 'Formal Shoes')}
            {ProductContainer(watchesSmartWatches, 'Watches')}
            {ProductContainer(headset, 'Headsets')}
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Home;
