import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import React from 'react'
import { Canvas, Fill, RoundedRect, Group, Skia, Shader, vec, LinearGradient } from '@shopify/react-native-skia'
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated'
import AppText from '../appText'
import { COLORS, FONT, WIDTH } from '../../enums/StyleGuide'

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
  float2 displaced = pos - dir * (1.0 - bulge) * 5.0;

  half4 col = image.eval(displaced);
  col.rgb = mix(col.rgb, half3(0.05, 0.05, 0.06), tintStrength);

  float edge = 1.0 - smoothstep(0.0, radius * 0.85, distToEdge);
  col.rgb += edge * 0.08;

  return col;
}
`)!

const HORIZONTAL_PADDING = 16
const BUTTON_W = WIDTH - HORIZONTAL_PADDING * 2
const BUTTON_H = 56
const BUTTON_RADIUS = BUTTON_H / 2

const CustomButton = ({
    title,
    onPress,
    buttonStyle,
    disabled = false
}: {
    title: string
    onPress?: () => void
    buttonStyle?: StyleProp<ViewStyle>
    disabled?: boolean
}) => {
    const scale = useSharedValue(1)

    const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))
    const uniforms = { rectSize: [BUTTON_W, BUTTON_H], radius: BUTTON_RADIUS, tintStrength: 0.4 }

    return (
        <View style={[styles.buttonOuter, buttonStyle]}>
            <Animated.View style={[styles.buttonWrapper, animatedStyle]}>
                <Pressable
                    onPressIn={() => {
                        scale.value = withTiming(0.97, { duration: 90 })
                    }}
                    onPressOut={() => {
                        scale.value = withSpring(1, { damping: 12, stiffness: 200 })
                    }}
                    disabled={disabled}
                    onPress={onPress}
                    hitSlop={8}
                >
                    <Canvas style={{ width: BUTTON_W, height: BUTTON_H }}>
                        <Group
                            clip={{
                                rect: { x: 0, y: 0, width: BUTTON_W, height: BUTTON_H },
                                rx: BUTTON_RADIUS,
                                ry: BUTTON_RADIUS,
                            }}
                        >
                            <Fill>
                                <Shader source={glassSource} uniforms={uniforms} />
                            </Fill>
                            <RoundedRect
                                x={0}
                                y={0}
                                width={BUTTON_W}
                                height={BUTTON_H}
                                r={BUTTON_RADIUS}
                                color="rgba(15,15,17,0.62)"
                            />
                            <RoundedRect
                                x={0}
                                y={0}
                                width={BUTTON_W}
                                height={BUTTON_H * 0.55}
                                r={BUTTON_RADIUS}
                            >
                                <LinearGradient
                                    start={vec(0, 0)}
                                    end={vec(0, BUTTON_H * 0.55)}
                                    colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0)']}
                                />
                            </RoundedRect>
                            <RoundedRect
                                x={0.5}
                                y={0.5}
                                width={BUTTON_W - 1}
                                height={BUTTON_H - 1}
                                r={BUTTON_RADIUS}
                                style="stroke"
                                strokeWidth={1}
                                color="rgba(255,255,255,0.35)"
                            />
                        </Group>
                    </Canvas>
                    <View style={styles.textOverlay} pointerEvents="none">
                        <AppText baseSize={17} style={styles.buttonText} text={title} />
                    </View>
                </Pressable>
            </Animated.View>
        </View>
    )
}

export default CustomButton

const styles = StyleSheet.create({
    buttonOuter: { width: BUTTON_W, height: BUTTON_H },
    buttonWrapper: { width: BUTTON_W, height: BUTTON_H },
    textOverlay: {
        position: 'absolute',
        width: BUTTON_W,
        height: BUTTON_H,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: { color: COLORS.white, fontSize: 17, fontFamily: FONT.semiBold, letterSpacing: 0.2 },
})