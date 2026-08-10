import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { DataProvider } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import HomePage from './pages/HomePage';

const AgendaPage = lazy(() => import('./pages/AgendaPage'));
const AwardsPage = lazy(() => import('./pages/AwardsPage'));
const CFPPage = lazy(() => import('./pages/CFPPage'));
// const CompetitionPage = lazy(() => import('./pages/CompetitionPage'));
// 活動已結束：/q（QPage）與 /vote（VotePage）改掛收站頁，原程式保留供交接（見 HANDOVER.md）
// const QPage = lazy(() => import('./pages/QPage'));
// const VotePage = lazy(() => import('./pages/VotePage'));
const EventEndedPage = lazy(() => import('./pages/EventEndedPage'));
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
const VenueV2Page = lazy(() => import('./pages/VenueV2Page'));

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

// The venue page is now served at /transit; the former /venue and /venue-v2
// URLs redirect there, preserving the day hash (#day1 / #day2) so old links
// land on the right tab.
const VenueRedirect: React.FC = () => {
	const { hash } = useLocation();
	return <Navigate to={`/transit${hash}`} replace />;
};

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
									<Route path='awards' element={<AwardsPage />} />
									<Route path='agenda' element={<AgendaPage />} />
									<Route path='program' element={<ProgramPage />} />
									<Route path='cfp' element={<CFPPage />} />
									<Route path='family-friendly' element={<FamilyFriendlyPage />} />
									<Route path='lab/arcade-hero-scroll' element={<HeroLabPage />} />
									<Route path='transit' element={<VenueV2Page />} />
									<Route path='venue' element={<VenueRedirect />} />
									<Route path='venue-v2' element={<VenueRedirect />} />
									<Route path='organization' element={<OrganizationPage />} />
									<Route path='sponsorship' element={<SponsorshipPage />} />
									<Route path='registration' element={<RegistrationPage />} />
									{/* <Route path='competition' element={<CompetitionPage />} /> */}
									<Route path='vote' element={<EventEndedPage />} />
									<Route path='q' element={<EventEndedPage />} />
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
