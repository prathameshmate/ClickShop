import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import {Products} from '../Products';
import Product from '../../../Product/Product';
import {useFocusEffect} from '@react-navigation/native';
import {logoutAlterBox} from '../../../CommonFunctions/CommonFunctions';

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

  useEffect(() => {
    updateFront(Products.categorys[9].data);
    updateCategorys(Products.categorys);
    updateTShirt(Products.categorys[0].data);
    updateShirt(Products.categorys[1].data);
    updateJacket(Products.categorys[2].data);
    updatejeansNightTrouserPants(Products.categorys[3].data);
    updateSportShoes(Products.categorys[4].data);
    updateCasualShoes(Products.categorys[5].data);
    updateFormalShoes(Products.categorys[6].data);
    updatewatchesSmartWatches(Products.categorys[7].data);
    updateHeadset(Products.categorys[8].data);
  }, []);

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
    logoutAlterBox(navigation);
    return true;
  };

  console.log('=================tshirt===================');
  // console.log(front);
  console.log(tShirt);

  console.log('================== ==================');
  return (
    <>
      <ScrollView style={{flex: 1}}>
        <View style={{marginBottom: 30}}>
          <View style={{height: 170, width: '100%'}}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={front}
              renderItem={({item}) => {
                return (
                  <Image
                    source={item.img}
                    style={{
                      height: 170,
                      width: 410,
                      borderRadius: 10,
                      marginRight: 10,
                    }}
                  />
                );
              }}
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
