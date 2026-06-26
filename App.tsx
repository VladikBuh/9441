import React from 'react';
import {LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

LogBox.ignoreLogs(['Sending `onAnimatedValueUpdate`']);

import {AppNavigator} from './src/navigation/AppNavigator';

const Stack = createNativeStackNavigator();

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Main" component={AppNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
