import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

function Portfolio() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.getProjects()
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Falha ao carregar projetos.');
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>Carregando...</div>;
    if (error) return <div className="container" style={{ textAlign: 'center', padding: '4rem', color: 'red' }}>{error}</div>;

    return (
        <div>
            <h1 className="title" style={{ textAlign: 'center', marginBottom: '3rem' }}>Meu Portfólio</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2rem'
            }}>
                {projects.map((project) => (
                    <Link to={`/portfolio/${project.id}`} key={project.id} style={{ display: 'block' }}>
                        <div className="portfolio-item" style={{
                            position: 'relative',
                            borderRadius: '1rem',
                            overflow: 'hidden',
                            aspectRatio: '4/3',
                            cursor: 'pointer',
                            group: 'item'
                        }}>
                            <img
                                src={project.thumbnail}
                                alt={project.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.1)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                                padding: '2rem 1.5rem 1.5rem',
                                pointerEvents: 'none'
                            }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{project.title}</h3>
                                <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>{project.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Portfolio;
