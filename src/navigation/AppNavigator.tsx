import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types/index';

// Импорты экранов
import HomeScreen from '../screens/HomeScreen';
import LawyerListScreen from '../screens/LawyerListScreen';
import LawyerDetailsScreen from '../screens/LawyerDetailsScreen';
import AppointmentBookingScreen from '../screens/AppointmentBookingScreen';
import MyAppointmentsScreen from '../screens/MyAppointmentsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { AuthScreen } from '../screens/AuthScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ClientTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
        else if (route.name === 'Lawyers') iconName = focused ? 'people' : 'people-outline';
        else if (route.name === 'Appointments') iconName = focused ? 'calendar' : 'calendar-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Главная' }} />
    <Tab.Screen name="Lawyers" component={LawyerListScreen} options={{ title: 'Юристы' }} />
    <Tab.Screen name="Appointments" component={MyAppointmentsScreen} options={{ title: 'Мои записи' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
  </Tab.Navigator>
);

const LawyerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Schedule') iconName = focused ? 'calendar' : 'calendar-outline';
        else if (route.name === 'Appointments') iconName = focused ? 'list' : 'list-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Schedule" component={HomeScreen} options={{ title: 'Расписание' }} />
    <Tab.Screen name="Appointments" component={MyAppointmentsScreen} options={{ title: 'Записи' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
  </Tab.Navigator>
);

const AdminTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Dashboard') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
        else if (route.name === 'Lawyers') iconName = focused ? 'people' : 'people-outline';
        else if (route.name === 'Appointments') iconName = focused ? 'calendar' : 'calendar-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Dashboard" component={HomeScreen} options={{ title: 'Панель управления' }} />
    <Tab.Screen name="Lawyers" component={LawyerListScreen} options={{ title: 'Юристы' }} />
    <Tab.Screen name="Appointments" component={MyAppointmentsScreen} options={{ title: 'Записи' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Профиль' }} />
  </Tab.Navigator>
);

const getRoleBasedNavigator = (role: UserRole) => {
  switch (role) {
    case 'client':
      return ClientTabs;
    case 'lawyer':
      return LawyerTabs;
    case 'admin':
      return AdminTabs;
    default:
      return ClientTabs;
  }
};

export const AppNavigator = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Main" component={getRoleBasedNavigator(user.role)} options={{ headerShown: false }} />
            <Stack.Screen name="LawyerDetails" component={LawyerDetailsScreen} options={{ title: 'Информация о юристе' }} />
            <Stack.Screen name="AppointmentBooking" component={AppointmentBookingScreen} options={{ title: 'Запись на приём' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 