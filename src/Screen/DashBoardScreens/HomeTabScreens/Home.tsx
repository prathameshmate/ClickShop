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
} from 'react-native';
import {Products} from '../Products';
import Product from '../../../Product/Product';
import {useFocusEffect} from '@react-navigation/native';
import {logoutAlterBox} from '../../../CommonFunctions/CommonFunctions';
import {useSelector, useDispatch} from 'react-redux';
import {CONS} from '../../../Constant/Constant';

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

  const flatListRef = useRef(null);
  const timerRef = useRef(null);

  const dispatch = useDispatch();
  const dynamicProducts = useSelector(state => state.products);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    updateFront(
      dynamicProducts.length
        ? dynamicProducts[9].data
        : Products.categorys[9].data,
    );
    updateCategorys(
      dynamicProducts.length ? dynamicProducts : Products.categorys,
    );
    updateTShirt(
      dynamicProducts.length
        ? dynamicProducts[0].data
        : Products.categorys[0].data,
    );
    updateShirt(
      dynamicProducts.length
        ? dynamicProducts[1].data
        : Products.categorys[1].data,
    );
    updateJacket(
      dynamicProducts.length
        ? dynamicProducts[2].data
        : Products.categorys[2].data,
    );
    updatejeansNightTrouserPants(
      dynamicProducts.length
        ? dynamicProducts[3].data
        : Products.categorys[3].data,
    );
    updateSportShoes(
      dynamicProducts.length
        ? dynamicProducts[4].data
        : Products.categorys[4].data,
    );
    updateCasualShoes(
      dynamicProducts.length
        ? dynamicProducts[5].data
        : Products.categorys[5].data,
    );
    updateFormalShoes(
      dynamicProducts.length
        ? dynamicProducts[6].data
        : Products.categorys[6].data,
    );
    updatewatchesSmartWatches(
      dynamicProducts.length
        ? dynamicProducts[7].data
        : Products.categorys[7].data,
    );
    updateHeadset(
      dynamicProducts.length
        ? dynamicProducts[8].data
        : Products.categorys[8].data,
    );
  }, [dynamicProducts]);

  useEffect(() => {
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
  }, [currentSlideIndex, front.length]);

  console.log('currentSlideIndex', currentSlideIndex);

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

  console.log('=================tshirt===================');
  // console.log(front);
  console.log(tShirt);

  console.log('================== ==================');
  return (
    <>
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        <View style={{marginBottom: 30}}>
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
                      padding: 10,
                      backgroundColor: '#fff',
                      elevation: 5,
                    }}>
                    <Text
                      style={{color: '#000', fontSize: 16, fontWeight: 'bold'}}>
                      {item.category}
                    </Text>
                  </TouchableOpacity>
                ) : null;
              }}
            />
          </View>
          <View style={{paddingLeft: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>
              New T-Shirts
            </Text>
          </View>
          <View style={{margin: 10}}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={tShirt}
              renderItem={({item, index}) => {
                return <Product item={item} />;
              }}
            />
          </View>
          <View style={{paddingLeft: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>
              New Shirts
            </Text>
          </View>
          <View style={{margin: 10}}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={shirt}
              renderItem={({item, index}) => {
                return <Product item={item} />;
              }}
            />
          </View>
          <View style={{paddingLeft: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>
              New Jackets
            </Text>
          </View>
          <View style={{margin: 10}}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={jacket}
              renderItem={({item, index}) => {
                return <Product item={item} />;
              }}
            />
          </View>
          <View style={{paddingLeft: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>
              Jeans / Night / TrouserPants
            </Text>
          </View>
          <View style={{margin: 10}}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={jeansNightTrouserPants}
              renderItem={({item, index}) => {
                return <Product item={item} />;
              }}
            />
          </View>
          <View style={{paddingLeft: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>
              Sport Shoes
            </Text>
          </View>
          <View style={{margin: 10}}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={sportShoes}
              renderItem={({item, index}) => {
                return <Product item={item} />;
              }}
            />
          </View>
          <View style={{paddingLeft: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>
              Casual Shoes
            </Text>
          </View>
          <View style={{margin: 10}}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={casualShoes}
              renderItem={({item, index}) => {
                return <Product item={item} />;
              }}
            />
          </View>
          <View style={{paddingLeft: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>
              Formal Shoes
            </Text>
          </View>
          <View style={{margin: 10}}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={formalShoes}
              renderItem={({item, index}) => {
                return <Product item={item} />;
              }}
            />
          </View>
          <View style={{paddingLeft: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>
              Watches
            </Text>
          </View>
          <View style={{margin: 10}}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={watchesSmartWatches}
              renderItem={({item, index}) => {
                return <Product item={item} />;
              }}
            />
          </View>
          <View style={{paddingLeft: 10}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#000'}}>
              Headsets
            </Text>
          </View>
          <View style={{margin: 10}}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={headset}
              renderItem={({item, index}) => {
                return <Product item={item} />;
              }}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Home;
