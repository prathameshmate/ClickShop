import React, {useCallback} from 'react';
import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Address from './Address';

const MyAddress = () => {
  const navigation = useNavigation();
  const addresses = useSelector(state => state.address || []);

  const handleAddNewAddress = useCallback(() => {
    navigation.navigate('NewAddress');
  }, [navigation]);

  const renderAddressItem = ({item, index}) => (
    <Address key={index} item={item} id={index} />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No saved addresses yet</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewAddress}>
          <Text style={styles.addButtonText}>+ Add a new address</Text>
        </TouchableOpacity>
      </View>

      {/* Address List */}
      <FlatList
        data={addresses}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderAddressItem}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={
          addresses.length === 0 && styles.emptyListContainer
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default MyAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  addButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 3,
  },
  addButtonText: {
    fontSize: 15,
    color: '#007BFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6C757D',
    fontWeight: '500',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
