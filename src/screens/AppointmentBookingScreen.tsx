import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { supabase } from '../lib/supabase';
import { Lawyer } from '../types';

type AppointmentBookingRouteProp = RouteProp<RootStackParamList, 'AppointmentBooking'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AppointmentBookingScreen = () => {
  const route = useRoute<AppointmentBookingRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { lawyerId } = route.params;
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    fetchLawyerDetails();
  }, [lawyerId]);

  const fetchLawyerDetails = async () => {
    try {
      const { data, error } = await supabase
        .from('lawyers')
        .select('*, users(*)')
        .eq('id', lawyerId)
        .single();

      if (error) throw error;

      setLawyer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке данных юриста');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Ошибка', 'Пожалуйста, выберите дату и время консультации');
      return;
    }

    try {
      const { error } = await supabase
        .from('appointments')
        .insert({
          lawyer_id: lawyerId,
          date: selectedDate.toISOString().split('T')[0],
          time: selectedTime,
          status: 'pending',
        });

      if (error) throw error;

      Alert.alert(
        'Успех',
        'Запись на консультацию успешно создана',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Main'),
          },
        ]
      );
    } catch (err) {
      Alert.alert('Ошибка', err instanceof Error ? err.message : 'Произошла ошибка при создании записи');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !lawyer) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {error || 'Не удалось загрузить данные юриста'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchLawyerDetails}>
          <Text style={styles.retryButtonText}>Повторить</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Запись на консультацию</Text>
        <Text style={styles.lawyerName}>{lawyer.users.full_name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Выберите дату</Text>
        {/* TODO: Implement date picker */}
        <Text style={styles.placeholder}>Выбор даты будет доступен в ближайшее время</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Выберите время</Text>
        {/* TODO: Implement time slots */}
        <Text style={styles.placeholder}>Выбор времени будет доступен в ближайшее время</Text>
      </View>

      <TouchableOpacity
        style={[styles.bookButton, (!selectedDate || !selectedTime) && styles.bookButtonDisabled]}
        onPress={handleBookAppointment}
        disabled={!selectedDate || !selectedTime}
      >
        <Text style={styles.bookButtonText}>Записаться</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  lawyerName: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    padding: 20,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonDisabled: {
    opacity: 0.5,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#F44336',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AppointmentBookingScreen; 