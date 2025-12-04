import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

function ProjectDetails() {
    const { id: slug } = useParams(); // Route param is still :id in App.jsx, but we treat it as slug
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.getProject(slug)
            .then(data => {
                setProject(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Projeto não encontrado.');
                setLoading(false);
            });
    }, [slug]);

    if (loading) return <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>Carregando...</div>;

    if (error || !project) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2>{error || 'Projeto não encontrado'}</h2>
                <Link to="/portfolio" className="btn" style={{ marginTop: '1rem' }}>Voltar ao Portfólio</Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Link to="/portfolio" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '2rem',
                color: 'var(--primary-color)',
                fontWeight: '500'
            }}>
                ← Voltar
            </Link>

            <h1 className="title" style={{ fontSize: '2.5rem' }}>{project.title}</h1>
            <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '3rem', lineHeight: '1.8' }}>
                {project.fullDescription}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {project.images.map((img, index) => (
                    <div key={index} style={{
                        borderRadius: '1rem',
                        overflow: 'hidden',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <img
                            src={img}
                            alt={`${project.title} - ${index + 1}`}
                            style={{ width: '100%', display: 'block' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProjectDetails;
