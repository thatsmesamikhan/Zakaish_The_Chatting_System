import { StyleSheet } from "react-native";
import { COLORS, FONT, hp } from "../../enums/StyleGuide";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor : COLORS.white
    },
    iconStyle: {
        height: hp('15%'),
        width: '25%',
        tintColor: COLORS.black
    },
    textWrapper: {
        position: 'absolute',
        bottom: hp('5%')
    },
    appNameStyle: {
        fontFamily: FONT.bold,
    }
})