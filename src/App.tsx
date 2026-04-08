import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const ComingSoon: React.FC = () => {
	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-lab-black text-lab-white p-6 text-center'>
			<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold text-lab-orange mb-8 tracking-wider'>第12屆台灣人機互動研討會</h1>
			<p className='text-2xl md:text-3xl font-medium mb-4 leading-relaxed text-lab-white/90'>
				2026/08/05 - 08/06
				<br />
				將會於臺北舉辦！
			</p>
			<div className='mt-10 px-8 py-4 border-2 border-lab-lime rounded-xl shadow-pili-glow text-lab-lime text-xl md:text-2xl font-bold animate-pulse'>
				網頁近期會上架！Coming Soon！
			</div>
		</div>
	);
};

const App: React.FC = () => {
	const baseUrl = import.meta.env.BASE_URL;

	return (
		<BrowserRouter basename={baseUrl}>
			<Routes>
				<Route path='*' element={<ComingSoon />} />
			</Routes>
		</BrowserRouter>
	);
};

export default App;
