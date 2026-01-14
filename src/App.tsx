import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { DataProvider } from './context/DataContext';
import AgendaPage from './pages/AgendaPage';
import CFPPage from './pages/CFPPage';
import HomePage from './pages/HomePage';
import NewsPage from './pages/NewsPage';
import OrganizationPage from './pages/OrganizationPage';
import VenuePage from './pages/VenuePage';

const App: React.FC = () => {
	const baseUrl = import.meta.env.BASE_URL;

	return (
		<DataProvider>
			<BrowserRouter basename={baseUrl}>
				<Routes>
					<Route path='/' element={<Layout />}>
						<Route index element={<HomePage />} />
						<Route path='news' element={<NewsPage />} />
						<Route path='agenda' element={<AgendaPage />} />
						<Route path='cfp' element={<CFPPage />} />
						<Route path='venue' element={<VenuePage />} />
						<Route path='organization' element={<OrganizationPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</DataProvider>
	);
};

export default App;
