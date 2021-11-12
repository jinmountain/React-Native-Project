import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Screens
// import BusinessManagerScreen from '../screens/businessScreens/BusinessManagerScreen';
// import BusinessAnalyticsScreen from '../screens/businessScreens/BusinessAnalyticsScreen';

// stacks
import BusinessManagerReservationStack from './BusinessManagerReservationStack';
import BusinessManagerTechnicianStack from './BusinessManagerTechnicianStack';

// Components
import MainTemplate from '../components/MainTemplate';

// color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

const Tab = createMaterialTopTabNavigator();

const BusinessManagerTopTab = () => {
  return (
  	<MainTemplate>
	    <Tab.Navigator
	    	backBehavior="history"
	    	screenOptions={({ route }) => ({
			    tabBarLabelStyle: { color: color.black1 },
			    tabBarStyle: { backgroundColor: color.white2 },
			    tabBarIndicatorStyle: {
			    	backgroundColor: color.black1
			    }
			  })}
	    >
	    	<Tab.Screen
	    		name="BusinessManagerReservationStack"
	    		component={BusinessManagerReservationStack}
	    		options={{
	    			tabBarLabel: "Reservations",
	          headerShown: true,
	        }}
	    	/>
	      <Tab.Screen
	      	name="BusinessManagerTechnicianStack" 
	      	component={BusinessManagerTechnicianStack} 
	      	options={{
	    			tabBarLabel: "Technicians",
	          headerShown: true,
	        }}
	      />
	    </Tab.Navigator>
		</MainTemplate>
  );
}

export default BusinessManagerTopTab;