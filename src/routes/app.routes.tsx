import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home } from '../pages/Home/home';
import { UserDetails } from '../pages/UserDetails/userdetails';
import { UserProfile } from '../pages/UserProfile/userprofile';
import { UserProfileEdit } from '../pages/UserProfileEdit/userprofileedit';
import { UserProfilePassword } from '../pages/UserProfilePassword/userprofilepassword';

const App = createNativeStackNavigator();

export const AppRoutes: React.FunctionComponent = () => {
  return (
    <App.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
    >
      <App.Screen name="Home" component={Home} />
      <App.Screen name="UserDetails" component={UserDetails} />
      <App.Screen name="UserProfile" component={UserProfile} />
      <App.Screen name="UserProfileEdit" component={UserProfileEdit} />
      <App.Screen name="UserProfilePassword" component={UserProfilePassword} />
    </App.Navigator>
  );
};
