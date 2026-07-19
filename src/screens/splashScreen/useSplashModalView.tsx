import { useEffect } from "react"
import { useSharedValue, useAnimatedStyle, withTiming, withSpring, withDelay, Easing } from 'react-native-reanimated'
import { useNavigation } from "@react-navigation/native";
import { SCREENS } from "../../enums";

const useSplashModalView = () => {
    const navigation = useNavigation();
    const logoOpacity = useSharedValue(0)
    const logoScale = useSharedValue(0.6)
    const textOpacity = useSharedValue(0)
    const textTranslateY = useSharedValue(10)

    useEffect(() => {
        logoOpacity.value = withTiming(1, {
            duration: 600,
            easing: Easing.out(Easing.ease),
        })
        logoScale.value = withSpring(1, {
            damping: 8,
            stiffness: 90,
            mass: 0.9,
        })
        textOpacity.value = withDelay(
            400,
            withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) })
        )
        textTranslateY.value = withDelay(
            400,
            withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) })
        )
        const timer = setTimeout(() => {
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: SCREENS.ON_BOARDING_SCREENS as never,
                    },
                ],
            });
        }, 1500);

        return () => clearTimeout(timer);
    }, [])

    const logoAnimatedStyle = useAnimatedStyle(() => ({
        opacity: logoOpacity.value,
        transform: [{ scale: logoScale.value }],
    }))

    const textAnimatedStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        transform: [{ translateY: textTranslateY.value }],
    }))
    return {
        logoAnimatedStyle,
        textAnimatedStyle
    }
}

export default useSplashModalView