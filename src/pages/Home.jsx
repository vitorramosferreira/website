import { Link } from 'react-router-dom';

function Home() {
    return (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h1 className="title">Bem-vindo ao Meu Espaço</h1>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 3rem' }}>
                Aqui você encontra meus projetos, ideias e recursos futuros. Explore à vontade!
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                {/* Portfolio Button */}
                <Link to="/portfolio" className="resource-card" style={{
                    background: 'var(--card-bg)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'transform 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ fontSize: '3rem' }}>🎨</div>
                    <h2 style={{ fontSize: '1.5rem' }}>Portfólio</h2>
                    <p style={{ color: '#94a3b8' }}>Veja meus trabalhos e projetos recentes.</p>
                    <span className="btn" style={{ marginTop: 'auto' }}>Acessar</span>
                </Link>

                {/* Future Resource Placeholder 1 */}
                <div className="resource-card" style={{
                    background: 'var(--card-bg)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    opacity: 0.7,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ fontSize: '3rem' }}>🚀</div>
                    <h2 style={{ fontSize: '1.5rem' }}>Em Breve</h2>
                    <p style={{ color: '#94a3b8' }}>Novos recursos serão adicionados aqui.</p>
                    <button disabled className="btn" style={{ marginTop: 'auto', background: '#334155', cursor: 'not-allowed' }}>Aguarde</button>
                </div>

                {/* Future Resource Placeholder 2 */}
                <div className="resource-card" style={{
                    background: 'var(--card-bg)',
                    padding: '2rem',
                    borderRadius: '1rem',
                    border: '1px solid rgba(255,255,255,0.05)',
                    opacity: 0.7,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ fontSize: '3rem' }}>💡</div>
                    <h2 style={{ fontSize: '1.5rem' }}>Ideias</h2>
                    <p style={{ color: '#94a3b8' }}>Espaço para compartilhar pensamentos.</p>
                    <button disabled className="btn" style={{ marginTop: 'auto', background: '#334155', cursor: 'not-allowed' }}>Aguarde</button>
                </div>
            </div>
        </div>
    );
}

export default Home;
