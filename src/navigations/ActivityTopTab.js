import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text,
  SafeAreaView,
} from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Screens
import UserLikeScreen from '../screens/UserLikeScreen';
import UserBookScreen from '../screens/UserBookScreen';

// Stacks
import UserRsvStack from './UserRsvStack';
import UserNotiStack from './UserNotiStack';

// Components
import MainTemplate from '../components/MainTemplate';
import NavigationBar from '../components/NavigationBar';

// color
import color from '../color';

// icon
import {
	featherBookmark,
	antdesignBook,
	antdesignHeart,
	antdesignHearto,
	ioniconsNotifications,
	ioniconsNotificationsOutline
} from '../expoIcons';

const Tab = createMaterialTopTabNavigator();

const ActivityTopTab = () => {
  return (
  	<View style={{ flex: 1, backgroundColor: color.white2 }}>
  		<SafeAreaView />
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
	      {/*<Tab.Screen 
	      	name="UserRsvStack" 
	      	component={UserRsvStack}
	      	options={{ 
	      		tabBarIcon: ({ focused }) => {
	      			return (
	      				focused
	      				? 
	      				<View style={styles.tabIconContainer}>
	      					{
	      						expoIcons.featherShoppingBack(RFValue(19), color.black1)
	      					}
	      				</View>
	      				: 
	      				<View style={styles.tabIconContainer}>
	      					{
	      						expoIcons.featherShoppingBack(RFValue(19), color.black1)
	      					}
	      				</View>
	      			)
						},
						tabBarIconStyle: {  
							width: '100%',
							height: '100%'
						}
	      	}}
	      />*/}
	      <Tab.Screen 
	      	name="UserBook" 
	      	component={UserBookScreen}
	      	options={{
	      		tabBarIcon: ({ focused }) => {
	      			return (
	      				focused
	      				? 
	      				<View style={styles.tabIconContainer}>
	      					{
	      						featherBookmark(RFValue(19), color.red2)
	      					}
	      				</View>
	      				: 
	      				<View style={styles.tabIconContainer}>
	      					{
	      						antdesignBook(RFValue(19), color.black1)
	      					}
	      				</View>
	      			)
						},
						tabBarIconStyle: {  
							width: '100%',
							height: '100%'
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
	      				<View style={styles.tabIconContainer}>
	      					{
	      						antdesignHeart(RFValue(19), color.red2)
	      					}
	      				</View>
	      				: 
	      				<View style={styles.tabIconContainer}>
	      					{
	      						antdesignHearto(RFValue(19), color.black1)
	      					}
	      				</View>
	      			)
						},
						tabBarIconStyle: {  
							width: '100%',
							height: '100%'
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
	      				<View style={styles.tabIconContainer}>
	      					{
	      						ioniconsNotifications(RFValue(19), color.black1)
	      					}
	      				</View>
	      				: 
	      				<View style={styles.tabIconContainer}>
	      					{
	      						ioniconsNotificationsOutline(RFValue(19), color.black1)
	      					}
	      				</View>
	      			)
						},
						tabBarIconStyle: {  
							width: '100%',
							height: '100%'
						}
	      	}}
	      />
	    </Tab.Navigator>
	    <NavigationBar />
	    <SafeAreaView/>
		</View>
  );
}

const styles = StyleSheet.create({
	tabIconContainer: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default ActivityTopTab;