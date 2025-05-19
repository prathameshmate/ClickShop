import {View, Text, Dimensions, FlatList} from 'react-native';
import React from 'react';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const HomeShimmer = () => {
  const width = Dimensions.get('window').width;
  return (
    <View>
      <ShimmerPlaceholder
        LinearGradient={LinearGradient}
        style={{
          height: 160,
          width: width - 30,
          borderRadius: 10,
          alignSelf: 'center',
        }}
      />

      <FlatList
        data={[1, 2, 3, 4, 5]}
        keyExtractor={item => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => (
          <ShimmerPlaceholder
            key={item}
            LinearGradient={LinearGradient}
            style={{
              height: 50,
              width: 100,
              borderRadius: 10,
              margin: 15,
            }}
          />
        )}
      />
      <FlatList
        data={[1, 2, 3, 4]}
        keyExtractor={item => item.toString()}
        showsHorizontalScrollIndicator={false}
        numColumns={2}
        renderItem={({item, index}) => (
          <ShimmerPlaceholder
            LinearGradient={LinearGradient}
            style={{
              height: 160,
              width: width / 2.2,
              borderRadius: 10,
              alignSelf: 'center',
              margin: 10,
            }}
          />
        )}
      />
    </View>
  );
};

export default HomeShimmer;
