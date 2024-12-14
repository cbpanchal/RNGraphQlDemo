import { View, Text, Button } from 'react-native';
import React from 'react';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

const Home = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome to the Home Screen!</Text>
      <View style={{ padding: 10 }}>
        <Button title="Go to User List" onPress={() => navigation.navigate('UserList')} />
      </View>
    </View>
  );
};

export default Home;
