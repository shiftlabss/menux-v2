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
                <div className="error-boundary">
                    <img src="/icon-menux.svg" alt="Menux" className="error-boundary-icon" />
                    <h2 className="error-boundary-title">
                        Algo deu errado
                    </h2>
                    <p className="error-boundary-text">
                        Ocorreu um erro inesperado. Tente recarregar a página.
                    </p>
                    <button
                        onClick={this.handleReload}
                        className="error-boundary-button"
                    >
                        Recarregar
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
