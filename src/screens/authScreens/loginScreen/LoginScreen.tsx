import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, FONT, hp, TEXT_STYLE } from '../../../enums/StyleGuide'
import { IMAGES } from '../../../assets/images'
import { AppText, CustomButton, InputField } from '../../../commons'

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
                placeHolder="Email"
                keyBoardType="email-address"
                autoComplete='email'
                returnKeyType='next'
                inputFieldStyle={{ height: hp('5.5%') }}
                containerStyle={{ marginTop: hp('2%') }}
            />
            <InputField
                placeHolder="Password"
                keyBoardType="email-address"
                autoComplete='password'
                returnKeyType='done'
                inputFieldStyle={{ height: hp('5.5%') }}
                containerStyle={{ marginTop: hp('1%') }}
            />

            <View style={styles.forgotPasswordWrapper}>
                <AppText
                    baseSize={13}
                    text="Forgot Password?"
                    selectable
                    style={styles.forgotPasswordText}
                />
            </View>
            <CustomButton title='Login' buttonStyle={{ marginTop: hp('2%') }} />
            <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <AppText
                    baseSize={12}
                    text="or Login with"
                    style={[TEXT_STYLE.text, styles.dividerText]}
                />
                <View style={styles.dividerLine} />
            </View>
            <CustomButton
                title='Continue with Google'
                iconSource={IMAGES.GOOGLE}
                buttonStyle={{ marginTop: hp('2%') }}
                buttonTextStyle={{ fontSize: 15 }} />
            <View style={styles.signUpRow}>
                <AppText baseSize={12} text={`Don't have an account?\t`} style={styles.signUpPrompt} />
                <AppText baseSize={14} selectable text="Sign up" style={styles.signUpLink} />
            </View>
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
    forgotPasswordWrapper: {
        width: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: hp('2%'),
    },
    forgotPasswordText: {
        fontFamily: FONT.medium,
        fontSize: 13,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginTop: hp('2%'),
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: COLORS.grey3,
    },
    dividerText: {
        marginHorizontal: 12,
        color: COLORS.grey3,
    },
    signUpRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: hp('5%')
    },
    signUpPrompt: {
        fontSize: 12,
    },
    signUpLink: {
        fontSize: 14,
        fontFamily: FONT.semiBold,
        color: COLORS.red,
    },
})