/**
 * 站上公告（/news 頁與首頁 AnnouncementsSection 的資料源）。
 *
 * 公告數量少、且含 Notion 沒有的欄位（modal 名單、linkLabel、站內連結），
 * 一直以來都是直接在 code 內編輯維護 — 活動結束靜態化後亦維持此做法。
 * （內容原位於 offlineFallbackData.ts 的 OFFLINE_NEWS，2026-08 靜態化時移出獨立成檔。）
 */
export const ANNOUNCEMENTS: NewsItem[] = [
	{
		id: 'offline-news-awards',
		title: 'TAICHI 2026 得獎名單公布',
		subtitle: '得獎公告',
		content:
			'TAICHI 2026 已圓滿落幕，感謝所有作者、講者與參與者的熱情投入！\n\n本屆 Paper、Poster、Demo 各獎項已於 08/06 閉幕式頒發，包含 Best Paper、Best Poster、Best Demo、Honorable Mention 與 People’s Choice Award，完整名單請見得獎名單頁面。',
		date: '2026/08/08',
		createdTime: '2026/08/08',
		place: 'Online',
		image: '/images/home_bg.png',
		// '/' 開頭為站內頁：AnnouncementsSection 走 react-router 導頁、不開新分頁
		link: '/awards',
		linkLabel: '查看得獎名單',
	},
	{
		id: 'offline-news-sv-results',
		title: '學生志工錄取名單出爐',
		subtitle: 'Student Volunteer 錄取公告',
		content:
			'經過團隊審慎評選，第 12 屆台灣人機互動研討會的「學生志工」錄取名單正式出爐 💥☄️⚡\n\n📬 錄取者注意事項：\n- 錄取結果與後續詳細事項，將於今日後陸續寄送至各位報名時填寫的電子信箱。請務必前往收件匣（包含垃圾郵件匣）確認，並依照信中說明完成相關手續 🤜 🤛\n- 請錄取夥伴預留 8/4-8/6 的時間，參與行前說明、場地佈置以及研討會當日的支援工作 🤟\n\n📧 若有任何問題，歡迎來信詢問：taiwanchi26+sv@gmail.com',
		date: '2026/07/12',
		createdTime: '2026/07/12',
		place: 'Online',
		image: '/images/home_bg.png',
		link: '',
		linkLabel: '查看錄取名單',
		modal: {
			title: '學生志工錄取名單',
			// 半匿名：中間字以 ○ 遮罩
			names: [
				'賴○綸', '林○臻', '游○儀', '黃○淇', '林○嬡',
				'李○璋', '李○萱', '魏○儀', '徐○維', '蔡○庠',
				'曾○呈', '蔡○鈞', '蔡○宏', '陳○蓉', '盧○儒',
				'黃○文', '林○均', '林○辰', '陳○潼', '張○婷',
			],
			note: '名單以半匿名方式顯示，完整錄取資訊以通知信為準；有疑問請來信 taiwanchi26+sv@gmail.com。',
		},
	},
	{
		id: 'offline-news-cfp-extend',
		title: 'Call for Papers 投稿延期至 6/23',
		subtitle: '投稿截止日期延長',
		content:
			'TAICHI 2026 投稿截止日期延長！\n\n論文與圖像式論文（Paper & Pictorial）、海報論文（Poster）、互動展示（Demo）三類投稿截止日期，統一由原訂 2026/6/18（四）延長至 2026/6/23（二）23:59 (GMT+8)。\n\n歡迎把握最後機會投稿！',
		date: '2026/06/17',
		createdTime: '2026/06/17',
		place: 'Online',
		image: '/images/cfp_bg.avif',
		link: 'https://easychair.org/conferences/?conf=taichi2026',
		linkLabel: '前往投稿系統',
	},
	{
		id: 'offline-news-sv',
		title: '學生志工 (Student Volunteer) 招募中',
		subtitle: 'Student Volunteer 招募公告',
		content:
			'TAICHI 2026 學生志工（Student Volunteer, SV）開始招募！\n\n誠摯邀請對人機互動有興趣的同學加入，協助會議現場運作，並有機會近距離參與議程、認識研究社群。\n\n歡迎點擊下方按鈕填寫報名表單。',
		date: '2026/06/17',
		createdTime: '2026/06/17',
		place: 'Online',
		image: '/images/home_bg.png',
		link: 'https://forms.gle/2WNEyuApxP8yRgLV9',
		linkLabel: '前往報名表單',
	},
];
