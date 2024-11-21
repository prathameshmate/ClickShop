import {View, StyleSheet} from 'react-native';
import LoaderKit from 'react-native-loader-kit';

import React from 'react';

const Loader = (props: any) => {
  const {isLoading} = props || {isLoading: false};

  return isLoading ? (
    <View style={styles.container}>
      <LoaderKit
        style={{width: 50, height: 50}}
        name={'BallSpinFadeLoader'} // Optional: see list of animations below
        color={'green'} // Optional: color can be: 'red', 'green',... or '#ddd', '#ffffff',...
      />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional: semi-transparent background
    position: 'absolute', // Position it absolutely to overlay
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Loader;
