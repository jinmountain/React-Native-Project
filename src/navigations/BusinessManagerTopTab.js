import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Screens
import BusinessManagerTechnicianScreen from '../screens/businessScreens/BusinessManagerTechnicianScreen';
import BusinessManagerReservationScreen from '../screens/businessScreens/BusinessManagerReservationScreen';
import BusinessManagerApplicationScreen from '../screens/businessScreens/BusinessManagerApplicationScreen';
// import BusinessManagerScreen from '../screens/businessScreens/BusinessManagerScreen';
// import BusinessAnalyticsScreen from '../screens/businessScreens/BusinessAnalyticsScreen';

// Components
import MainTemplate from '../components/MainTemplate';

const Tab = createMaterialTopTabNavigator();

const BusinessManagerTopTab = () => {
  return (
  	<MainTemplate>
	    <Tab.Navigator
	    	backBehavior="history"
	    >
	      <Tab.Screen name="Technicians" component={BusinessManagerTechnicianScreen} />
	      <Tab.Screen name="Reservations" component={BusinessManagerReservationScreen} />
	      <Tab.Screen name="Applications" component={BusinessManagerApplicationScreen} />
	    </Tab.Navigator>
		</MainTemplate>
  );
}

export default BusinessManagerTopTab;