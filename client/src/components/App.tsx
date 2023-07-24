import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';

const Home = lazy(() => import('./Home'));
const LoginButton = lazy(() => import('./LoginButton'));
const LogoutButton = lazy(() => import('./LogoutButton'));
const Profile = lazy(() => import('./Profile/Profile'));
const StoryBook = lazy(() => import('./Stories'));
const Ear = lazy(() => import('./EarStuff/Instrument'));
const Sculpture = lazy(() => import('./Hand/Sculpture'));
const VisualArt = lazy(() => import('./Eye/VisualArt'));
const Inbox = lazy(() => import('./Messages/Inbox'));
const Feed = lazy(() => import('./Feed'));
const Trimmer = lazy(() => import('./EarStuff/Trimmer'));

const App = () => {
  const [activeComponent, setActiveComponent] = useState<string>('feed');

  return (
    <div className={activeComponent === 'feed' ? 'feed-open' : ''}>
      <Router>
        <Navbar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
        <Suspense fallback={<h1 align='center'>Loading...</h1>}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login/*' element={<LoginButton />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/:userId' element={<Profile />} />
            <Route path='/logout' element={<LogoutButton />} />
            <Route path='/stories/:roomId' element={<StoryBook />} />
            <Route path='/music' element={<Ear />} />
            <Route path='/visualart/:roomId' element={<VisualArt />} />
            <Route path='/sculpture/:roomId' element={<Sculpture />} />
            <Route path='/messages' element={<Inbox />} />
            <Route path='/feed' element={<Feed />} />
            <Route path='/trimmer' element={<Trimmer />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
