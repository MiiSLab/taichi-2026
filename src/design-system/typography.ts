export const typography = {
	fontFamily: {
		display: 'font-dela',
		ui: 'font-pixel',
		body: 'font-sans',
		prose: 'font-sans',
		numeric: 'font-mono',
	},
	scale: {
		pageTitle:
			'font-dela text-[clamp(2.1rem,11vw,3.05rem)] leading-[1.12] tracking-[0.08em] sm:text-5xl sm:tracking-[0.1em] md:text-8xl md:leading-tight md:tracking-[0.12em]',
		sectionTitle: 'font-dela text-[28px] tracking-[0.12em] md:text-[40px]',
		sectionEyebrow: 'font-pixel text-[14px] tracking-[0.08em] sm:text-[16px] xl:text-[20px]',
		deadlineValue: 'font-dela text-[22px] sm:text-[26px] xl:whitespace-nowrap xl:text-[36px]',
		deadlineMeta: 'font-sans text-[12px] sm:text-[13px] xl:text-[14px]',
		micro: 'font-sans text-[12px] leading-4',
		label: 'font-sans text-[14px] leading-5',
		body: 'font-sans text-[16px] leading-7',
		bodyLg: 'font-sans text-[18px] leading-8',
		data: 'font-mono text-[14px] leading-5',
		cardTitle: 'font-sans text-[28px] font-semibold leading-[1.35] md:text-[30px]',
		buttonLabel: 'text-[16px] font-bold tracking-[0.02em] sm:text-[18px]',
		buttonLabelMono: 'font-mono text-[18px] font-bold tracking-[0.025em]',
		// navbar 完整橫排在 xl (1280px) 出現，但全部項目要 ~1500px 才裝得下單行；
		// 1280–1536 區間縮小字級與間距（見 Navbar.tsx 同註解），2xl 恢復原尺寸。
		// 外層保留 font-pixel（VT323）給方括號 []；label 文字在 Navbar 元件內以 font-scp
		// (Source Code Pro) 覆蓋 — 兩種字體照 visual-chair 設計分工。
		navBracket: 'font-pixel text-[24px] leading-9 uppercase xl:text-[20px] xl:leading-8 2xl:text-[24px] 2xl:leading-9',
		// Source Code Pro is ~35% wider than the old VT323 here, so the horizontal
		// row needs smaller px + tighter spacing than the pixel font did to fit.
		navBracketCompact: 'font-pixel text-[13px] leading-6 uppercase tracking-[0.01em] 2xl:text-[15px] 2xl:leading-[27px]',
		navPinned: "font-['Source_Code_Pro',monospace] text-[13px] uppercase tracking-[0.08em]",
	},
	pattern: {
		heroIntroTitle: 'text-left text-xl font-normal tracking-[0.18em] md:text-center md:text-3xl md:tracking-widest',
		heroIntroLead: 'text-left text-base leading-relaxed tracking-wide sm:text-[1.05rem] md:text-center md:text-lg',
		heroIntroBody: 'text-left text-sm leading-7 tracking-[0.04em] sm:text-[0.95rem] md:text-center md:text-sm md:[text-align-last:center]',
		countdownHeroValue: 'text-[2rem] sm:text-[3rem] md:text-[4.5rem] lg:text-[6rem] xl:text-[8rem] tracking-[0.04em]',
		countdownDefaultValue: 'text-[2rem] sm:text-[2.75rem] md:text-6xl lg:text-8xl xl:text-9xl',
		countdownLabel: 'text-[10px] sm:text-xs md:text-base',
	},
} as const;
