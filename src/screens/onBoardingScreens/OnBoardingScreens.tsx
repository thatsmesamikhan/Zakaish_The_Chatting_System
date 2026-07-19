import { StyleSheet, View, ViewStyle } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { COLORS, FONT, hp } from '../../enums/StyleGuide'
import { AppText, CustomButton, IconButton } from '../../commons'
import { IMAGES } from '../../assets/images'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, SharedValue } from 'react-native-reanimated'
import LottieView from 'lottie-react-native'
import { LOTTIES } from '../../assets/lotties'
import { SCREENS } from '../../enums'
import { ON_BOARD_1_ICONS, ON_BOARD_2_DATA, ON_BOARDING_HEADERS, ON_BOARDING_SUBHEADERS } from '../../dummy/Dummies'

const TITLES = ['School', 'Personal', 'Work']
const ROTATE_INTERVAL = 1000
const ICON_DELAY = 100
const TRANSITION_DURATION = 350

const CARD_DELAY = 100
const HEADER_DELAY = 250
const SUBHEADER_DELAY = 400
const ENTER_DURATION = 550
const START_OFFSET = -40

const FadeDownItem = ({
    delay = 0,
    style,
    children,
}: {
    delay?: number
    style?: ViewStyle | ViewStyle[]
    children: React.ReactNode
}) => {
    const translateY = useSharedValue(START_OFFSET)
    const opacity = useSharedValue(0)

    useEffect(() => {
        translateY.value = withDelay(delay, withTiming(0, { duration: ENTER_DURATION }))
        opacity.value = withDelay(delay, withTiming(1, { duration: ENTER_DURATION }))
    }, [])

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [{ translateY: translateY.value }],
    }))

    return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
}

const OnboardingStep = ({
    card,
    cardStyle,
    header,
    subheader,
}: {
    card: React.ReactNode
    cardStyle?: ViewStyle | ViewStyle[]
    header: string
    subheader: string
}) => (
    <>
        <FadeDownItem delay={CARD_DELAY} style={cardStyle ?? styles.card}>
            {card}
        </FadeDownItem>

        <FadeDownItem delay={HEADER_DELAY}>
            <AppText
                text={header}
                baseSize={23}
                style={styles.headerStyle}
            />
        </FadeDownItem>

        <FadeDownItem delay={SUBHEADER_DELAY}>
            <AppText
                text={subheader}
                baseSize={14}
                style={styles.subHeaderStyle}
            />
        </FadeDownItem>
    </>
)

const AnimatedSelectionIcon = ({
    index,
    icon,
    progress,
}: {
    index: number
    icon: any
    progress: SharedValue<number>
}) => {
    const containerStyle = useAnimatedStyle(() => {
        const selected = Math.round(progress.value) === index
        return {
            backgroundColor: withTiming(selected ? COLORS.black : COLORS.white, {
                duration: TRANSITION_DURATION,
            }),
            transform: [
                { scale: withTiming(selected ? 1.05 : 1, { duration: TRANSITION_DURATION }) },
            ],
        }
    })

    const iconStyle = useAnimatedStyle(() => {
        const selected = Math.round(progress.value) === index
        return {
            tintColor: withTiming(selected ? COLORS.white : COLORS.black, {
                duration: TRANSITION_DURATION,
            }),
        }
    })

    return (
        <Animated.View style={[styles.iconCircle, containerStyle]}>
            <Animated.Image
                source={icon}
                resizeMode="contain"
                style={[styles.iconImage, iconStyle]}
            />
        </Animated.View>
    )
}

const OnBoardingScreens = () => {
    const navigation = useNavigation()
    const [currentScreen, setCurrentScreen] = useState(0)

    const progress = useSharedValue(0)
    const [title, setTitle] = useState(TITLES[0])
    const isMounted = useRef(true)

    useEffect(() => {
        if (currentScreen !== 0) return

        isMounted.current = true
        let index = 0
        let iconTimeout: ReturnType<typeof setTimeout>

        const interval = setInterval(() => {
            index = (index + 1) % TITLES.length

            if (isMounted.current) setTitle(TITLES[index])

            iconTimeout = setTimeout(() => {
                if (isMounted.current) {
                    progress.value = withTiming(index, { duration: TRANSITION_DURATION })
                }
            }, ICON_DELAY)
        }, ROTATE_INTERVAL)

        return () => {
            isMounted.current = false
            clearInterval(interval)
            clearTimeout(iconTimeout)
        }
    }, [currentScreen])

    const handleNext = () => {
        if (currentScreen < 2) {
            setCurrentScreen((prev) => prev + 1)
        } else {
            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: SCREENS.LOGIN_SCREEN as never,
                    },
                ],
            })
        }
    }

    const buttonTitle = currentScreen === 2 ? 'Get Started' : 'Next'

    const CARD_CONTENT: React.ReactNode[] = [
        <>
            <AppText
                text="ACTIVE SPACE"
                baseSize={13}
                style={styles.grey2Text}
            />
            <AppText
                text={title}
                baseSize={20}
                style={styles.blackSemiBoldText}
            />

            <View style={styles.iconRow}>
                {ON_BOARD_1_ICONS.map((item, index) => (
                    <AnimatedSelectionIcon
                        key={item.id}
                        index={index}
                        icon={item.icon}
                        progress={progress}
                    />
                ))}
            </View>

            <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
                <AppText
                    baseSize={9}
                    text="Online"
                    style={styles.blackMediumText}
                />
            </View>
        </>,

        <>
            <View style={styles.identityRow}>
                <IconButton disabled source={IMAGES.USER} container={{ backgroundColor: COLORS.gold }} />
                <View style={styles.identityTextWrap}>
                    <AppText
                        baseSize={13}
                        style={styles.grey2Text}
                        text="Current Identity"
                    />
                    <AppText
                        baseSize={13}
                        style={styles.blackRegularText}
                        text="Sofia"
                    />
                </View>
            </View>
            <View style={styles.identityListWrap}>
                {ON_BOARD_2_DATA.map((item) => (
                    <View
                        key={item?.id}
                        style={styles.identityListItem}
                    >
                        <IconButton disabled source={item?.icon} />
                        <AppText
                            baseSize={15}
                            style={styles.blackRegularText}
                            text={item?.title}
                        />
                    </View>
                ))}
            </View>
        </>,

        <LottieView
            source={LOTTIES.END_TO_END}
            autoPlay
            loop={false}
            speed={0.62}
            style={styles.lottie}
        />,
    ]

    const CARD_STYLES: (ViewStyle | ViewStyle[])[] = [
        styles.card,
        [styles.card, styles.cardCompact],
        [styles.card, styles.cardVerticalOnly],
    ]

    return (
        <View style={styles.container}>
            <OnboardingStep
                key={currentScreen}
                card={CARD_CONTENT[currentScreen]}
                cardStyle={CARD_STYLES[currentScreen]}
                header={ON_BOARDING_HEADERS[currentScreen]}
                subheader={ON_BOARDING_SUBHEADERS[currentScreen]}
            />

            <CustomButton
                title={buttonTitle}
                onPress={handleNext}
                buttonStyle={styles.buttonPosition}
            />
        </View>
    )
}

export default OnBoardingScreens

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        paddingHorizontal: 16,
    },
    card: {
        width: '85%',
        borderRadius: 30,
        backgroundColor: COLORS.white,
        padding: 10,
        paddingVertical: hp('5%'),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
    },
    cardCompact: {
        paddingVertical: hp('3%'),
        padding: 15,
    },
    cardVerticalOnly: {
        paddingVertical: hp('3%'),
    },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: hp('2%'),
        gap: 16,
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconImage: {
        width: 25,
        height: 25,
    },
    onlineBadge: {
        padding: 3,
        backgroundColor: COLORS.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
        position: 'absolute',
        left: '5%',
        top: '5%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
    },
    onlineDot: {
        height: 5,
        width: 5,
        borderRadius: 3,
        backgroundColor: COLORS.green,
    },
    headerStyle: {
        fontFamily: FONT.semiBold,
        color: COLORS.black,
        marginTop: hp('4%'),
    },
    subHeaderStyle: {
        fontFamily: FONT.regular,
        color: COLORS.grey2,
        textAlign: 'center',
    },
    grey2Text: {
        fontFamily: FONT.regular,
        color: COLORS.grey2,
    },
    blackRegularText: {
        fontFamily: FONT.regular,
        color: COLORS.black,
    },
    blackSemiBoldText: {
        fontFamily: FONT.semiBold,
        color: COLORS.black,
    },
    blackMediumText: {
        fontFamily: FONT.medium,
        color: COLORS.black,
    },
    identityRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '5%',
    },
    identityTextWrap: {
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    identityListWrap: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '100%',
        marginTop: hp('1%'),
    },
    identityListItem: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '3%',
        marginTop: hp('1%'),
    },
    lottie: {
        width: '100%',
        height: hp('20%'),
    },
    buttonPosition: {
        position: 'absolute',
        bottom: hp('5%'),
    },
})