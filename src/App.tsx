import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { ArrowDown, ArrowRight, Check, ChevronDown, Download, HeartHandshake, LockKeyhole, Menu, Play, ShieldCheck, Sparkles, X } from 'lucide-react';
import logoPath from '@/assets/logo.jpeg';
import portraitPath from '@/assets/portrait.jpg';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'TU_SUPABASE_URL_AQUI';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'TU_SUPABASE_ANON_KEY_AQUI';
const supabase = createClient(supabaseUrl, supabaseKey);

const queryClient = new QueryClient();

function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isUnlocked) nameInputRef.current?.focus();
  }, [isUnlocked]);

  const handleUnlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: { name?: string; phone?: string } = {};
    if (!name.trim()) nextErrors.name = 'Escribe tu nombre para continuar.';
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) nextErrors.phone = 'Ingresa un número de 10 dígitos.';
    setErrors(nextErrors);
    
    if (Object.keys(nextErrors).length === 0) {
      try {
        const { error } = await supabase
          .from('leads')
          .insert([{ nombre: name.trim(), telefono: phone.trim() }]);

        if (error) {
          console.error('Error insertando en Supabase:', error);
          alert('Hubo un problema guardando tu información. Por favor, intenta de nuevo.');
          return; // Detenemos la ejecución y NO ocultamos el modal
        }

        // Éxito: Desbloqueamos la página y scrolleamos al video
        setIsUnlocked(true);
        window.setTimeout(() => document.getElementById('video')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 450);
      } catch (err) {
        console.error('Error de conexión:', err);
        alert('Error de conexión. Por favor, intenta nuevamente.');
      }
    }
  };

  const handleDownload = () => {
    const anchor = document.createElement('a');
    anchor.href = './Marisol.pdf';
    anchor.download = 'Marisol.pdf';
    anchor.target = '_blank';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setDownloaded(true);
  };

  return (
    <div className="relative overflow-hidden">
      <div className={`site-page ${!isUnlocked ? 'is-locked' : ''}`}>
        <div className="top-line" />
        <header className="border-b border-slate-200/80 bg-white/90">
          <div className="container-page flex h-[82px] items-center justify-between gap-5">
            <a href="#inicio" aria-label="Seguros con Marisol, inicio" data-testid="link-logo-home">
              <img src={logoPath} alt="Seguros con Marisol" className="w-[142px] sm:w-[178px]" />
            </a>
            <nav className="hidden items-center gap-8 text-[.78rem] font-bold text-[#112255] md:flex" aria-label="Navegación principal">
              <a href="#video" data-testid="link-video">Ver el video</a>
              <a href="#manual" data-testid="link-manual">Descarga tu manual</a>
              <a href="#marisol" data-testid="link-marisol">Conoce a Marisol</a>
            </nav>
            <button type="button" className="secondary-button !px-3 !py-2 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label="Abrir menú" data-testid="button-open-menu">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <a href="#manual" className="primary-button hidden !px-4 !py-2.5 text-xs sm:inline-flex" data-testid="button-header-manual">Quiero mi guía</a>
          </div>
          {menuOpen && (
            <nav className="container-page flex flex-col gap-3 border-t border-slate-100 py-4 text-sm font-bold text-[#112255] md:hidden" aria-label="Menú móvil">
              <a href="#video" onClick={() => setMenuOpen(false)} data-testid="link-mobile-video">Ver el video</a>
              <a href="#manual" onClick={() => setMenuOpen(false)} data-testid="link-mobile-manual">Descarga tu manual</a>
              <a href="#marisol" onClick={() => setMenuOpen(false)} data-testid="link-mobile-marisol">Conoce a Marisol</a>
            </nav>
          )}
        </header>

        <main id="inicio">
          <section className="relative isolate py-16 sm:py-24 lg:py-28">
            <div className="hero-blob" />
            <div className="container-page hero-grid">
              <div className="hero-copy reveal">
                <p className="eyebrow">Educación que se siente como protección</p>
                <h1 className="mt-5 max-w-[680px] font-display text-[clamp(2.35rem,5vw,4.5rem)] leading-[1.05] tracking-[-.035em] text-[#112255]">
                  Estás a un solo paso de descubrir cómo proteger tu salud y tu dinero en Estados Unidos.
                </h1>
                <p className="mt-6 max-w-[560px] text-[1.02rem] leading-7 text-slate-600">
                  Una guía clara, en español y pensada para nuestra comunidad. Sin palabras complicadas. Sin decisiones a ciegas.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a href="#video" className="primary-button" data-testid="button-hero-video">Ver video gratuito <ArrowRight size={17} /></a>
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-500"><ShieldCheck size={17} className="text-[#e70073]" /> Información confiable</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 reveal" style={{ animationDelay: '.12s' }}>
                <div id="video" className="video-frame">
                  {videoPlaying ? (
                    <video 
                      src="./video.mp4" 
                      controls 
                      autoPlay 
                      className="h-full w-full object-cover bg-black"
                    >
                      Tu navegador no soporta el formato de video.
                    </video>
                  ) : (
                    <>
                      <div className="video-lines" />
                      <div className="absolute left-5 top-5 flex items-center gap-2 text-[.67rem] font-bold uppercase tracking-[.16em] text-white/70"><span className="h-2 w-2 rounded-full bg-[#e70073]" /> Video de bienvenida</div>
                      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 text-white">
                        <p className="max-w-[14rem] font-display text-lg leading-tight sm:text-2xl">Tu futuro merece una decisión informada.</p>
                        <span className="text-[.68rem] uppercase tracking-wider text-white/60">04:32 min</span>
                      </div>
                      <button type="button" className="play-button" onClick={() => setVideoPlaying(true)} aria-label="Reproducir video de bienvenida" data-testid="button-play-video"><Play size={28} fill="currentColor" /></button>
                    </>
                  )}
                </div>
                <button 
                  type="button" 
                  className="primary-button flex w-full items-center justify-center gap-2 py-4" 
                  onClick={handleDownload}
                >
                  {downloaded ? <Check size={18} /> : <Download size={18} />} 
                  {downloaded ? 'Guía descargada' : 'Descargar guía'}
                </button>
              </div>
            </div>
          </section>

          <section className="trust-strip py-5" aria-label="Señales de confianza">
            <div className="container-page grid grid-cols-2 gap-5 text-center sm:grid-cols-4">
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#112255]"><HeartHandshake size={18} className="text-[#e70073]" /> Cercanía real</div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#112255]"><ShieldCheck size={18} className="text-[#e70073]" /> Educación primero</div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#112255]"><LockKeyhole size={17} className="text-[#e70073]" /> Tus datos seguros</div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#112255]"><Sparkles size={17} className="text-[#e70073]" /> En español</div>
            </div>
          </section>

          <section className="container-page py-20 sm:py-28">
            <div className="grid gap-12 md:grid-cols-[.75fr_1.25fr] md:items-end">
              <div>
                <p className="eyebrow">Un mapa, no más dudas</p>
                <h2 className="mt-4 font-display text-4xl leading-tight text-[#112255] sm:text-5xl">Lo importante se entiende mejor cuando alguien te lo explica bien.</h2>
              </div>
              <p className="max-w-xl text-base leading-7 text-slate-600 md:justify-self-end">Muchas familias trabajadoras en Estados Unidos protegen lo que han construido cuando tienen la información correcta a tiempo. Marisol traduce lo complejo a pasos que puedes aplicar hoy.</p>
            </div>
            <div className="mt-14 grid gap-10 sm:grid-cols-3">
              <div className="step-card"><span className="step-number">01 / ENTENDER</span><h3 className="mt-3 text-lg font-bold text-[#112255]">Ordena tus prioridades</h3><p className="mt-2 text-sm leading-6 text-slate-600">Salud, ahorro y protección familiar: empieza por lo que más te importa.</p></div>
              <div className="step-card"><span className="step-number">02 / COMPARAR</span><h3 className="mt-3 text-lg font-bold text-[#112255]">Conoce tus opciones</h3><p className="mt-2 text-sm leading-6 text-slate-600">Decide con contexto, no con presión ni con términos que nadie explica.</p></div>
              <div className="step-card"><span className="step-number">03 / ACTUAR</span><h3 className="mt-3 text-lg font-bold text-[#112255]">Da el siguiente paso</h3><p className="mt-2 text-sm leading-6 text-slate-600">Una pequeña decisión hoy puede cuidar la tranquilidad de toda tu familia.</p></div>
            </div>
          </section>

          <section id="manual" className="guide-section py-20 sm:py-28">
            <div className="container-page grid gap-8 md:grid-cols-[.9fr_1.1fr] md:items-center">
              <div className="book-wrap">
                <div className="book" aria-label="Portada de El Manual del Inmigrante Inteligente">
                  <span className="book-kicker">Seguros con Marisol</span>
                  <h3>El Manual<br />del Inmigrante<br /><em>Inteligente</em></h3>
                  <p>Una guía práctica para cuidar tu dinero y tu familia en Estados Unidos.</p>
                  <div className="guide-mark" />
                </div>
              </div>
              <div className="guide-copy">
                <p className="eyebrow !text-[#ff7eb9]">Tu regalo de bienvenida</p>
                <h2 className="mt-4 max-w-xl font-display text-4xl leading-tight sm:text-5xl">Descarga tu Manual Gratuito</h2>
                <p className="mt-5 max-w-lg text-base leading-7 text-white/75">3 pasos para proteger tus ahorros y los de tu familia frente a cualquier emergencia.</p>
                <button type="button" className="download-button mt-8" onClick={handleDownload} data-testid="button-download-guide">{downloaded ? <Check size={18} /> : <Download size={18} />} {downloaded ? 'Manual descargado' : 'Descargar mi manual'}</button>
                {downloaded && <p className="success-note mt-3 !text-[#ffb7d5]" role="status" data-testid="status-download">Listo. Revisa la carpeta de descargas de tu dispositivo.</p>}
                <p className="mt-5 flex items-center gap-2 text-xs text-white/50"><LockKeyhole size={14} /> Tus datos se usan solo para enviarte información útil.</p>
              </div>
            </div>
          </section>

          <section id="marisol" className="container-page py-20 sm:py-28">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div><p className="eyebrow">La persona detrás de la guía</p><h2 className="mt-3 font-display text-4xl text-[#112255] sm:text-5xl">Conoce a Marisol</h2></div>
              <span className="rounded-full bg-[#fff0f7] px-4 py-2 text-xs font-bold text-[#b4005c]">Tu aliada en Estados Unidos</span>
            </div>
            <article className="authority-card">
              <div className="portrait"><img src={portraitPath} alt="Marisol, fundadora de Seguros con Marisol" data-testid="img-marisol-portrait" /></div>
              <div className="authority-copy">
                <div className="quote-mark">“</div>
                <p className="mt-5 text-lg leading-8 text-[#112255] sm:text-xl">Nací en Cuba, viví en Italia y llegué a Estados Unidos empezando desde cero. Como técnica de farmacia vi a muchas familias perder su dinero por falta de información. Hoy, mi misión es educar y proteger a nuestra comunidad hispana para que puedan tomar decisiones financieras y de salud inteligentes, sin arruinar su economía.</p>
                <div className="mt-8 flex items-center gap-3 border-t border-slate-200 pt-5"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#112255] text-sm font-bold text-white">M</span><div><p className="font-bold text-[#112255]">Marisol</p><p className="text-xs text-slate-500">Educadora y protectora de familias</p></div></div>
              </div>
            </article>
          </section>

          <section className="bg-[#eef3f8] py-16 sm:py-20">
            <div className="container-page flex flex-col items-start justify-between gap-7 sm:flex-row sm:items-center">
              <div><p className="eyebrow">Tu tranquilidad empieza con una conversación</p><h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-[#112255] sm:text-4xl">No tienes que resolverlo todo hoy. Solo empieza por aprender.</h2></div>
              <a href="#manual" className="primary-button shrink-0" data-testid="button-final-guide">Quiero mi guía <ArrowDown size={17} /></a>
            </div>
          </section>
        </main>

        <footer className="bg-[#112255] py-9 text-white">
          <div className="container-page flex flex-col gap-5 text-center text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div><img src={logoPath} alt="Seguros con Marisol" className="mx-auto mb-3 w-[155px] brightness-0 invert sm:mx-0" /><p data-testid="text-copyright">© 2026 Seguros con Marisol. Todos los derechos reservados.</p></div>
            <div className="flex justify-center gap-5 sm:justify-end"><a href="#privacy" data-testid="link-privacy">Privacidad</a><a href="#terms" data-testid="link-terms">Términos</a></div>
          </div>
        </footer>
      </div>

      {!isUnlocked && (
        <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="unlock-title">
          <div className="unlock-modal">
            <img src={logoPath} alt="Seguros con Marisol" className="modal-logo" data-testid="img-modal-logo" />
            <p className="eyebrow text-center">Una decisión con más claridad</p>
            <h2 id="unlock-title" className="mt-3 text-center font-display text-[clamp(1.8rem,5vw,2.45rem)] leading-[1.12] text-[#112255]">Estás a un paso de descubrir cómo proteger tu salud y tu dinero en Estados Unidos</h2>
            <p className="mx-auto mt-4 max-w-sm text-center text-sm leading-6 text-slate-500">Déjanos tu información para abrir el video y recibir tu manual gratuito.</p>
            <form onSubmit={handleUnlock} className="mt-7 space-y-4" noValidate>
              <div><label htmlFor="name" className="field-label">Nombre</label><input ref={nameInputRef} id="name" name="name" value={name} onChange={(event) => setName(event.target.value)} className="field-input" placeholder="¿Cómo te llamas?" autoComplete="name" aria-invalid={Boolean(errors.name)} data-testid="input-name" />{errors.name && <p className="field-error" role="alert" data-testid="error-name">{errors.name}</p>}</div>
              <div><label htmlFor="phone" className="field-label">Número de Teléfono</label><input id="phone" name="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="field-input" placeholder="(000) 000-0000" autoComplete="tel" aria-invalid={Boolean(errors.phone)} data-testid="input-phone" />{errors.phone && <p className="field-error" role="alert" data-testid="error-phone">{errors.phone}</p>}</div>
              <button type="submit" className="primary-button w-full py-3.5" data-testid="button-unlock">Ver Video y Descargar Guía <ArrowRight size={18} /></button>
            </form>
            <p className="modal-note"><LockKeyhole size={13} /> Tu información está protegida y no compartimos tus datos.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={Home} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  const base = import.meta.env.BASE_URL.startsWith('.') ? '' : import.meta.env.BASE_URL.replace(/\/$/, '');
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={base}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
