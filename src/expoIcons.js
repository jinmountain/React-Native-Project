import React from 'react';

// designs
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { EvilIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const dollarSign = (size, color) => {
	return <FontAwesome name="dollar" size={size} color={color} />
};

const entypoDot = (size, color) => {
	return <Entypo name="dot-single" size={size} color={color} />
};

const antClose = (size, color) => {
	return <AntDesign name="close" size={size} color={color} />
};

const antCheck = (size, color) => {
	return <AntDesign name="check" size={size} color={color} />
};

const featherMoreHorizontal = (size, color) => {
	return <Feather name="more-horizontal" size={size} color={color} />
};

const ioniconsMdArrowBack = (size, color) => {
	return <Ionicons name="md-arrow-back" size={size} color={color} />
};

const evilIconsLocation = (size, color) => {
	return <EvilIcons name="location" size={size} color={color} />
};

const evilIconsClose = (size, color) => {
	return <EvilIcons name="close" size={size} color={color} />;
};

const entypoShop = (size, color) => {
	return <Entypo name="shop" size={size} color={color} />
};

const featherMoreVertical = (size, color) => {
	return <Feather name="more-vertical" size={size} color={color.gray2} />
};

const featherMap = (size, color) => {
	return <Feather name="map" size={size} color={color} />
};

const featherShoppingBack = (size, color) => {
	return <Feather name="shopping-bag" size={size} color={color} />
};

const ioniconsNotifications = (size, color) => {
	return <Ionicons name="notifications" size={size} color={color} />
};

const ioniconsNotificationsOutline = (size, color) => {
	return <Ionicons name="notifications-outline" size={size} color={color} />
};

const antdesignHearto = (size, color) => {
	return <AntDesign name="hearto" size={size} color={color} />
};

const antdesignHeart = (size, color) => {
	return <AntDesign name="heart" size={size} color={color} />
};

const antdesignBars = (size, color) => {
	return <AntDesign name="bars" size={size} color={color} />
};

const entypoNewMessage = (size, color) => {
	return <Entypo name="new-message" size={size} color={color} />
};

// select circle and check circle
const mcCheckBoxBlankCircle = (size, color) => {
	return <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={size} color={color} />
};

const mcCheckCircle = (size, color) => {
	return <MaterialCommunityIcons name="check-circle" size={size} color={color} />
};

const antdesignBook = (size, color) => {
	return <AntDesign name="book" size={size} color={color} />
};

const featherBookmark = (size, color) => {
	return <Feather name="bookmark" size={size} color={color} />
};

const featherMinus = (size, color) => {
	return <Feather name="minus" size={size} color={color} />
};

const featherPlus = (size, color) => {
	return <Feather name="plus" size={size} color={color} />
};

const phoneIcon = (size, color) => {
	return <AntDesign name="phone" size={size} color={color} />
};

const setting = (size, color) => {
	return <Feather name="settings" size={size} color={color} />
};

const clockIcon = (size, color) => {
	return <MaterialCommunityIcons name="clock-outline" size={size} color={color} />
};

const matClockTimeEightOutline = (size, color) => {
	return <MaterialCommunityIcons name="clock-time-eight-outline" size={size} color={color} />
};

const fontAwesomeCalendarO = (size, color) => {
	return <FontAwesome name="calendar-o" size={size} color={color} />
};

const fontAwesomeCalendarPlusO = (size, color) => {
	return <FontAwesome name="calendar-plus-o" size={size} color={color} />
};

export default { 
	dollarSign, 
	entypoDot, 
	antClose, 
	antCheck, 
	featherMoreHorizontal, 
	ioniconsMdArrowBack, 
	evilIconsLocation,
	evilIconsClose,
	entypoShop,
	featherMap,
	featherMoreVertical,
	featherShoppingBack,
	ioniconsNotifications,
	ioniconsNotificationsOutline,
	antdesignHearto,
	antdesignHeart,
	antdesignBars,
	entypoNewMessage,
	mcCheckBoxBlankCircle,
	mcCheckCircle,
	antdesignBook,
	featherBookmark,
	featherMinus,
	featherPlus,
	phoneIcon,
	setting,
	clockIcon,
	matClockTimeEightOutline,
	fontAwesomeCalendarO,
	fontAwesomeCalendarPlusO
};