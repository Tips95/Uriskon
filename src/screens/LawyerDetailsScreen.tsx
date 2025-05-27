import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { supabase } from '../lib/supabase';
import { Lawyer } from '../types';

type LawyerDetailsRouteProp = RouteProp<RootStackParamList, 'LawyerDetails'>;

const LawyerDetailsScreen = () => {
  const route = useRoute<LawyerDetailsRouteProp>();
  const { lawyerId } = route.params;
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleBookConsultation = () => {
    // TODO: Implement booking logic
    Alert.alert('Запись на консультацию', 'Функция записи будет доступна в ближайшее время');
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{lawyer.users.full_name}</Text>
        <Text style={styles.specialization}>{lawyer.specialization}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Опыт работы</Text>
        <Text style={styles.sectionText}>{lawyer.experience_years} лет</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Рейтинг</Text>
        <Text style={styles.sectionText}>{lawyer.rating} / 5.0</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>О себе</Text>
        <Text style={styles.sectionText}>{lawyer.description}</Text>
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={handleBookConsultation}
      >
        <Text style={styles.bookButtonText}>Записаться на консультацию</Text>
      </TouchableOpacity>
    </ScrollView>
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
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  specialization: {
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
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  bookButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
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

export default LawyerDetailsScreen; 