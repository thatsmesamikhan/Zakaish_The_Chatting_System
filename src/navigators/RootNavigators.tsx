import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as ui from '../screens'
import { SCREENS } from '../enums';

const RootNavigators = () => {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name={SCREENS.SPLASH_SCREEN} component={ui.SplashScreen} />
                <Stack.Screen name={SCREENS.ON_BOARDING_SCREENS} component={ui.OnBoardingScreens} />
                <Stack.Screen name={SCREENS.LOGIN_SCREEN} component={ui.LoginScreen} />
                <Stack.Screen name={SCREENS.SIGN_UP_SCREEN} component={ui.SignUpScreen} />
                <Stack.Screen name={SCREENS.OTP_SCREEN} component={ui.OtpScreen} />
                <Stack.Screen name={SCREENS.PROFILE_SETUP_SCREEN} component={ui.ProfileSetupScreen} />
                <Stack.Screen name={SCREENS.REGISTER_SUCCESS_SCREEN} component={ui.RegisterSuccessScreen} />
                <Stack.Screen name={SCREENS.RESET_PASSWORD_SCREEN} component={ui.ResetPasswordScreen} />
                <Stack.Screen name={SCREENS.HOME_SCREEN} component={ui.HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootNavigators