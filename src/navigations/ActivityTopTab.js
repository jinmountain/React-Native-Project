import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Screens

// Stacks
import UserRsvStack from './UserRsvStack';
import UserNotiStack from './UserNotiStack';

// Components
import MainTemplate from '../components/MainTemplate';

// color
import color from '../color';

// icon
import expoIcons from '../expoIcons';

const Tab = createMaterialTopTabNavigator();

const ActivityTopTab = () => {
  return (
  	<MainTemplate>
	    <Tab.Navigator
	    	backBehavior="history"
	    	screenOptions={({ route }) => ({
			    tabBarLabelStyle: { color: color.black1 },
			    tabBarStyle: { backgroundColor: color.white2 },
			    tabBarIndicatorStyle: {
			    	backgroundColor: color.black1
			    },
			    tabBarIcon: ({ focused, color }) => {
					  if (route.name === "UserRsvStack") {
					  	return expoIcons.featherShoppingBack(RFValue(25), color.black1)
					  }

					  if (route.name === "UserNotiStack") {
					  	return expoIcons.ioniconsNotifications(RFValue(25), color.black1)
					  }
					},
					tabBarShowLabel: false,
			  })}
	    >
	      <Tab.Screen 
	      	name="UserRsvStack" 
	      	component={UserRsvStack}
	      	options={{ tabBarBadge: 3 }}
	      />
	      <Tab.Screen 
	      	name="UserNotiStack" 
	      	component={UserNotiStack}
	      	options={{
	      	}}
	      />
	    </Tab.Navigator>
		</MainTemplate>
  );
}

export default ActivityTopTab;