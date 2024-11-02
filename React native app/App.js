import { StyleSheet, Text, View ,TextInput ,Image, TouchableOpacity,Switch, Keyboard,Animated,ToastAndroid} from 'react-native'
import React,{useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';

export default function App() {
	const [isEnabled, setIsEnabled] = useState(false);
  	const toggleSwitch = () => setIsEnabled(previousState => !previousState);

	const [enterOtpOpen, setEnterOtpOpen] = useState(false);

	function GetOtp(){
		console.log('an');
		setTimeOutTime(90);
		setEnterOtpOpen(true);
	}
	const [timeOutTime, setTimeOutTime] = useState(4);
	const [stateChanged, setStateChanged] = useState(false);


	useEffect(() => {
		if (enterOtpOpen){
			if (timeOutTime === 0){
				setEnterOtpOpen(false);
				ToastAndroid.show("Request Timeout, Try Again",ToastAndroid.SHORT);
			}
			setTimeout(() => {
				var i = timeOutTime;
				setTimeOutTime(i - 1)
				if (stateChanged){
					setStateChanged(false)
				}
				else{
					setStateChanged(true)
				}
			}, 1000);
		}
	}, [enterOtpOpen,stateChanged])
	
	

  	return (
		<LinearGradient
			style={{
				display:'flex',
				flex:1,
				flexDirection:'column',
				justifyContent:'center',
			}}
			colors={["white","blue"]} >
			<View 
				style={{
					display:'flex',
					backgroundColor:'white',
					borderRadius:20,
					justifyContent:'center',
					paddingTop:20,
					paddingBottom:20,
					marginLeft:20,
					marginRight:20,
					marginTop:30,
					marginBottom:30
			}}>
				<Image 
					style={{
						height:100,
						width:300,
						alignSelf:'center',
						marginBottom:10, 
						marginLeft:-50,
						marginRight:-50,
						
					}}
					source={require("./assets/images/topTitle.png")}/>
				<Image 
					style={{
						height:200,
						width:200,
						alignSelf:'center',
						marginBottom:20
					}}
					source={require("./assets/images/logo.png")}/>

				<View style={{
					borderColor:'black',
					borderWidth:1,
					borderStyle:'solid',
					marginTop:5,
					marginLeft:15,
					marginRight:15,
					marginBottom:5,
					borderRadius:10,
					paddingTop:15,
					paddingBottom:5,
					paddingRight:15,
					paddingLeft:15,
					display:'flex',
					width:260,
					alignSelf:'center'
				}}>
					<Text style={{
						fontSize:20,
						alignSelf:'center',
						color:'black',
						marginBottom:10
					}}>Login</Text>
					<View style={{
						display:'flex',
						flexDirection:'row',
						alignSelf:'center',
						marginBottom:10
					}}>
						<Text 
							style={{
								fontSize:17,
								color:isEnabled ? "grey" : 'black'}}>Student</Text>
						<Switch
							trackColor={{ false: "#767577", true: "#81b0ff" }}
							thumbColor={"#f4f3f4"}
							ios_backgroundColor="#3e3e3e"
							onValueChange={toggleSwitch}
							value={isEnabled}
						/>
						<Text 
							style={{
								fontSize:17,
								color:!isEnabled ? "grey" : 'black',}}>Teacher</Text>
					</View>
					
					<TextInput 
						placeholder='Mobile Number'
						keyboardType="numeric"
						multiline={false}
						maxLength={10}
						onSubmitEditing={GetOtp}
						style={{
							margin:3,
							borderColor:'black',
							borderStyle:'solid',
							borderBottomWidth:1,
							padding:0,
							fontSize:16,
							fontWeight:'bold',
							alignContent:'center',
							justifyContent:'center'
						}}>
					</TextInput>
					<TouchableOpacity
						onPress={GetOtp}
						style={{
							backgroundColor:'black',
							padding:5,
							width:80,
							borderRadius:5,
							alignSelf:'center',
							marginTop:15,
							height:36
						}}>
						<Text style={{
							color:'white',
							fontSize:17,
							alignSelf:'center'
							}}>Login</Text>
					</TouchableOpacity>
				</View>
			</View>
			{enterOtpOpen &&
			<View style={{
					position:'absolute',
					height:'100%',
					width:'100%',
					display:'flex',
					flexDirection:'column-reverse'
				}}>
			
					<View 
						style={{
								height:320,
							}}>
							<LinearGradient
								style={{
									display:'flex',
									flex:1,
									flexDirection:'column',
									justifyContent:'center',
									borderTopLeftRadius:20,
									borderTopRightRadius:20,
									alignContent:'center'
								}}
								colors={["white","#9797f5"]}>
								<View style={{
									position:'absolute',
									top:20,
									right:20
								}}>
									<TouchableOpacity 
										onPress={() => {setTimeOutTime(0);setEnterOtpOpen(false)}}>
										<Text style={{fontSize:23,color:'black'}}>x</Text>
									</TouchableOpacity>
								</View>
								
								
								<TextInput 
									placeholder='Enter OTP'
									keyboardType="numeric"
									multiline={false}
									maxLength={6}
									onSubmitEditing={GetOtp}
									style={{
										margin:3,
										borderColor:'black',
										borderStyle:'solid',
										borderBottomWidth:1,
										padding:0,
										fontSize:18,
										fontWeight:'bold',
										alignContent:'center',
										justifyContent:'center',
										width:200,
										alignSelf:'center'
									}}>
								</TextInput>	
								<Text style={{alignSelf:'center'}}>
									{Math.trunc(timeOutTime/60)}:{ timeOutTime % 60 }
								</Text>
								<TouchableOpacity
									style={{
										backgroundColor:'black',
										padding:5,
										width:80,
										borderRadius:5,
										alignSelf:'center',
										marginTop:15,
										height:36,
										marginTop:20
									}}>
									<Text style={{
										color:'white',
										fontSize:17,
										alignSelf:'center',
										}}>Submit</Text>
									
								</TouchableOpacity>
								

								
							</LinearGradient>
					</View>
				</View>
				}
		</LinearGradient>
  	)
}

const styles = StyleSheet.create({


})