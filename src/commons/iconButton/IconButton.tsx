import { Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import React from 'react'
import { ACTIVE_OPACITY, COLORS } from '../../enums/StyleGuide'

interface props {
    onPress?: () => void,
    source: ImageSourcePropType,
    container?: StyleProp<ViewStyle>
    iconStyle?: StyleProp<ImageStyle>
    disabled?: boolean
}

const IconButton = ({ onPress, source, container, iconStyle, disabled = false }: props) => {
    return (
        <TouchableOpacity disabled={disabled} activeOpacity={ACTIVE_OPACITY} onPress={onPress} style={[styles.container, container]}>
            <Image resizeMode='contain' source={source} style={[styles.iconStyle, iconStyle]} />
        </TouchableOpacity>
    )
}

export default IconButton

const styles = StyleSheet.create({
    container: {
        height: 40,
        width: 40,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.black
    },
    iconStyle: {
        height: 20,
        width: 20,
        tintColor: COLORS.white
    }
})