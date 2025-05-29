import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// Screens
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import LawyerDetailsScreen from '../screens/LawyerDetailsScreen';
import AppointmentBookingScreen from '../screens/AppointmentBookingScreen';
import MyAppointmentsScreen from '../screens/MyAppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';

export type RootStackParamList = {
  Auth: undefined;
  Register: undefined;
  Main: undefined;
  LawyerDetails: { lawyerId: string };
  AppointmentBooking: { lawyerId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'MyAppointments') iconName = focused ? 'calendar' : 'calendar-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
    <Tab.Screen name="MyAppointments" component={MyAppointmentsScreen} options={{ title: 'Мои записи' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
  </Tab.Navigator>
);

export default function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        {!user ? (
          <>
            <Stack.Screen 
              name="Auth" 
              component={AuthScreen}
              options={{
                title: 'Вход',
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{
                title: 'Регистрация',
                headerShown: true,
              }}
            />
          </>
        ) : (
          <>
            <Stack.Screen 
              name="Main" 
              component={MainTabs}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen 
              name="LawyerDetails" 
              component={LawyerDetailsScreen}
              options={{
                title: 'Информация о юристе',
                headerShown: true,
              }}
            />
            <Stack.Screen 
              name="AppointmentBooking" 
              component={AppointmentBookingScreen}
              options={{
                title: 'Запись на консультацию',
                headerShown: true,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
} 