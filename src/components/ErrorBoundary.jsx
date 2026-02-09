import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary]', error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100dvh',
                    padding: '24px',
                    textAlign: 'center',
                    fontFamily: 'Geist, sans-serif',
                    background: '#F5F5F5',
                }}>
                    <img src="/icon-menux.svg" alt="Menux" style={{ width: 40, marginBottom: 20, opacity: 0.5 }} />
                    <h2 style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px', color: '#333' }}>
                        Algo deu errado
                    </h2>
                    <p style={{ fontSize: 14, color: '#888', margin: '0 0 24px', lineHeight: 1.5 }}>
                        Ocorreu um erro inesperado. Tente recarregar a página.
                    </p>
                    <button
                        onClick={this.handleReload}
                        style={{
                            padding: '12px 32px',
                            borderRadius: 12,
                            border: 'none',
                            background: '#000',
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'Geist, sans-serif',
                        }}
                    >
                        Recarregar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
