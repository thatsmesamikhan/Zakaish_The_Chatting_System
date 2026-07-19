import React, { createContext, useContext, useState, ReactNode } from 'react';
import { storage } from '../storage/mmkv';

export type FontSizeKey = 'small' | 'medium' | 'large';

const FONT_SCALES: Record<FontSizeKey, number> = {
    small: 0.85,
    medium: 1,
    large: 1.2,
};

const STORAGE_KEY = 'fontSizePref';

interface FontSizeContextValue {
    fontSizeKey: FontSizeKey;
    fontScale: number;
    setFontSize: (key: FontSizeKey) => void;
}

const FontSizeContext = createContext<FontSizeContextValue | undefined>(undefined);

interface FontSizeProviderProps {
    children: ReactNode;
}

export function FontSizeProvider({ children }: FontSizeProviderProps) {

    const [fontSizeKey, setFontSizeKey] = useState<FontSizeKey>(() => {
        const stored = storage.getString(STORAGE_KEY);
        return (stored as FontSizeKey) || 'medium';
    });

    const setFontSize = (key: FontSizeKey) => {
        setFontSizeKey(key);
        storage.set(STORAGE_KEY, key);
    };

    const value: FontSizeContextValue = {
        fontSizeKey,
        fontScale: FONT_SCALES[fontSizeKey],
        setFontSize,
    };

    return (
        <FontSizeContext.Provider value={value}>
            {children}
        </FontSizeContext.Provider>
    );
}

export function useFontSize(): FontSizeContextValue {
    const context = useContext(FontSizeContext);
    if (!context) {
        throw new Error('useFontSize must be used within a FontSizeProvider');
    }
    return context;
}