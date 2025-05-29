import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import Navigation from './src/navigation';
import { LogBox } from 'react-native';

// Игнорируем предупреждения о неиспользуемых стилях
LogBox.ignoreLogs(['ViewPropTypes will be removed']);

const App = () => {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
};

export default App;
