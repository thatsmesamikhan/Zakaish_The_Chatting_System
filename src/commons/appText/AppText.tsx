import React from 'react';
import { Text, TextProps, StyleProp, TextStyle } from 'react-native';
import { useFontSize } from '../../context/FontSizeContext';

interface AppTextProps extends TextProps {
    baseSize?: number;
    style?: StyleProp<TextStyle>;
    text: React.ReactNode;
}

export default function AppText({
    style,
    baseSize = 14,
    text,
    ...props
}: AppTextProps) {
    const { fontScale } = useFontSize();

    return (
        <Text
            style={[{ fontSize: baseSize * fontScale }, style]}
            maxFontSizeMultiplier={1.3}
            {...props}
        >
            {text}
        </Text>
    );
}