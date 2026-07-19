import {
    Image,
    ImageSourcePropType,
    KeyboardType,
    LayoutChangeEvent,
    ReturnKeyTypeOptions,
    StyleSheet,
    Text,
    TextInput as RNTextInput,
    TextInputSubmitEditingEvent,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput as PaperTextInput } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import {
    Canvas,
    Fill,
    RoundedRect,
    Group,
    Skia,
    Shader,
    LinearGradient,
    BackdropBlur,
    vec,
} from '@shopify/react-native-skia';
import { ACTIVE_OPACITY, COLORS, FONT, hp, wp } from '../../enums/StyleGuide';

type IconSource = ImageSourcePropType | React.ReactElement;

interface Props {
    mainStyle?: ViewStyle;
    placeHolder: string;
    inputFieldStyle?: TextStyle;
    iconButtonStyle?: ViewStyle;
    source?: IconSource;
    iconPress?: () => void;
    keyBoardType?: KeyboardType;
    editable?: boolean;
    secureTextEntry?: boolean;
    onChangeText?: (text: string) => void;
    value?: string;
    error?: string;
    showError?: boolean;
    multiLine?: boolean;
    autoFocus?: boolean;
    returnKeyType?: ReturnKeyTypeOptions;
    selectTextOnFocus?: boolean;
    maxLength?: number;
    onSubEdit?: (e: TextInputSubmitEditingEvent) => void;
    ref?: React.RefObject<RNTextInput>;
}

const DEFAULT_HEIGHT = 56;
const RADIUS = 18;
const RING_DURATION = 220;

// ---------- Liquid Glass Shader (light, frosted) ----------
const glassSource = Skia.RuntimeEffect.Make(`
uniform shader image;
uniform float2 rectSize;
uniform float radius;
uniform float tintStrength;

half4 main(float2 pos) {
  float2 center = rectSize * 0.5;
  float2 local = pos - center;

  float2 halfSize = center - float2(radius, radius);
  float2 q = abs(local) - halfSize;
  float distToEdge = -(length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius);

  float bulge = smoothstep(0.0, radius * 1.6, distToEdge);
  float2 dir = normalize(local + 0.0001);
  float2 displaced = pos - dir * (1.0 - bulge) * 4.0;

  half4 col = image.eval(displaced);
  col.rgb = mix(col.rgb, half3(1.0, 1.0, 1.0), tintStrength);

  float edge = 1.0 - smoothstep(0.0, radius * 0.85, distToEdge);
  col.rgb += edge * 0.12;

  return col;
}
`)!;

const InputField = ({
    mainStyle,
    placeHolder,
    inputFieldStyle,
    iconButtonStyle,
    source,
    iconPress,
    keyBoardType,
    editable = true,
    secureTextEntry = false,
    onChangeText,
    value,
    error,
    showError = false,
    multiLine = false,
    autoFocus = false,
    returnKeyType,
    selectTextOnFocus,
    maxLength,
    onSubEdit,
    ref,
}: Props) => {
    const hasIcon = !!source;
    const showErrorVisuals = showError && !!error;

    const [isFocused, setIsFocused] = useState(false);
    const [width, setWidth] = useState(0);
    const hasSize = width > 0;

    const focusOpacity = useSharedValue(0);
    const errorOpacity = useSharedValue(0);

    useEffect(() => {
        focusOpacity.value = withTiming(isFocused ? 1 : 0, { duration: RING_DURATION });
    }, [isFocused]);

    useEffect(() => {
        errorOpacity.value = withTiming(showErrorVisuals ? 1 : 0, { duration: RING_DURATION });
    }, [showErrorVisuals]);

    const focusRingStyle = useAnimatedStyle(() => ({ opacity: focusOpacity.value }));
    const errorRingStyle = useAnimatedStyle(() => ({ opacity: errorOpacity.value }));

    const onFieldLayout = (e: LayoutChangeEvent) => {
        setWidth(e.nativeEvent.layout.width);
    };

    const uniforms = { rectSize: [width, DEFAULT_HEIGHT], radius: RADIUS, tintStrength: 0.5 };

    return (
        <View style={styles.wrapper}>
            <View onLayout={onFieldLayout} style={[styles.mainStyle, mainStyle]}>
                {hasSize && (
                    <Canvas style={StyleSheet.absoluteFill}>
                        <Group
                            clip={{
                                rect: { x: 0, y: 0, width, height: DEFAULT_HEIGHT },
                                rx: RADIUS,
                                ry: RADIUS,
                            }}
                        >
                            <Fill>
                                <Shader source={glassSource} uniforms={uniforms}>
                                    <BackdropBlur blur={18} />
                                </Shader>
                            </Fill>

                            <RoundedRect
                                x={0}
                                y={0}
                                width={width}
                                height={DEFAULT_HEIGHT}
                                r={RADIUS}
                                color="rgba(255,255,255,0.32)"
                            />

                            <RoundedRect
                                x={0}
                                y={0}
                                width={width}
                                height={DEFAULT_HEIGHT * 0.55}
                                r={RADIUS}
                            >
                                <LinearGradient
                                    start={vec(0, 0)}
                                    end={vec(0, DEFAULT_HEIGHT * 0.55)}
                                    colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']}
                                />
                            </RoundedRect>

                            <RoundedRect
                                x={0.5}
                                y={0.5}
                                width={width - 1}
                                height={DEFAULT_HEIGHT - 1}
                                r={RADIUS}
                                style="stroke"
                                strokeWidth={1}
                                color="rgba(255,255,255,0.55)"
                            />
                        </Group>
                    </Canvas>
                )}

                {hasSize && (
                    <Animated.View style={[StyleSheet.absoluteFill, focusRingStyle]} pointerEvents="none">
                        <Canvas style={StyleSheet.absoluteFill}>
                            <RoundedRect
                                x={1}
                                y={1}
                                width={width - 2}
                                height={DEFAULT_HEIGHT - 2}
                                r={RADIUS}
                                style="stroke"
                                strokeWidth={1.5}
                                color={COLORS.darkBlue}
                            />
                        </Canvas>
                    </Animated.View>
                )}

                {hasSize && (
                    <Animated.View style={[StyleSheet.absoluteFill, errorRingStyle]} pointerEvents="none">
                        <Canvas style={StyleSheet.absoluteFill}>
                            <RoundedRect
                                x={1}
                                y={1}
                                width={width - 2}
                                height={DEFAULT_HEIGHT - 2}
                                r={RADIUS}
                                style="stroke"
                                strokeWidth={1.5}
                                color={COLORS.red}
                            />
                        </Canvas>
                    </Animated.View>
                )}

                <PaperTextInput
                    ref={ref}
                    mode="outlined"
                    placeholder={placeHolder}
                    placeholderTextColor={COLORS.grey3}
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    selectionColor={COLORS.goldLight}
                    cursorColor={COLORS.darkBlue}
                    autoFocus={autoFocus}
                    returnKeyType={returnKeyType}
                    keyboardType={keyBoardType}
                    editable={editable}
                    value={value}
                    multiline={multiLine}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    autoCorrect={false}
                    autoCapitalize="words"
                    selectTextOnFocus={selectTextOnFocus}
                    maxLength={maxLength}
                    onSubmitEditing={onSubEdit}
                    style={[
                        styles.inputFieldStyle,
                        inputFieldStyle,
                        { width: hasIcon ? '85%' : '100%' },
                    ]}
                    contentStyle={styles.contentStyle}
                    theme={{ colors: { background: 'transparent', onSurfaceVariant: COLORS.grey3 } }}
                />

                {hasIcon && (
                    <TouchableOpacity
                        activeOpacity={ACTIVE_OPACITY}
                        onPress={iconPress}
                        style={[styles.iconButtonStyle, iconButtonStyle]}
                    >
                        {React.isValidElement(source) ? (
                            source
                        ) : (
                            <Image source={source as ImageSourcePropType} style={styles.iconStyle} />
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {showErrorVisuals && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

export default InputField;

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
    },
    mainStyle: {
        width: '100%',
        height: DEFAULT_HEIGHT,
        borderRadius: RADIUS,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    inputFieldStyle: {
        backgroundColor: 'transparent',
        color: COLORS.black,
        fontFamily: FONT.regular,
    },
    contentStyle: {
        backgroundColor: 'transparent',
        paddingLeft: wp('4%'),
    },
    iconButtonStyle: {
        width: '15%',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconStyle: {
        height: 13,
        width: 13,
    },
    errorText: {
        color: COLORS.red,
        fontSize: 12,
        position: 'absolute',
        right: wp('3%'),
        bottom: -hp('2%'),
        fontFamily: FONT.semiBold,
    },
});