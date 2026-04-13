export {
	CONFIG,
	MEMBERS_NOTION_PAGE_ID,
	NEWS,
	NEWS_NOTION_PAGE_ID,
	PEOPLE,
	PUBLICATIONS,
	SESSIONS,
	SESSIONS_NOTION_PAGE_ID,
	TOPICS_NOTION_PAGE_ID,
} from './content.shared';
export { CONTENT_EN } from './content.en';
export { CONTENT_ZH } from './content.zh';

import { CONTENT_ZH } from './content.zh';

export type SiteContent = typeof CONTENT_ZH;
export const CONTENT = CONTENT_ZH;
