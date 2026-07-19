import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONT, hp } from '../../../enums/StyleGuide'
import { IMAGES } from '../../../assets/images'
import { AppText, InputField } from '../../../commons'

const LoginScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Image source={IMAGES.APP_LOGO} style={styles.iconStyle} />
            <AppText
                text={'Welcome Back'}
                baseSize={23}
                style={{
                    fontFamily: FONT.semiBold,
                    color: COLORS.black,
                }} />
            <AppText
                text={'Login to access your curated spaces.'}
                baseSize={14}
                style={styles.subHeaderStyle} />
                <InputField
                placeHolder='Email'
                />
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
    },
    iconStyle: {
        height: hp('10%'),
        width: '20%',
        tintColor: COLORS.black
    },
    subHeaderStyle: {
        fontFamily: FONT.regular,
        color: COLORS.grey2,
        textAlign: 'center',
    },
})