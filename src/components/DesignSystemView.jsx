import { useState } from 'react';
import { motion } from 'framer-motion';

// Icons for DS use
const TrashIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
    </svg>
);

const PlusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12h14" />
    </svg>
);

const MinusIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
    </svg>
);

export default function DesignSystemView() {
    const [activeSection, setActiveSection] = useState('typography');

    const sections = [
        { id: 'typography', label: 'Typography', group: 'Atomic' },
        { id: 'buttons', label: 'Buttons', group: 'Atomic' },
        { id: 'inputs', label: 'Inputs', group: 'Atomic' },
        { id: 'qty', label: 'Qty Selectors', group: 'Atomic' },
        { id: 'colors', label: 'Colors', group: 'Atomic' },
        { id: 'header', label: 'Page Header', group: 'Modules' },
        { id: 'navigation', label: 'Category Nav', group: 'Modules' },
        { id: 'floating', label: 'Floating States', group: 'Modules' },
        { id: 'cards', label: 'Cards & Items', group: 'Modules' },
    ];

    const groups = ['Atomic', 'Modules'];

    return (
        <div style={{
            display: 'flex',
            width: '100%',
            height: '100vh',
            fontFamily: '"Bricolage Grotesque", sans-serif',
            background: '#ffffff',
            color: '#000000',
            overflow: 'hidden'
        }}>
            {/* SIDEBAR */}
            <div style={{
                width: '280px',
                height: '100%',
                borderRight: '1px solid #E5E5E5',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                background: '#F9FAFB',
                flexShrink: 0
            }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '24px', height: '24px', background: 'black', borderRadius: '6px' }}></div>
                        Menux DS
                    </h1>
                    <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>v2.2.0 • Live Library</p>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
                    {groups.map(group => (
                        <div key={group}>
                            <p style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', color: '#999', marginBottom: '8px', letterSpacing: '0.05em' }}>{group}</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {sections.filter(s => s.group === group).map(section => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        style={{
                                            textAlign: 'left',
                                            padding: '10px 12px',
                                            borderRadius: '6px',
                                            background: activeSection === section.id ? '#E8E8E8' : 'transparent',
                                            color: activeSection === section.id ? '#000' : '#444',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '14px',
                                            fontWeight: activeSection === section.id ? '600' : '500',
                                            transition: 'all 0.2s ease'
                                        }}
                                    >
                                        {section.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div style={{ marginTop: 'auto' }}>
                    <div style={{ padding: '12px', background: '#fff', borderRadius: '8px', border: '1px solid #eee' }}>
                        <p style={{ fontSize: '12px', fontWeight: '600' }}>Active User</p>
                        <p style={{ fontSize: '11px', color: '#666' }}>Admin View</p>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div style={{ flex: 1, height: '100%', overflowY: 'auto', background: '#ffffff' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px' }}>
                    <div style={{ marginBottom: '40px', paddingBottom: '20px', borderBottom: '1px solid #F0F0F0' }}>
                        <h2 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '8px' }}>
                            {sections.find(s => s.id === activeSection)?.label}
                        </h2>
                        <p style={{ color: '#666', fontSize: '16px' }}>
                            {activeSection === 'header' ? 'The main application header used in MenuHub.' : activeSection === 'qty' ? 'Standard selectors for item quantity control.' : 'Component definitions and usage examples.'}
                        </p>
                    </div>

                    <div style={{ minHeight: '400px' }}>
                        {activeSection === 'typography' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                                <TypeSpecimen
                                    label="H1 Title Large"
                                    selector=".title-large / h1"
                                    font="24px Medium"
                                    example={<h1 className="title-large" style={{ margin: 0 }}>The quick brown fox jumps over the lazy dog</h1>}
                                />
                                <TypeSpecimen
                                    label="H2 Restaurant Name"
                                    selector=".restaurant-name / h2"
                                    font="20px SemiBold"
                                    example={<h2 className="restaurant-name" style={{ margin: 0 }}>L'Osteria di Giovanni</h2>}
                                />
                                <TypeSpecimen
                                    label="Body Medium"
                                    selector=".btn-primary"
                                    font="16px Medium"
                                    example={<p style={{ fontSize: '16px', fontWeight: 500, margin: 0 }}>Experience the finest Italian cuisine.</p>}
                                />
                            </div>
                        )}

                        {activeSection === 'buttons' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                                <ComponentCard title="Primary Button" selector=".btn-primary">
                                    <button className="btn-primary">Continuar</button>
                                </ComponentCard>
                                <ComponentCard title="Secondary Button" selector=".btn-secondary">
                                    <button className="btn-secondary">Voltar</button>
                                </ComponentCard>
                                <ComponentCard title="Outline Button" selector=".btn-outline">
                                    <button className="btn-outline">Cancelar</button>
                                </ComponentCard>
                                <ComponentCard title="My Orders Button" selector=".btn-my-orders">
                                    <button className="btn-my-orders">Pedidos</button>
                                </ComponentCard>
                                <ComponentCard title="Order Now (Small)" selector=".btn-order-now">
                                    <button className="btn-order-now">Adicionar</button>
                                </ComponentCard>
                                <ComponentCard title="Profile Short" selector=".btn-profile-short">
                                    <button className="btn-profile-short">Ver Perfil</button>
                                </ComponentCard>
                            </div>
                        )}

                        {activeSection === 'inputs' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '500px' }}>
                                <ComponentCard title="Phone Input Group" selector=".phone-input-group">
                                    <div className="phone-input-group">
                                        <div className="country-code">🇧🇷 +55</div>
                                        <input type="tel" className="phone-input" placeholder="(00) 00000-0000" />
                                    </div>
                                </ComponentCard>
                                <ComponentCard title="OTP Input" selector=".otp-input">
                                    <div className="otp-group">
                                        <input className="otp-input" value="1" readOnly />
                                        <input className="otp-input" value="2" readOnly />
                                        <input className="otp-input" value="" readOnly />
                                    </div>
                                </ComponentCard>
                            </div>
                        )}

                        {activeSection === 'qty' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                                <ComponentCard title="Order Item Qty (1)" selector=".order-item-qty-control">
                                    <div className="order-item-qty-control">
                                        <button className="qty-btn"><TrashIcon /></button>
                                        <span className="qty-val">1</span>
                                        <button className="qty-btn"><PlusIcon /></button>
                                    </div>
                                </ComponentCard>

                                <ComponentCard title="Order Item Qty (N)" selector=".qty-btn">
                                    <div className="order-item-qty-control">
                                        <button className="qty-btn"><MinusIcon /></button>
                                        <span className="qty-val">2</span>
                                        <button className="qty-btn"><PlusIcon /></button>
                                    </div>
                                </ComponentCard>

                                <ComponentCard title="Recommendation Qty" selector=".rec-qty-controls">
                                    <div className="rec-qty-controls">
                                        <button className="rec-qty-btn"><TrashIcon /></button>
                                        <span className="rec-qty-val">1</span>
                                        <button className="rec-qty-btn"><PlusIcon /></button>
                                    </div>
                                </ComponentCard>

                                <ComponentCard title="Recommendation Add" selector=".rec-add-btn">
                                    <button className="rec-add-btn">
                                        <PlusIcon />
                                    </button>
                                </ComponentCard>
                            </div>
                        )}

                        {activeSection === 'colors' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px' }}>
                                <ColorSwatch name="Black" hex="#000000" />
                                <ColorSwatch name="White" hex="#FFFFFF" hasBorder />
                                <ColorSwatch name="Gray 100" hex="#F5F5F5" />
                                <ColorSwatch name="Gray 300" hex="#D9D9D9" />
                                <ColorSwatch name="Accent Blue" hex="#0085FF" />
                            </div>
                        )}

                        {activeSection === 'header' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                <ComponentCard title="Main Hub Header" selector=".menu-header">
                                    <div style={{ width: '100%', background: '#fff', border: '1px solid #eee' }}>
                                        <header className="menu-header" style={{ position: 'relative' }}>
                                            <img src="/logo-menux.svg" alt="Menux" style={{ height: '20px' }} />
                                            <div className="header-right">
                                                <div className="profile-trigger guest">
                                                    <span style={{ fontSize: '12px' }}>?</span>
                                                </div>
                                                <button className="btn-my-orders">Pedidos</button>
                                                <button className="btn-profile-short">Entrar</button>
                                            </div>
                                        </header>
                                    </div>
                                </ComponentCard>

                                <ComponentCard title="Module Header (Modal Style)" selector=".my-orders-header">
                                    <div style={{ width: '100%', background: '#fff', border: '1px solid #eee' }}>
                                        <div className="my-orders-header" style={{ position: 'relative' }}>
                                            <button className="header-back-btn">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M15 18L9 12L15 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                            <span className="header-title-text">Título da Página</span>
                                        </div>
                                    </div>
                                </ComponentCard>
                            </div>
                        )}

                        {activeSection === 'navigation' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                <ComponentCard title="Category Tabs" selector=".category-tabs">
                                    <div style={{ width: '100%', background: '#fff', borderBottom: '1px solid #eee' }}>
                                        <div className="category-tabs">
                                            <button className="category-tab active">Entradas</button>
                                            <button className="category-tab">Pratos Principais</button>
                                            <button className="category-tab">Bebidas</button>
                                        </div>
                                    </div>
                                </ComponentCard>

                                <ComponentCard title="Filter Pills" selector=".filter-pill">
                                    <div className="filter-pills">
                                        <button className="filter-pill active">Todos</button>
                                        <button className="filter-pill">Favoritos</button>
                                        <button className="filter-pill">Quentes</button>
                                    </div>
                                </ComponentCard>
                            </div>
                        )}

                        {activeSection === 'floating' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                                <ComponentCard title="Maestro Floating Tabbar" selector=".floating-tabbar-container">
                                    <div className="floating-tabbar-container" style={{ position: 'relative', bottom: 0, left: 0, transform: 'none' }}>
                                        <div className="maestro-icon-wrapper">
                                            <img src="/icon-menux.svg" alt="Maestro" className="maestro-icon" />
                                        </div>
                                        <div className="maestro-text-group">
                                            <span className="maestro-title">Olá, eu sou o Menux!</span>
                                            <span className="maestro-subtitle">Clica aqui que eu te ajudo a escolher.</span>
                                        </div>
                                    </div>
                                </ComponentCard>

                                <ComponentCard title="Floating Cart Button" selector=".cart-floating-button">
                                    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                                        <div className="cart-floating-button" style={{ position: 'absolute', bottom: 0, right: 0 }}>
                                            <svg width="24" height="24" viewBox="0 -960 960 960" fill="black">
                                                <path d="M480-200q-142 0-248.5-47T85-375q-4-2-6-5.5t-2-7.5q0-5 3.5-8.5T89-400h782q5 0 8.5 3.5t3.5 8.5q0 4-2 7.5t-6 5.5q-40 81-146.5 128Q582-200 480-200Zm0-240q-137 0-240.5-83T121-720q-1-4-1-6.5t1.5-4.5q1.5-2 4.5-3.5t6.5-1.5h693q4 0 6.5 1.5t4.5 3.5q2 2 1.5 4.5t-1.5 6.5q-15 114-118.5 197T480-440Zm0-320q-17 0-28.5-11.5T440-800q0-17 11.5-28.5T480-840q17 0 28.5 11.5T520-800q0 17-11.5 28.5T480-760Z" />
                                            </svg>
                                            <div className="cart-badge">2</div>
                                        </div>
                                    </div>
                                </ComponentCard>
                            </div>
                        )}

                        {activeSection === 'cards' && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                                <ComponentCard title="Menu Item Row" selector=".menu-item">
                                    <div className="menu-item" style={{ border: '1px solid #eee', padding: '16px', borderRadius: '12px' }}>
                                        <div className="item-info">
                                            <h4 className="item-name">Filé Mignon ao Poivre</h4>
                                            <p className="item-desc">Lâminas de filé mignon com crosta de pimenta preta e molho cremoso.</p>
                                            <div className="item-price">R$ 84,00</div>
                                        </div>
                                        <div className="item-image" style={{ background: '#f5f5f5' }}></div>
                                    </div>
                                </ComponentCard>

                                <ComponentCard title="Featured Banner Card" selector=".featured-card">
                                    <div className="featured-card" style={{ minWidth: '100%', height: '180px', margin: 0 }}>
                                        <span className="featured-tag">Sugestão do Chef</span>
                                        <h3 className="featured-title">Prato Especial de Verão</h3>
                                        <div className="featured-footer">
                                            <span className="featured-price">R$ 49,90</span>
                                            <button className="btn-order-now">Adicionar</button>
                                        </div>
                                    </div>
                                </ComponentCard>

                                <ComponentCard title="Order Summary Card" selector=".order-card-container">
                                    <div className="order-card-container" style={{ margin: 0 }}>
                                        <div className="order-card-header">
                                            <div className="order-info-group">
                                                <span className="order-number">#5872</span>
                                                <span className="order-time">Hoje ás 12h34</span>
                                            </div>
                                            <div className="status-badge annotated">Anotado</div>
                                        </div>
                                        <div className="order-divider"></div>
                                        <div className="order-summary-list">
                                            <div className="summary-item">
                                                <div className="qty-circle">1</div>
                                                <span className="item-name-summary">Coca-Cola Zero</span>
                                            </div>
                                        </div>
                                        <div className="order-divider"></div>
                                        <button className="btn-reorder">Pedir novamente</button>
                                    </div>
                                </ComponentCard>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components for the Storybook look
function ComponentCard({ title, selector, children }) {
    return (
        <div style={{ border: '1px solid #F0F0F0', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '32px', background: '#F9FAFB', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {children}
            </div>
            <div style={{ padding: '16px', borderTop: '1px solid #F0F0F0', background: '#fff' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{title}</h4>
                <code style={{ fontSize: '12px', color: '#888', background: '#f4f4f4', padding: '2px 6px', borderRadius: '4px' }}>{selector}</code>
            </div>
        </div>
    )
}

function TypeSpecimen({ label, selector, font, example }) {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', alignItems: 'center', paddingBottom: '24px', borderBottom: '1px solid #f5f5f5' }}>
            <div>
                <p style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>{label}</p>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '2px' }}>{font}</p>
                <code style={{ fontSize: '11px', color: '#999' }}>{selector}</code>
            </div>
            <div>
                {example}
            </div>
        </div>
    )
}

function ColorSwatch({ name, hex, hasBorder }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{
                height: '80px',
                borderRadius: '12px',
                background: hex,
                border: hasBorder ? '1px solid #eee' : 'none',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}></div>
            <div>
                <p style={{ fontSize: '14px', fontWeight: '600' }}>{name}</p>
                <p style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>{hex}</p>
            </div>
        </div>
    )
}
