import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Screens
import UserLikeScreen from '../screens/UserLikeScreen';

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
					tabBarShowLabel: false,
			  })}
	    >
	      <Tab.Screen 
	      	name="UserRsvStack" 
	      	component={UserRsvStack}
	      	options={{ 
	      		tabBarIcon: ({ focused }) => {
	      			return (
	      				focused
	      				? 
	      				<View>
	      					{
	      						expoIcons.featherShoppingBack(RFValue(21), color.black1)
	      					}
	      				</View>
	      				: 
	      				<View>
	      					{
	      						expoIcons.featherShoppingBack(RFValue(21), color.black1)
	      					}
	      				</View>
	      			)
						}
	      	}}
	      />
	      <Tab.Screen 
	      	name="UserLikeScreen" 
	      	component={UserLikeScreen}
	      	options={{
	      		tabBarIcon: ({ focused }) => {
	      			return (
	      				focused
	      				? 
	      				<View>
	      					{
	      						expoIcons.antdesignHeart(RFValue(21), color.red2)
	      					}
	      				</View>
	      				: 
	      				<View>
	      					{
	      						expoIcons.antdesignHearto(RFValue(21), color.black1)
	      					}
	      				</View>
	      			)
						}
	      	}}
	      />
	      <Tab.Screen 
	      	name="UserNotiStack" 
	      	component={UserNotiStack}
	      	options={{
	      		tabBarIcon: ({ focused }) => {
	      			return (
	      				focused
	      				? 
	      				<View>
	      					{
	      						expoIcons.ioniconsNotifications(RFValue(21), color.black1)
	      					}
	      				</View>
	      				: 
	      				<View>
	      					{
	      						expoIcons.ioniconsNotificationsOutline(RFValue(21), color.black1)
	      					}
	      				</View>
	      			)
						}
	      	}}
	      />
	    </Tab.Navigator>
		</MainTemplate>
  );
}

const styles = StyleSheet.create({
	tabIconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default ActivityTopTab;