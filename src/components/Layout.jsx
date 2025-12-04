import { Link, Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <header style={{ padding: '1.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                        Meu Site
                    </Link>
                    <nav>
                        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none' }}>
                            <li><Link to="/" style={{ fontWeight: '500' }}>Início</Link></li>
                            <li><Link to="/portfolio" style={{ fontWeight: '500' }}>Portfólio</Link></li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main style={{ flex: 1, padding: '3rem 0' }}>
                <div className="container">
                    <Outlet />
                </div>
            </main>

            <footer style={{ padding: '2rem 0', textAlign: 'center', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} Meu Site Pessoal. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
}

export default Layout;
