import React from 'react';

import { panelFrame } from '../design-system/panel';

const LegacyCorner = ({ size, positionClassName }: { size: number; positionClassName: string }) => (
	<div className={`${panelFrame.legacyFrameCorner} ${positionClassName}`} style={{ width: size, height: size }} />
);

const FigmaTopLeftMarker = () => (
	<div className={panelFrame.figmaTopLeftMarker}>
		<div className='absolute left-0 top-0 h-[11.5px] w-[11.5px] bg-secondary' />
		<div className='absolute left-[11.5px] top-[11.5px] h-[11.5px] w-[11.5px] bg-secondary' />
	</div>
);

const FigmaBottomRightMarker = () => (
	<div className={panelFrame.figmaBottomRightMarker}>
		<div className='absolute right-[1px] top-0 h-[27px] w-[27px] rounded-full border-[5px] border-primary' />
		<div className='absolute bottom-[2px] left-[5px] h-[28px] w-[28px] rotate-45'>
			<div className='absolute left-1/2 top-0 h-full w-[5px] -translate-x-1/2 bg-primary' />
			<div className='absolute left-0 top-1/2 h-[5px] w-full -translate-y-1/2 bg-primary' />
		</div>
	</div>
);

const FramePanel = ({
	children,
	className = '',
	contentClassName = '',
	cornerClassName = '',
	cornerSize = 12,
	showCorners = true,
	variant = 'figmaContainer',
}: {
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
	cornerClassName?: string;
	cornerSize?: number;
	showCorners?: boolean;
	variant?: 'figmaContainer' | 'legacyCorners';
}) => {
	const frameClassName = variant === 'legacyCorners' ? panelFrame.legacyFrameBase : panelFrame.figmaFrameBase;

	return (
		<div className={`${frameClassName} ${className}`}>
			{showCorners && variant === 'legacyCorners' ? (
				<div className={cornerClassName}>
					<LegacyCorner size={cornerSize} positionClassName='left-0 top-0 border-l-2 border-t-2' />
					<LegacyCorner size={cornerSize} positionClassName='right-0 top-0 border-r-2 border-t-2' />
					<LegacyCorner size={cornerSize} positionClassName='bottom-0 left-0 border-b-2 border-l-2' />
					<LegacyCorner size={cornerSize} positionClassName='bottom-0 right-0 border-b-2 border-r-2' />
				</div>
			) : null}
			{showCorners && variant === 'figmaContainer' ? (
				<div className={cornerClassName}>
					<FigmaTopLeftMarker />
					<FigmaBottomRightMarker />
				</div>
			) : null}
			<div className={contentClassName}>{children}</div>
		</div>
	);
};

export default FramePanel;
