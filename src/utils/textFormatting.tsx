import React from 'react';

const defaultLinkClassName = (href: string) =>
	`${href.startsWith('mailto:') ? 'inline-block whitespace-nowrap break-normal' : 'min-w-0 break-words [overflow-wrap:anywhere]'} text-[#F5FF33] transition-colors hover:text-primary hover:underline`;

export const parseText = (text: string, getLinkClassName: (href: string) => string = defaultLinkClassName) => {
	const regex = /\*\*([^*]+)\*\*|__([^_]+)__|\[(.*?)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)|((?:https?:\/\/|mailto:)[^\s)]+)/g;
	const parts = [];
	let lastIndex = 0;
	let match;
	let count = 0;

	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push(<span key={`text-${count}`}>{text.slice(lastIndex, match.index)}</span>);
			count++;
		}

		if (match[1]) {
			parts.push(
				<strong key={`bold-highlight-${count}`} className='font-extrabold text-primary'>
					{match[1]}
				</strong>,
			);
		} else if (match[2]) {
			parts.push(
				<strong key={`bold-only-${count}`} className='font-extrabold text-white'>
					{match[2]}
				</strong>,
			);
		} else if (match[5]) {
			parts.push(
				<a key={`url-${count}`} href={match[5]} className={getLinkClassName(match[5])} target='_blank' rel='noreferrer'>
					{match[5]}
				</a>,
			);
		} else {
			parts.push(
				<a key={`link-${count}`} href={match[4]} className={getLinkClassName(match[4])} target='_blank' rel='noreferrer'>
					{match[3]}
				</a>,
			);
		}

		count++;
		lastIndex = regex.lastIndex;
	}

	if (lastIndex < text.length) {
		parts.push(<span key={`text-${count}`}>{text.slice(lastIndex)}</span>);
	}

	return parts;
};

export const stripBullet = (text: string) => text.replace(/^●\s*/, '');
