import { View } from 'react-native'
import React from 'react'
import Animated from 'react-native-reanimated'
import { IMAGES } from '../../assets/images'
import { commonStyles } from '../../enums/StyleGuide'
import { AppText } from '../../commons'
import useSplashModalView from './useSplashModalView'
import { styles } from './Styles'

const SplashScreen = () => {
    const { logoAnimatedStyle, textAnimatedStyle } = useSplashModalView();

    return (
        <View style={[styles.container, commonStyles.center]}>
            <Animated.Image
                source={IMAGES.APP_LOGO}
                style={[styles.iconStyle, logoAnimatedStyle]}
            />
            <Animated.View style={[styles.textWrapper, textAnimatedStyle]}>
                <AppText baseSize={20} style={styles.appNameStyle} text=' Zakaish' />
            </Animated.View>
        </View>
    )
}

export default SplashScreen