import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { MainTabParamList } from '../navigation';

type NavigationProp = BottomTabNavigationProp<MainTabParamList>;

interface Appointment {
  id: string;
  status: string;
  created_at: string;
  time_slot: {
    date: string;
    start_time: string;
    end_time: string;
  };
  lawyer: {
    users: {
      full_name: string;
    };
    specialization: string;
  };
}

const MyAppointmentsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          status,
          created_at,
          time_slot:time_slots (
            date,
            start_time,
            end_time
          ),
          lawyer:lawyers (
            users (
              full_name
            ),
            specialization
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedAppointments = (data || []).map(appointment => ({
        id: appointment.id,
        status: appointment.status,
        created_at: appointment.created_at,
        time_slot: appointment.time_slot[0],
        lawyer: {
          ...appointment.lawyer[0],
          users: appointment.lawyer[0].users[0]
        }
      }));
      
      setAppointments(formattedAppointments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Ожидает подтверждения';
      case 'confirmed':
        return 'Подтверждено';
      case 'cancelled':
        return 'Отменено';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500';
      case 'confirmed':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#666';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>У вас пока нет записей</Text>
          <TouchableOpacity
            style={styles.findLawyerButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.findLawyerButtonText}>Найти юриста</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={({ item }) => (
            <View style={styles.appointmentCard}>
              <View style={styles.appointmentHeader}>
                <Text style={styles.lawyerName}>
                  {item.lawyer.users.full_name}
                </Text>
                <Text
                  style={[
                    styles.status,
                    { color: getStatusColor(item.status) }
                  ]}
                >
                  {getStatusText(item.status)}
                </Text>
              </View>
              
              <Text style={styles.specialization}>
                {item.lawyer.specialization}
              </Text>
              
              <View style={styles.timeContainer}>
                <Text style={styles.date}>
                  {new Date(item.time_slot.date).toLocaleDateString()}
                </Text>
                <Text style={styles.time}>
                  {item.time_slot.start_time} - {item.time_slot.end_time}
                </Text>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  findLawyerButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  findLawyerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  appointmentCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lawyerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
  },
  specialization: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  error: {
    color: 'red',
    fontSize: 16,
  },
});

export default MyAppointmentsScreen; 