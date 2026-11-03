import { useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import {
  MapPin, Navigation, Truck, Crosshair, Map, ShieldCheck,
  AlertCircle, CheckCircle2, LoaderCircle, Copy, ExternalLink,
  LocateFixed, Clock3
} from 'lucide-react';

export default function App() {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  async function locateMe() {
    setLoading(true);
    setError('');
    setPosition(null);
    setCopied(false);

    try {
      // Confere e solicita a permissão nativa de localização do Android.
      let permissions = await Geolocation.checkPermissions();

      if (
        permissions.location !== 'granted' &&
        permissions.coarseLocation !== 'granted'
      ) {
        permissions = await Geolocation.requestPermissions();
      }

      if (
        permissions.location !== 'granted' &&
        permissions.coarseLocation !== 'granted'
      ) {
        throw new Error('Permissão de localização não concedida. Autorize o acesso nas configurações do celular.');
      }

      // Obtém uma posição atual; a precisão depende do GPS e do ambiente.
      const result = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      });

      setPosition({
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy,
        timestamp: result.timestamp
      });
    } catch (err) {
      console.error('Falha ao obter localização:', err);
      const code = err?.code;

      if (code === 1) {
        setError('A permissão de localização foi negada. Habilite a localização para o Guinchos24h nas configurações do Android.');
      } else if (code === 2) {
        setError('Não foi possível determinar sua posição. Confira se a localização do celular está ativada e tente novamente em uma área aberta.');
      } else if (code === 3) {
        setError('A localização demorou demais para responder. Tente novamente em alguns instantes.');
      } else {
        setError(err?.message || 'Ocorreu um erro ao buscar sua localização. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  const mapsUrl = position
    ? `https://www.google.com/maps/search/?api=1&query=${position.latitude},${position.longitude}`
    : '';

  async function copyCoordinates() {
    if (!position) return;
    const text = `${position.latitude}, ${position.longitude}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setError('Não foi possível copiar automaticamente. Você pode selecionar as coordenadas na tela.');
    }
  }

  function openMaps() {
    if (!mapsUrl) return;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  }

  const formattedTime = position
    ? new Date(position.timestamp).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
      })
    : '';

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Guinchos24h início">
          <span className="brand-mark"><Truck size={25} strokeWidth={2.5} /></span>
          <span>GUINCHOS<span className="brand-light">24H</span></span>
        </a>
        <span className="availability"><i /> ATENDIMENTO 24 HORAS</span>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span /> SOCORRO NA ESTRADA</div>
          <h1>Precisa de ajuda?<br /><em>A gente encontra você.</em></h1>
          <p className="hero-text">
            Não sabe o quilômetro da rodovia? Sem problema. Use o GPS do seu
            celular para compartilhar sua localização com o serviço de guincho.
          </p>
          <div className="trust-line">
            <ShieldCheck size={17} /> Sua localização é utilizada para facilitar o atendimento.
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="pin-glow"><MapPin size={66} strokeWidth={1.5} /></div>
          <div className="road-line" />
          <div className="art-label"><Navigation size={14} /> LOCALIZAÇÃO GPS</div>
        </div>
      </section>

      <section className="content-grid">
        <article className="location-card">
          <div className="card-heading">
            <div>
              <span className="section-kicker">LOCALIZAÇÃO DO MOTORISTA</span>
              <h2>Onde você está?</h2>
            </div>
            <span className="gps-badge"><Crosshair size={14} /> GPS</span>
          </div>

          <p className="instruction">
            Toque no botão abaixo para capturar sua posição atual. O Android
            poderá pedir sua autorização para acessar a localização.
          </p>

          <button className="primary-button" onClick={locateMe} disabled={loading}>
            {loading
              ? <><LoaderCircle className="spin" size={19} /> Buscando sua localização...</>
              : <><LocateFixed size={19} /> Localizar minha posição</>}
          </button>

          {error && (
            <div className="error-box" role="alert">
              <AlertCircle size={19} />
              <span>{error}</span>
            </div>
          )}

          {position ? (
            <div className="result-panel">
              <div className="success-heading">
                <span className="success-icon"><CheckCircle2 size={19} /></span>
                <div>
                  <strong>Localização encontrada!</strong>
                  <small>Coordenadas recebidas pelo GPS do aparelho</small>
                </div>
              </div>

              <div className="coordinates">
                <div className="coordinate-row">
                  <span>LATITUDE</span>
                  <strong>{position.latitude.toFixed(6)}°</strong>
                </div>
                <div className="coordinate-row">
                  <span>LONGITUDE</span>
                  <strong>{position.longitude.toFixed(6)}°</strong>
                </div>
              </div>

              <div className="accuracy-row">
                <div className="accuracy-icon"><Crosshair size={17} /></div>
                <div className="accuracy-copy">
                  <span>Precisão estimada</span>
                  <strong>± {Math.round(position.accuracy)} metros</strong>
                </div>
                <span className="accuracy-note">GPS</span>
              </div>

              <div className="captured-time"><Clock3 size={14} /> Capturado em {formattedTime}</div>

              <div className="action-row">
                <button className="map-button" onClick={openMaps}>
                  <Map size={18} /> Abrir no Google Maps <ExternalLink size={15} />
                </button>
                <button className="copy-button" onClick={copyCoordinates} aria-label="Copiar coordenadas">
                  {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><MapPin size={21} /></div>
              <div>
                <strong>Sua localização aparecerá aqui</strong>
                <span>Latitude, longitude e precisão serão exibidas após a captura.</span>
              </div>
            </div>
          )}
        </article>

        <aside className="help-card">
          <div className="help-icon"><Truck size={25} /></div>
          <span className="section-kicker">COMO FUNCIONA</span>
          <h3>Socorro sem complicação.</h3>
          <ol className="steps">
            <li><span>01</span><div><strong>Permita o acesso</strong><p>Autorize o uso da localização quando o Android solicitar.</p></div></li>
            <li><span>02</span><div><strong>Encontre sua posição</strong><p>O aplicativo captura as coordenadas atuais do aparelho.</p></div></li>
            <li><span>03</span><div><strong>Compartilhe o ponto</strong><p>Abra o Google Maps para visualizar e compartilhar o local.</p></div></li>
          </ol>
          <div className="help-note"><ShieldCheck size={17} /><span><strong>Dica:</strong> mantenha o GPS ligado e, se possível, fique em um local aberto para melhorar a precisão.</span></div>
        </aside>
      </section>

      <footer className="footer">
        <span>GUINCHOS<span className="brand-light">24H</span></span>
        <span>Sua localização, nosso destino.</span>
        <span className="footer-dot"><i /> Projeto acadêmico · PPDM2</span>
      </footer>
    </main>
  );
}
