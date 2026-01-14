import { Calendar, ExternalLink, MapPin, User, X, ZoomIn } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface NewsDetailProps {
	item: NewsItem;
	onClose: () => void;
}

const NewsDetail: React.FC<NewsDetailProps> = ({ item, onClose }) => {
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	// Lock body scroll when modal is open
	useEffect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, []);

	const hasDate = item.date && item.date.trim().length > 0;
	const hasPlace = item.place && item.place.trim().length > 0;
	const hasLink = item.link && item.link.trim().length > 0;

	return (
		<>
			<div className='fixed inset-0 z-[60] bg-lab-white/95 backdrop-blur-sm overflow-y-auto flex items-center justify-center p-4 animate-in fade-in duration-200'>
				<div className='relative w-full max-w-4xl bg-white border-2 border-lab-orange shadow-[8px_8px_0px_0px_rgba(255,192,0,1)] flex flex-col max-h-[90vh] overflow-hidden'>
					{/* Header Bar */}
					<div className='flex justify-between items-center bg-lab-orange text-white p-4'>
						<div className='font-pixel text-lg tracking-wider'>EVENT_LOG_VIEWER</div>
						<button onClick={onClose} className='hover:bg-white hover:text-lab-orange p-1 transition-colors'>
							<X size={24} />
						</button>
					</div>

					<div className='overflow-y-auto p-6 md:p-10'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
							{/* Left Column: Image */}
							<div className='space-y-6'>
								<div className='relative aspect-video w-full overflow-hidden border border-black bg-gray-100'>
									<img src={item.image} alt={item.title} className='w-full h-full object-cover' />
								</div>
							</div>

							{/* Right Column: Details */}
							<div className='flex flex-col h-full'>
								<div className='mb-6'>
									{hasDate && <div className='font-mono text-sm text-gray-500 mb-2'>{item.date}</div>}
									<h2 className='font-pixel text-4xl md:text-5xl text-lab-dark leading-tight mb-2'>{item.title}</h2>
									{item.subtitle && (
										<h3 className='font-mono text-xl text-gray-600 mb-6 whitespace-pre-line'>{item.subtitle}</h3>
									)}

									{(hasDate || hasPlace) && (
										<div className='space-y-3 font-mono text-sm border-t border-b border-gray-200 py-4 mb-6'>
											{hasDate && (
												<div className='flex items-center gap-3'>
													<Calendar size={16} className='text-lab-orange' />
													<span>{item.date}</span>
												</div>
											)}
											{hasPlace && (
												<div className='flex items-center gap-3'>
													<MapPin size={16} className='text-lab-orange' />
													<span>{item.place}</span>
												</div>
											)}
										</div>
									)}

									<p className='font-sans text-lg leading-relaxed text-gray-800 mb-4 whitespace-pre-line'>
										{item.content}
									</p>
								</div>

								<div>
									{hasLink && (
										<a
											href={item.link}
											target='_blank'
											rel='noopener noreferrer'
											className='block w-full bg-lab-orange text-white font-pixel text-xl text-center py-3 hover:bg-lab-dark transition-colors flex items-center justify-center gap-2'
										>
											MORE INFO <ExternalLink size={20} />
										</a>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Lightbox Overlay */}
			{selectedImage && (
				<div
					className='fixed inset-0 z-[70] bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200'
					onClick={() => setSelectedImage(null)}
				>
					<button
						className='absolute top-6 right-6 text-white hover:text-lab-orange transition-colors z-50'
						onClick={() => setSelectedImage(null)}
					>
						<X size={40} />
					</button>

					<img
						src={selectedImage}
						alt='Full size recap'
						className='max-w-full max-h-[80vh] object-contain shadow-2xl'
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
			)}
		</>
	);
};

export default NewsDetail;
