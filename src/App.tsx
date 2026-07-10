import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { DataProvider } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import HomePage from './pages/HomePage';

const AgendaPage = lazy(() => import('./pages/AgendaPage'));
const CFPPage = lazy(() => import('./pages/CFPPage'));
// const CompetitionPage = lazy(() => import('./pages/CompetitionPage'));
const FamilyFriendlyPage = lazy(() => import('./pages/FamilyFriendlyPage'));
const HeroLabPage = lazy(() => import('./pages/HeroLabPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const OrganizationPage = lazy(() => import('./pages/OrganizationPage'));
const PosterUploadPage = lazy(() => import('./pages/PosterUploadPage'));
const ProgramPage = lazy(() => import('./pages/ProgramPage'));
const RegistrationPage = lazy(() => import('./pages/RegistrationPage'));
const SponsorshipPage = lazy(() => import('./pages/SponsorshipPage'));
const VenuePage = lazy(() => import('./pages/VenuePage'));
const VotePage = lazy(() => import('./pages/VotePage'));

const RouteFallback: React.FC = () => (
	<div
		style={{
			minHeight: '60vh',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			fontFamily: 'monospace',
			color: '#29b93a',
			letterSpacing: '0.3em',
			fontSize: '1.1rem',
			animation: 'pulse 1s ease-in-out infinite alternate',
		}}
	>
		LOADING…
	</div>
);

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
						<Suspense fallback={<RouteFallback />}>
							<Routes>
								<Route path='/' element={<Layout />}>
									<Route index element={<HomePage />} />
									<Route path='news' element={<NewsPage />} />
									<Route path='agenda' element={<AgendaPage />} />
									<Route path='program' element={<ProgramPage />} />
									<Route path='cfp' element={<CFPPage />} />
									<Route path='family-friendly' element={<FamilyFriendlyPage />} />
									<Route path='lab/arcade-hero-scroll' element={<HeroLabPage />} />
									<Route path='venue' element={<VenuePage />} />
									<Route path='organization' element={<OrganizationPage />} />
									<Route path='sponsorship' element={<SponsorshipPage />} />
									<Route path='registration' element={<RegistrationPage />} />
									{/* <Route path='competition' element={<CompetitionPage />} /> */}
									<Route path='vote' element={<VotePage />} />
									<Route path='*' element={<NotFoundPage />} />
								</Route>
								<Route path='poster-upload' element={<PosterUploadPage />} />
							</Routes>
						</Suspense>
					</RedirectHandler>
				</BrowserRouter>
			</DataProvider>
		</LanguageProvider>
	);
};

export default App;
