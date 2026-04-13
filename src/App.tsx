import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { DataProvider } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import AgendaPage from './pages/AgendaPage';
import CFPPage from './pages/CFPPage';
import CompetitionPage from './pages/CompetitionPage';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import OrganizationPage from './pages/OrganizationPage';
import PosterUploadPage from './pages/PosterUploadPage';
import VenuePage from './pages/VenuePage';
import VotePage from './pages/VotePage';

// Component to handle 404 redirects
const RedirectHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const navigate = useNavigate();

	useEffect(() => {
		const redirect = (window as any).__INITIAL_REDIRECT__;
		if (redirect) {
			delete (window as any).__INITIAL_REDIRECT__;
			navigate(redirect, { replace: true });
		}
	}, [navigate]);

	return <>{children}</>;
};

const App: React.FC = () => {
	const baseUrl = import.meta.env.BASE_URL;

	return (
		<LanguageProvider>
			<DataProvider>
				<BrowserRouter basename={baseUrl}>
					<RedirectHandler>
						<Routes>
							<Route path='/' element={<Layout />}>
								<Route index element={<HomePage />} />
								<Route path='news' element={<NewsPage />} />
								<Route path='agenda' element={<AgendaPage />} />
								<Route path='cfp' element={<CFPPage />} />
								<Route path='venue' element={<VenuePage />} />
								<Route path='organization' element={<OrganizationPage />} />
								<Route path='competition' element={<CompetitionPage />} />
								<Route path='vote' element={<VotePage />} />
							</Route>
							<Route path='poster-upload' element={<PosterUploadPage />} />
						</Routes>
					</RedirectHandler>
				</BrowserRouter>
			</DataProvider>
		</LanguageProvider>
	);
};

export default App;
