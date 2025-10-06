//import liraries
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// create a component for Showing Error text
const CommonErrorText = props => {
  return (
    <View style={props.style ? props.style : null}>
      {props.errorMessage ? (
        <Text style={styles.labelText}>
          {props.errorMessage !== null ? props.errorMessage : ''}
        </Text>
      ) : null}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  labelText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 2,
  },
});

//make this component available to the app
export default CommonErrorText;
