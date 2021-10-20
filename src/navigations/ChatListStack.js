import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// screens
import ChatListScreen from '../screens/chatListStack/ChatListScreen';
import WriteNewMessageScreen from '../screens/chatListStack/WriteNewMessageScreen';

const Stack = createStackNavigator();

const ChatListStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ 
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen} 
      />
      <Stack.Screen 
        name="WriteNewMessage" 
        component={WriteNewMessageScreen} 
      />
    </Stack.Navigator>
  );
};

export default ChatListStack;