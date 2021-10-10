import React, { useState } from 'react';
import { 
	Text, 
	View, 
	ScrollView,
	StyleSheet, 
	TouchableOpacity,
	TouchableHighlight,
} from 'react-native';
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";

// Designs

// Contexts

// Hooks
import useConvertTime from '../../../hooks/useConvertTime';

// Components
import MainTemplate from '../../../components/MainTemplate';
import BarGraph from '../../../components/BarGraph';
import THButtonWithBorder from '../../../components/buttons/THButtonWithBorder';

// Color
import color from '../../../color';

const counts = {
  maxCount: 10,
  counts: [
    { type: 'monthly', count: 1, time: 1619845200000 },
    { type: 'monthly', count: 0, time: 1622523600000 },
    { type: 'monthly', count: 5, time: 1625115600000 },
    { type: 'monthly', count: 10, time: 1627794000000 },
  ]
};

const THButtonAbsPos = ({ diameter, buttonText }) => {
	return (
		<TouchableHighlight
			style={{ 
				justifyContent: 'center',
				alignItems: 'center',
				position: 'absolute', 
				width: diameter, 
				height: diameter, 
				borderRadius: diameter,
			}}
			onPress={() => {
				console.log("touch");
			}}
			underlayColor={color.gray1}
		>
			<View style={{ 
				justifyContent: 'center',
				alignItems: 'center'
			}}>
				<Text>{ buttonText }</Text>
			</View>
		</TouchableHighlight>
	)
}

const BusinessReservationAnalyticsScreen = ({ navigation }) => {
	const [ graphPeriod, setGraphPeriod ] = useState('daily');

	return (
		<MainTemplate>
			<ScrollView>
				<ScrollView 
					horizontal
					showsHorizontalScrollIndicator={false}
				>
					<View style={{ 
						justifyContent: 'center',
						alignItems: 'center',
						paddingVertical: RFValue(7),
					}}>
						<THButtonWithBorder 
							text={"daily"} 
							onPress={() => { 
								console.log("touch");
								setGraphPeriod('daily'); 
							}}
							value={ graphPeriod === "daily" ? true : false }
							valueEffect={{ backgroundColor: color.blue1 }}
						/>
					</View>
					<View style={{
						justifyContent: 'center',
						alignItems: 'center',
						paddingVertical: RFValue(7),
					}}>
						<THButtonWithBorder 
							text={"days"} 
							onPress={() => { 
								console.log("touch");
								setGraphPeriod('days');
							}}
							value={ graphPeriod === "days" ? true : false }
						/>
					</View>
					<View style={{
						justifyContent: 'center',
						alignItems: 'center',
						paddingVertical: RFValue(7),
					}}>
						<THButtonWithBorder 
							text={"hours"} 
							onPress={() => { 
								console.log("touch");
								setGraphPeriod('hours');
							}}
							value={ graphPeriod === "hours" ? true : false }
						/>
					</View>
					<View style={{
						justifyContent: 'center',
						alignItems: 'center',
						paddingVertical: RFValue(7),
					}}>
						<THButtonWithBorder 
							text={"weekly"} 
							onPress={() => { 
								console.log("touch");
								setGraphPeriod('weekly'); 
							}}
							value={ graphPeriod === "weekly" ? true : false }
						/>
					</View>
					<View style={{
						justifyContent: 'center',
						alignItems: 'center',
						paddingVertical: RFValue(7),
					}}>
						<THButtonWithBorder 
							text={"monthly"} 
							onPress={() => { 
								console.log("touch");
								setGraphPeriod('monthly');
							}}
							value={ graphPeriod === "monthly" ? true : false }
						/>
					</View>
					<View style={{
						justifyContent: 'center',
						alignItems: 'center',
						paddingVertical: RFValue(7),
					}}>
						<THButtonWithBorder 
							text={"months"} 
							onPress={() => { 
								console.log("touch");
								setGraphPeriod('months');
							}}
							value={ graphPeriod === "months" ? true : false }
						/>
					</View>
					<View style={{
						justifyContent: 'center',
						alignItems: 'center',
						paddingVertical: RFValue(7),
					}}>
						<THButtonWithBorder 
							text={"yearly"} 
							onPress={() => { 
								console.log("touch");
								setGraphPeriod('yearly');
							}} 
							value={ graphPeriod === "yearly" ? true : false }
						/>
					</View>
				</ScrollView>
				<View style={styles.graphContainer}>
					<BarGraph maxCount={counts.maxCount} counts={counts.counts}/>
				</View>
				{ 
					counts.counts.map((item, index) => (
						<View key={index} style={{ flexDirection: 'row', paddingVertical: RFValue(7), paddingHorizontal: RFValue(7), justifyContent: 'center', alignItems: 'center' }}>
            	<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            		<View style={{ borderRadius: RFValue(100), width: RFValue(17), height: RFValue(17), backgroundColor: color.blue1 }}>
            		</View>
            	</View>
            	<View style={{ flexDirection: 'row', flex: 3, justifyContent: 'center', alignItems: 'center', borderWidth: 1 }}>
            		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                	<Text>{item.count}</Text>
                </View>
            		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            			<Text>{useConvertTime.convertToMonthly(item.time)}</Text>
            		</View>
              </View>
            </View>
					))
				}
			</ScrollView>
		</MainTemplate>
  );
};

const styles = StyleSheet.create({
	graphContainer: {
		flex: 1,
		paddingHorizontal: RFValue(3),
	},
});

export default BusinessReservationAnalyticsScreen;