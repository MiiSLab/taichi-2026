import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { ImagePlus, CheckCircle2 } from 'lucide-react';

import { typography } from '../design-system/typography';
import { useSEO } from '../hooks/useSEO';

const POSTER_THEMES = [
	{ id: 'theme-usability-ux', label: 'Usability and User Experience', zhLabel: '可用性與使用者體驗' },
	{ id: 'theme-interaction-techniques-devices', label: 'Interaction Techniques and Devices', zhLabel: '互動技術與裝置' },
	{ id: 'theme-understanding-users-human-behavior', label: 'Understanding Users and Human Behavior', zhLabel: '理解使用者與人類行為' },
	{ id: 'theme-design-methods-processes', label: 'Design Methods and Processes', zhLabel: '設計方法與流程' },
	{ id: 'theme-mobile-ubiquitous-computing', label: 'Mobile and Ubiquitous Computing', zhLabel: '移動與普適計算' },
	{ id: 'theme-vr-ar-mr-xr', label: 'Virtual, Augmented, Mixed, and Extended Reality (VR, AR, MR, XR)', zhLabel: '虛擬、擴增、混合與擴展實境' },
	{ id: 'theme-human-ai-interaction', label: 'Human-AI Interaction', zhLabel: '人工智慧與人類互動' },
	{ id: 'theme-social-computing-collaboration', label: 'Social Computing and Collaboration', zhLabel: '社群運算與協作' },
	{ id: 'theme-specific-application-areas', label: 'Specific Application Areas', zhLabel: '特定應用領域 (如學習、健康、家居、設計輔具等)' },
	{ id: 'theme-ethics-accessibility-inclusive-design', label: 'Ethics, Accessibility, and Inclusive Design', zhLabel: '倫理、無障礙與包容性設計' },
	{ id: 'theme-more-than-human-design', label: 'More-than-Human Design', zhLabel: '超越人本中心的設計' },
] as const;

type ThemeId = (typeof POSTER_THEMES)[number]['id'];

const PosterUploadPage: React.FC = () => {
	useSEO({
		title: '上傳海報投票系統 | TAICHI 2026',
		description: 'TAICHI 2026 獨立海報上傳頁面，提供海報標題、作者、摘要、主題、Poster ID 與圖片上傳原型。',
	});

	const [posterId, setPosterId] = useState('');
	const [title, setTitle] = useState('');
	const [authors, setAuthors] = useState('');
	const [abstract, setAbstract] = useState('');
	const [selectedTheme, setSelectedTheme] = useState<ThemeId>(POSTER_THEMES[0].id);
	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string>('');
	const [mockSubmitted, setMockSubmitted] = useState(false);

	useEffect(() => {
		if (!selectedImage) {
			setPreviewUrl('');
			return;
		}

		const objectUrl = URL.createObjectURL(selectedImage);
		setPreviewUrl(objectUrl);

		return () => {
			URL.revokeObjectURL(objectUrl);
		};
	}, [selectedImage]);

	const selectedThemeMeta = useMemo(
		() => POSTER_THEMES.find((theme) => theme.id === selectedTheme) ?? POSTER_THEMES[0],
		[selectedTheme],
	);

	const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] ?? null;
		setSelectedImage(file);
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMockSubmitted(true);
	};

	return (
		<div className='site-theme ds-app-shell min-h-screen overflow-x-hidden'>
			<div className='poster-upload-shell relative isolate min-h-screen'>
				<div className='poster-upload-grid mx-auto flex min-h-screen w-full max-w-[1040px] flex-col px-5 py-8 sm:px-8 lg:px-12 lg:py-12'>
					<section className='poster-upload-intro flex flex-col justify-between gap-8 border border-[rgba(168,240,32,0.18)] bg-[linear-gradient(180deg,rgba(12,12,12,0.9),rgba(12,12,12,0.72))] p-6 sm:p-8'>
						<div className='space-y-6'>
							<p className='ds-page-note'>POSTER SUBMISSION CONSOLE</p>
							<div className='space-y-4'>
								<h1 className={`ds-page-title ${typography.scale.pageTitle}`}>上傳海報投票系統</h1>
								<p className={`${typography.scale.bodyLg} max-w-[32rem] text-white/80`}>
									這是 TAICHI 2026 的獨立 poster upload prototype。請依序填寫海報資訊、選擇投稿主題，並上傳海報主視覺。
								</p>
							</div>
						</div>

						<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2'>
							<div className='ds-surface-panel p-5'>
								<p className='ds-section-kicker'>Signal</p>
								<h2 className='mt-3 ds-panel-subheading'>Poster ID / Theme pairing</h2>
								<p className={`mt-3 ${typography.scale.label} text-white/72`}>
									Poster ID 建議沿用投稿編碼規則，主題則從 11 個研究方向中擇一，讓投票系統可直接識別分組。
								</p>
							</div>
							<div className='ds-surface-soft p-5'>
								<p className='ds-section-kicker'>Checklist</p>
								<ul className={`mt-3 space-y-2 ${typography.scale.label} text-white/72`}>
									<li>Title / Authors / Abstract</li>
									<li>Theme / Category 單選</li>
									<li>Poster image preview</li>
									<li>Mock confirmation after submit</li>
								</ul>
							</div>
						</div>
					</section>

					<section className='mt-6'>
						<form className='poster-upload-form ds-surface-panel p-6 sm:p-8' onSubmit={handleSubmit}>
							<div className='flex flex-col gap-8'>
								<div className='grid gap-5 md:grid-cols-2'>
									<label className='poster-upload-field'>
										<span className='poster-upload-label'>Poster ID</span>
										<input
											className='poster-upload-input'
											name='posterId'
											value={posterId}
											onChange={(event) => setPosterId(event.target.value)}
											placeholder='TAICHI-POSTER-014'
											required
										/>
									</label>

									<div className='poster-upload-readout border-b border-white/10 pb-4'>
										<p className='poster-upload-label'>Selected Theme</p>
										<p className='mt-3 font-dela text-lg tracking-[0.08em] text-[#A8F020]'>{selectedThemeMeta.label}</p>
										<p className={`mt-2 ${typography.scale.label} text-white/64`}>{selectedThemeMeta.zhLabel}</p>
									</div>
								</div>

								<label className='poster-upload-field'>
									<span className='poster-upload-label'>Title</span>
									<input
										className='poster-upload-input'
										name='title'
										value={title}
										onChange={(event) => setTitle(event.target.value)}
										placeholder='請輸入海報標題'
										required
									/>
								</label>

								<label className='poster-upload-field'>
									<span className='poster-upload-label'>Authors</span>
									<input
										className='poster-upload-input'
										name='authors'
										value={authors}
										onChange={(event) => setAuthors(event.target.value)}
										placeholder='請輸入作者姓名，使用逗號分隔'
										required
									/>
								</label>

								<div className='poster-upload-field'>
									<span className='poster-upload-label'>Theme / Category</span>
									<div className='poster-upload-theme-grid mt-3'>
										{POSTER_THEMES.map((theme) => {
											const active = theme.id === selectedTheme;
											return (
												<button
													key={theme.id}
													type='button'
													onClick={() => setSelectedTheme(theme.id)}
													className={`poster-upload-theme-card ${active ? 'poster-upload-theme-card--active' : ''}`}
													aria-pressed={active}
												>
													<span className='font-pixel text-[1.1rem] tracking-[0.08em]'>{theme.label}</span>
													<span className='mt-2 text-sm text-white/68'>{theme.zhLabel}</span>
												</button>
											);
										})}
									</div>
								</div>

								<label className='poster-upload-field'>
									<span className='poster-upload-label'>Abstract</span>
									<textarea
										className='poster-upload-input poster-upload-textarea'
										name='abstract'
										value={abstract}
										onChange={(event) => setAbstract(event.target.value)}
										placeholder='請輸入摘要內容'
										required
									/>
								</label>

								<div className='poster-upload-field'>
									<span className='poster-upload-label'>Upload Poster Image</span>
									<label className='poster-upload-dropzone mt-3'>
										<input
											className='sr-only'
											type='file'
											name='image'
											accept='image/png,image/jpeg,image/webp'
											onChange={handleImageChange}
											required
										/>
										{previewUrl ? (
											<div className='poster-upload-preview'>
												<img src={previewUrl} alt='Poster preview' className='h-full w-full object-cover' />
											</div>
										) : (
											<div className='flex flex-col items-center justify-center gap-3 text-center text-white/72'>
												<ImagePlus size={32} className='text-[#A8F020]' />
												<div>
													<p className='font-pixel text-[1.25rem] uppercase tracking-[0.08em] text-[#A8F020]'>Select image file</p>
													<p className={`mt-2 ${typography.scale.label}`}>PNG, JPG or WEBP poster image</p>
												</div>
											</div>
										)}
									</label>
									{selectedImage ? (
										<p className={`mt-3 ${typography.scale.micro} text-white/60`}>Loaded image: {selectedImage.name}</p>
									) : null}
								</div>

								<div className='grid gap-4 border-t border-white/10 pt-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end'>
									<div className='border-b border-white/10 pb-4'>
										<p className='poster-upload-label'>Submission Status</p>
										<p className={`mt-2 ${typography.scale.label} text-white/72`}>
											This prototype stores your form state locally and returns a visual confirmation after submit.
										</p>
									</div>
									<button type='submit' className='ds-button-submit w-full rounded-none px-5 py-4 md:w-auto md:min-w-[220px]'>
										<span className='font-pixel text-[1.35rem] uppercase tracking-[0.08em]'>Submit Poster</span>
										<span className='font-mono text-sm uppercase text-black/70'>Mock</span>
									</button>
								</div>

								{mockSubmitted ? (
									<div className='poster-upload-confirmation ds-surface-soft flex items-start gap-4 p-5'>
										<CheckCircle2 className='mt-1 text-[#A8F020]' size={22} />
										<div>
											<p className='font-pixel text-[1.3rem] uppercase tracking-[0.08em] text-[#A8F020]'>Submission received</p>
											<p className={`mt-2 ${typography.scale.label} text-white/72`}>
												{title || 'Untitled poster'} has been staged for review with theme {selectedThemeMeta.label}. This is a front-end only confirmation state.
											</p>
										</div>
									</div>
								) : null}
							</div>
						</form>
					</section>
				</div>
			</div>
		</div>
	);
};

export default PosterUploadPage;
