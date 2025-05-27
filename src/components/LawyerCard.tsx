import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';

export interface LawyerCardProps {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const LawyerCard = ({ id, name, specialization, experience, rating }: LawyerCardProps) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('LawyerDetails', { lawyerId: id });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.rating}>★ {rating.toFixed(1)}</Text>
      </View>
      <Text style={styles.specialization}>{specialization}</Text>
      <Text style={styles.experience}>Опыт работы: {experience} лет</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  rating: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  specialization: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  experience: {
    fontSize: 14,
    color: '#999',
  },
});

export default LawyerCard; 