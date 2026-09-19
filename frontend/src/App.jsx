import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Disc3, Home, Library, LogOut, Menu, Mic2, Pause, Play, Search, Sparkles, UserRound, Volume2, X } from 'lucide-react';
import { request } from './lib/api';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import ArtistStudioPage from './pages/ArtistStudioPage';
import AuthModal from './pages/AuthModal';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const covers = [
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=600&q=80'
];

function LegacyNavItem({ icon, label, active, onClick }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span>{active && <i />}</button>; }

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('sonora-user') || 'null'); } catch { return null; }
  });
  const [page, setPage] = useState('home');
  const [authMode, setAuthMode] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [tracks, setTracks] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  async function loadCatalog() {
    if (!user) return;
    try {
      const [music, albumData] = await Promise.all([request('/music'), request('/music/album')]);
      setTracks(music.musics || []);
      setAlbums(albumData.albums || []);
    } catch (error) {
      setNotice(error.message);
    }
  }

  useEffect(() => {
    loadCatalog();
  }, [user]);

  useEffect(() => {
    if (!currentTrack?.uri || !audioRef.current) return;
    audioRef.current.src = currentTrack.uri;
    audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
      setIsPlaying(false);
      setNotice('This audio file could not be played. Check its storage URL.');
    });
  }, [currentTrack]);

  function handleAuth(nextUser) {
    const authenticatedUser = nextUser.user || nextUser;
    setUser(authenticatedUser); localStorage.setItem('sonora-user', JSON.stringify(authenticatedUser));
    if (nextUser.token) localStorage.setItem('sonora-token', nextUser.token);
    setAuthMode(null); setPage(authenticatedUser.role === 'artist' ? 'studio' : 'home'); setNotice(`Welcome, ${authenticatedUser.username}`);
  }

  async function logout() {
    await request('/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null); localStorage.removeItem('sonora-user'); localStorage.removeItem('sonora-token'); setPage('home'); setNotice('You have been logged out');
  }

  const navigate = (nextPage) => { setPage(nextPage); setMobileOpen(false); };
  const openLogin = () => setAuthMode('login');
  const openRegister = () => setAuthMode('register');
  const playTrack = (track) => {
    if (!track?.uri) return setNotice('This is a preview track. Upload an audio file to play it.');
    if (currentTrack?._id === track._id) {
      audioRef.current?.paused ? audioRef.current.play() : audioRef.current?.pause();
      setIsPlaying(audioRef.current?.paused === false);
      return;
    }
    setCurrentTrack(track);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`}>
        <div className="brand"><span className="brand-mark"><Disc3 size={20} /></span><span>sonora</span></div>
        <nav className="main-nav">
          <NavItem icon={<Home size={18} />} label="Overview" active={page === 'home'} onClick={() => navigate('home')} />
          {user && <NavItem icon={<Library size={18} />} label="Your library" active={page === 'library'} onClick={() => navigate('library')} />}
          {user?.role === 'artist' && <NavItem icon={<Mic2 size={18} />} label="Artist studio" active={page === 'studio'} onClick={() => navigate('studio')} />}
        </nav>
        <div className="sidebar-note"><Sparkles size={17} /><span>Find the soundtrack<br />to your next chapter.</span></div>
        <div className="sidebar-bottom">{user ? <button className="profile-mini" onClick={logout}><span className="avatar">{user.username?.[0]?.toUpperCase()}</span><span><b>{user.username}</b><small>{user.role}</small></span><LogOut size={15} /></button> : <button className="profile-mini guest" onClick={openLogin}><span className="avatar"><UserRound size={15} /></span><span><b>Guest mode</b><small>Sign in to listen</small></span><ArrowRight size={15} /></button>}</div>
      </aside>
      {mobileOpen && <button className="mobile-scrim" aria-label="Close menu" onClick={() => setMobileOpen(false)} />}
      <main className="main-content">
        <header className="topbar"><button className="icon-button menu-button" aria-label="Open menu" onClick={() => setMobileOpen(true)}><Menu size={20} /></button><div className="search-box"><Search size={17} /><input placeholder="Search artists, albums, moods" /></div><div className="top-actions">{user ? <button className="top-user" onClick={logout}><span className="avatar small">{user.username?.[0]?.toUpperCase()}</span>{user.username}<LogOut size={14} /></button> : <><button className="text-button" onClick={openLogin}>Log in</button><button className="button button-dark" onClick={openRegister}>Join Sonora <ArrowRight size={15} /></button></>}</div></header>
        {notice && <div className="notice">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss"><X size={14} /></button></div>}
        {!user && page === 'home' ? <LandingPage onStart={openRegister} onLogin={openLogin} /> : page === 'studio' && user?.role === 'artist' ? <ArtistStudioPage tracks={tracks} onNotice={setNotice} onUploaded={loadCatalog} /> : <DashboardPage user={user} page={page} tracks={tracks} albums={albums} onNavigate={navigate} onPlay={playTrack} />}
      </main>
      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onAuth={handleAuth} />}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
      {currentTrack && <div className="player-dock"><div className="player-track"><span className="player-art"><Disc3 size={17} /></span><span><b>{currentTrack.title}</b><small>{currentTrack.artist?.username || 'Sonora artist'}</small></span></div><button className="player-toggle" onClick={() => playTrack(currentTrack)} aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? <Pause size={17} fill="currentColor" /> : <Play size={17} fill="currentColor" />}</button><div className="player-status"><Volume2 size={16} /><span>{isPlaying ? 'Playing now' : 'Paused'}</span></div></div>}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) { return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span>{active && <i />}</button>; }

function Landing({ onStart, onLogin }) {
  return <section className="landing page-enter"><div className="landing-copy"><p className="eyebrow"><span /> Curated for the way you feel</p><h1>Your sound.<br /><em>In full color.</em></h1><p className="landing-lede">A calmer place for the music that moves you. Discover new voices, collect your favorites, and make every moment sound like yours.</p><div className="hero-actions"><button className="button button-green" onClick={onStart}>Start listening <ArrowRight size={17} /></button><button className="button button-quiet" onClick={onLogin}>I already have an account</button></div><div className="listener-count"><div className="face-stack"><span>J</span><span>M</span><span>K</span><span>+</span></div><span>Join 18,000+ curious listeners</span></div></div><div className="hero-art"><div className="sun-orb" /><div className="hero-image"><img src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=85" alt="Singer performing in warm stage light" /></div><div className="floating-card card-track"><div className="mini-cover"><Music2 size={18} /></div><div><small>Now trending</small><b>Golden Hour</b><span>Juno Parks</span></div><button aria-label="Play Golden Hour"><Play size={14} fill="currentColor" /></button></div><div className="floating-card card-stat"><span>♫</span><div><b>12,486</b><small>new sounds this week</small></div></div></div></section>;
}

function Dashboard({ user, page, tracks, albums, onNavigate }) {
  const firstName = user?.username || 'Listener';
  const sampleTracks = tracks.length ? tracks : [{ title: 'Golden Hour', artist: { username: 'Juno Parks' } }, { title: 'Slow Motion', artist: { username: 'Maya Sol' } }, { title: 'Northbound', artist: { username: 'The Coastline' } }];
  return <section className="dashboard page-enter"><div className="welcome-row"><div><p className="eyebrow">{page === 'library' ? 'Your collection' : 'Saturday, September 19'}</p><h2>{page === 'library' ? 'Made for your ears.' : <>Good morning, <em>{firstName}.</em></>}</h2></div><button className="round-button" aria-label="Your profile"><UserRound size={18} /></button></div><div className="feature-band"><div><span className="pill">SONORA SELECTS · 09</span><h3>Soft edges,<br /><em>sharp feelings.</em></h3><p>New releases for slow starts and wide-open windows.</p><button className="button button-light">Play selection <Play size={15} fill="currentColor" /></button></div><div className="band-art"><img src={covers[0]} alt="Abstract concert crowd" /><span className="vinyl"><Disc3 size={44} /></span></div></div><section className="content-section"><div className="section-heading"><div><p className="eyebrow">{albums.length ? 'Fresh from the studio' : 'Handpicked for you'}</p><h3>{albums.length ? 'Latest albums' : 'Made for your mood'}</h3></div><button className="link-button" onClick={() => onNavigate('library')}>See all <ArrowRight size={15} /></button></div><div className="album-grid">{(albums.length ? albums : ['Late night / early morning', 'A little bit of sunshine', 'The art of letting go', 'Headphones on']).slice(0, 4).map((album, index) => <div className="album-card" key={album._id || album.title || album}><div className="album-cover"><img src={covers[index]} alt="" /><button className="play-float" aria-label={`Play ${album.title || album}`}><Play size={15} fill="currentColor" /></button></div><b>{album.title || album}</b><span>{album.artist?.username || 'Sonora editorial'}</span></div>)}</div></section><section className="content-section track-section"><div className="section-heading"><div><p className="eyebrow">The pulse right now</p><h3>Trending tracks</h3></div><span className="live-label"><i /> Updated today</span></div><div className="track-list">{sampleTracks.slice(0, 4).map((track, index) => <div className="track-row" key={track._id || index}><span className="track-number">0{index + 1}</span><div className="track-art"><img src={covers[(index + 1) % covers.length]} alt="" /></div><div className="track-info"><b>{track.title}</b><span>{track.artist?.username || 'Sonora artist'}</span></div><span className="track-time">{3 + index}:{index ? '2' : '48'}</span><button className="heart-button" aria-label="Add to favorites"><Heart size={16} /></button><button className="row-play" aria-label={`Play ${track.title}`}><Play size={13} fill="currentColor" /></button></div>)}</div></section></section>;
}

function ArtistStudio({ user, tracks, onNotice }) {
  const [title, setTitle] = useState(''); const [file, setFile] = useState(null); const [loading, setLoading] = useState(false);
  async function upload(event) { event.preventDefault(); if (!file || !title) return onNotice('Add a title and audio file first'); const body = new FormData(); body.append('title', title); body.append('music', file); setLoading(true); try { await fetch(`${API}/music/upload`, { method: 'POST', credentials: 'include', body }).then(async (res) => { const data = await res.json(); if (!res.ok) throw new Error(data.message); return data; }); setTitle(''); setFile(null); onNotice('Track uploaded successfully'); } catch (error) { onNotice(error.message); } finally { setLoading(false); } }
  return <section className="studio page-enter"><div className="welcome-row"><div><p className="eyebrow">Artist workspace</p><h2>Make some <em>noise.</em></h2></div><span className="artist-badge"><Mic2 size={15} /> Artist account</span></div><div className="studio-grid"><form className="upload-panel" onSubmit={upload}><div className="panel-heading"><span className="panel-icon"><Upload size={18} /></span><div><h3>Release a track</h3><p>Share something new with your listeners.</p></div></div><label>Track title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Midnight Drive" /></label><label className="file-drop"><input type="file" accept="audio/*" onChange={(event) => setFile(event.target.files?.[0] || null)} /><Upload size={25} /><b>{file ? file.name : 'Drop your audio here'}</b><span>{file ? 'Ready to upload' : 'MP3, WAV or M4A · 50MB max'}</span></label><button className="button button-green full-button" disabled={loading}>{loading ? 'Uploading…' : 'Publish track'} <ArrowRight size={16} /></button></form><div className="studio-side"><div className="stat-panel"><p className="eyebrow">Your catalog</p><strong>{tracks.length.toString().padStart(2, '0')}</strong><span>published tracks</span><div className="sparkline"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div></div><div className="tip-panel"><Sparkles size={18} /><b>Small ritual, big reach</b><p>Artists with a consistent release rhythm grow their audience 3× faster.</p></div></div></div></section>;
}

function LegacyAuthModal({ mode, onClose, onAuth }) {
  const [isLogin, setIsLogin] = useState(mode === 'login'); const [role, setRole] = useState('user'); const [form, setForm] = useState({ username: '', email: '', password: '' }); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(event) { event.preventDefault(); setLoading(true); setError(''); try { const data = await request(`/auth/${isLogin ? 'login' : 'register'}`, { method: 'POST', body: JSON.stringify(isLogin ? { username: form.username, password: form.password } : { ...form, role }) }); onAuth(data.user); } catch (requestError) { setError(requestError.message); } finally { setLoading(false); } }
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="auth-modal"><button className="modal-close" onClick={onClose} aria-label="Close"><X size={18} /></button><div className="auth-mark"><Disc3 size={20} /></div><p className="eyebrow">Welcome to sonora</p><h2>{isLogin ? 'Good to hear you.' : 'Find your frequency.'}</h2><p className="modal-copy">{isLogin ? 'Pick up exactly where you left off.' : 'Create a home for the music that matters.'}</p><form onSubmit={submit}>{!isLogin && <><div className="role-switch"><button type="button" className={role === 'user' ? 'selected' : ''} onClick={() => setRole('user')}><Headphones size={15} /> Listener</button><button type="button" className={role === 'artist' ? 'selected' : ''} onClick={() => setRole('artist')}><Mic2 size={15} /> Artist</button></div><label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label></>}<label>Username<input required value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder={isLogin ? 'Your username' : 'Your stage name'} /></label><label>Password<input required type="password" minLength="6" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="At least 6 characters" /></label>{error && <p className="form-error">{error}</p>}<button className="button button-green full-button" disabled={loading}>{loading ? 'One moment…' : isLogin ? 'Enter Sonora' : 'Create account'} <ArrowRight size={16} /></button></form><p className="auth-switch">{isLogin ? 'New to Sonora?' : 'Already have an account?'} <button onClick={() => { setIsLogin(!isLogin); setError(''); }}> {isLogin ? 'Create one' : 'Log in'}</button></p></div></div>;
}

export default App;
