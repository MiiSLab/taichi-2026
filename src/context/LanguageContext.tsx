import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CONTENT_EN } from '../content.en';
import { CONTENT_ZH } from '../content.zh';

export type Language = 'zh' | 'en';

type LanguageContextValue = {
	language: Language;
	setLanguage: (language: Language) => void;
	content: typeof CONTENT_ZH;
};

const STORAGE_KEY = 'taichi-language';
const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [language, setLanguage] = useState<Language>('zh');

	useEffect(() => {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		if (stored === 'zh' || stored === 'en') {
			setLanguage(stored);
		}
	}, []);

	useEffect(() => {
		window.localStorage.setItem(STORAGE_KEY, language);
	}, [language]);

	const value = useMemo(
		() => ({
			language,
			setLanguage,
			content: language === 'en' ? CONTENT_EN : CONTENT_ZH,
		}),
		[language],
	);

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error('useLanguage must be used within LanguageProvider');
	}
	return context;
};

export const useContent = () => useLanguage().content;
