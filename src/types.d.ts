/// <reference types="vite/client" />

interface TrackItem {
	id: string;
	title: string;
	description: string;
	iconKey: 'boxes' | 'cpu' | 'globe' | 'file-text' | 'image' | 'users' | 'mic';
}

declare interface Topic {
	id: string;
	topic: string; // Topic title
	startTime: string;
	endTime: string;
	chairs?: PersonItem[]; // Array of chair persons (resolved from IDs)
	sessionId?: string; // Parent session ID
}

declare interface SessionItem {
	id: string;
	title: string; // Session Title
	day: string; // "Day 1", "Day 2", "Day 3"
	startTime: string; // "09:00"
	endTime: string; // "10:30"
	chairs?: PersonItem[]; // Array of chair persons (resolved from IDs)
	topics?: Topic[]; // Array of topics in this session
}

declare interface PersonItem {
	id: string;
	name: string;
	nameEn?: string;
	chairType: string; // "General Chair", "Program Chair", "Technical Chair", etc.
	email?: string;
	image?: string;
	institution?: string;
	institutionEn?: string;
	department?: string;
	departmentEn?: string;
	country?: string;
	notes?: string;
	order?: number;
}

interface ImageAdjustment {
	objectPosition?: string;
	scale?: number;
	lastUrl?: string;
}


declare interface Speaker {
	name: string;
	headPhoto: string;
	bio?: string;
}

declare interface NewsItem {
	id: string;
	title: string;
	subtitle: string;
	content: string;
	date: string;
	createdTime: string; // From Created column
	place: string; // From Location
	image: string; // From Headphoto
	link: string; // From Link
	linkLabel?: string; // Optional CTA label for the link button (static announcements)
}

declare interface PublicationItem {
	id: string;
	title: string;
	authors: string;
	year: string;
	publication: string;
	doi?: string;
	category: string;
}

// Legacy Types for compatibility with unused components (ProjectDetail)
declare interface ProjectItem extends AgendaItem {
	mainImage: string;
	gallery: string[];
}
