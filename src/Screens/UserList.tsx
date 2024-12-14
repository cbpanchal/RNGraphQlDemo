import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@apollo/client';
import { LIST_ZELLER_CUSTOMERS } from '../graphql/queries';
import { ZellerCustomer } from '../types/user';

const UserList = () => {
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { loading, error, data, refetch } = useQuery(LIST_ZELLER_CUSTOMERS, {
    variables: {
      filter: roleFilter ? { role: { eq: roleFilter } } : undefined, // Ensure no unnecessary filter is passed
    },
    fetchPolicy: 'network-only', // Ensure fresh data on every filter change
    onCompleted: data => console.log('Data fetched:', data),
    onError: error => console.log('Error:', error),
  });

  const handleRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleFilterChange = (role: string | null) => {
    setRoleFilter(role?.toLocaleUpperCase() || null);
  };

  const filteredUsers = React.useMemo(() => {
    const users = data?.listZellerCustomers?.items || [];
    if (!searchQuery) return users;

    return users.filter((user: ZellerCustomer) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.listZellerCustomers?.items, searchQuery]);

  const renderUserItem = ({ item }: any) => (
    <View style={styles.userItem}>
      <View style={styles.userAvatar}>
        <Text style={styles.avatarText}>{item.name ? item.name[0].toUpperCase() : '?'}</Text>
      </View>
      <View>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userRole}>{item.role}</Text>
      </View>
    </View>
  );

  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Search Box */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Filter Section */}
        <Text style={styles.sectionTitle}>User Types</Text>
        <View style={styles.filterContainer}>
          {['Admin', 'Manager'].map(role => (
            <TouchableOpacity
              key={role}
              style={styles.radioContainer}
              onPress={() => handleFilterChange(role)}
            >
              <View
                style={[
                  styles.radioOuter,
                  roleFilter?.toLocaleLowerCase() === role.toLocaleLowerCase() &&
                    styles.radioOuterSelected,
                ]}
              >
                {roleFilter === role && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>{role}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* User List Section */}
        <Text style={styles.sectionTitle}>
          {roleFilter ? `${roleFilter?.toLocaleUpperCase()} Users` : 'All Users'}
        </Text>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <FlatList
            data={filteredUsers}
            keyExtractor={item => item.id}
            renderItem={renderUserItem}
            contentContainerStyle={styles.listContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D0D7E3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioOuterSelected: {
    backgroundColor: '#4F6EF4',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4F6EF4',
  },
  radioLabel: {
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E9EDF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F6EF4',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userRole: {
    fontSize: 14,
    color: '#666',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#D0D7E3',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
  },
});

export default UserList;
