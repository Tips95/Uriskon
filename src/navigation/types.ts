export type MainTabParamList = {
  Home: undefined;
  MyAppointments: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  Register: undefined;
  Main: undefined;
  LawyerDetails: { lawyerId: string };
  AppointmentBooking: { lawyerId: string };
}; 