import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import ProductDetailModal from './ProductDetailModal';
import OrderModal from './OrderModal';
import ProcessingModal from './ProcessingModal';
import OrderCodeModal from './OrderCodeModal';
import ProfileModal from './ProfileModal';
import MaestroModal from './MaestroModal';

const imgLogo = "/logo-menux.svg";
const imgVerify = "/verify-icon.svg";

const BANNERS = [
    {
        tag: "Sabor Inigualável",
        title: "Filé Mignon ao Poivre",
        price: "R$ 84",
        bg: "#D9D9D9"
    },
    {
        tag: "Sugestão do Chef",
        title: "Picanha Grelhada",
        price: "R$ 69,90",
        bg: "#E2E2E2"
    },
    {
        tag: "Drink da Semana",
        title: "Moscow Mule",
        price: "R$ 34,00",
        bg: "#D0D0D0"
    }
];

const MENU_DATA = [
    {
        id: 'entradas',
        name: 'Entradas',
        subcategories: [
            {
                name: 'Entradas Frias', items: [
                    { id: 101, name: "Carpaccio Tradicional", desc: "Lâminas de filé mignon, molho de alcaparras, parmesão e rúcula fresca.", price: "R$ 42,90" },
                    { id: 102, name: "Tartare de Salmão", desc: "Salmão fresco, raspas de limão siciliano e torradas artesanais.", price: "R$ 46,90" },
                ]
            },
            {
                name: 'Entradas Quentes', items: [
                    { id: 103, name: "Bolinho de Bacalhau", desc: "6 unidades de bolinhos crocantes, seguindo a receita tradicional portuguesa.", price: "R$ 38,00" },
                    { id: 104, name: "Bruschetta Pomodoro", desc: "Pão italiano tostado, tomates frescos, manjericão e azeite.", price: "R$ 32,00" },
                ]
            }
        ]
    },
    {
        id: 'saladas',
        name: 'Saladas',
        subcategories: [
            {
                name: 'Leves e Frescas', items: [
                    { id: 401, name: "Salada Caesar", desc: "Alface americana, croutons artesanais, molho caesar caseiro e lascas de grana padano.", price: "R$ 38,00" },
                ]
            }
        ]
    },
    {
        id: 'pratos-principais',
        name: 'Pratos Principais',
        subcategories: [
            {
                name: 'Carnes Bovinas',
                items: [
                    { id: 201, name: "Picanha Grelhada", desc: "Picanha bovina selecionada, grelhada no ponto da casa, finalizada com manteiga de ervas. Acompanha arroz branco, farofa e vinagrete.", price: "R$ 69,90" },
                    { id: 202, name: "Contra Filé na Chapa", desc: "Contra filé bovino grelhado, preparado na chapa quente para preservar a suculência. Acompanha arroz temperado e batata frita.", price: "R$ 59,90" },
                    { id: 203, name: "Filé Mignon ao Molho Madeira", desc: "Filé mignon bovino macio, servido com molho madeira e champignons frescos. Acompanha purê de batatas e arroz branco.", price: "R$ 74,90" },
                    { id: 204, name: "Costela Bovina Assada", desc: "Costela bovina assada lentamente por várias horas até atingir textura macia. Servida com mandioca cozida e vinagrete.", price: "R$ 79,90" },
                ]
            },
            {
                name: 'Aves',
                items: [
                    { id: 205, name: "Frango Grelhado com Legumes", desc: "Peito de frango grelhado, temperado com ervas naturais, acompanhado de legumes salteados.", price: "R$ 44,90" },
                    { id: 206, name: "Frango à Parmegiana", desc: "Filé de frango empanado, coberto com molho de tomate artesanal e queijo derretido. Acompanha arroz branco e batata frita.", price: "R$ 49,90" },
                ]
            },
            {
                name: 'Peixes',
                items: [
                    { id: 207, name: "Salmão Grelhado", desc: "Filé de salmão grelhado, finalizado com ervas frescas. Acompanha arroz com amêndoas e legumes no vapor.", price: "R$ 79,90" },
                    { id: 208, name: "Tilápia Empanada", desc: "Filé de tilápia empanado e crocante, servido com arroz, feijão e salada da casa.", price: "R$ 46,90" },
                ]
            },
            {
                name: 'Massas',
                items: [
                    { id: 209, name: "Spaghetti à Bolonhesa", desc: "Massa spaghetti ao molho bolonhesa tradicional, preparada com carne bovina e tomate. Finalizada com queijo parmesão.", price: "R$ 39,90" },
                    { id: 210, name: "Fettuccine Alfredo com Frango", desc: "Massa fettuccine ao molho cremoso à base de queijo, acompanhada de cubos de frango grelhado.", price: "R$ 45,90" },
                ]
            }
        ]
    },
    {
        id: 'bebidas',
        name: 'Bebidas',
        subcategories: [
            { name: 'Sucos Naturais', items: [] },
            { name: 'Drinks Autorais', items: [] }
        ]
    },
    {
        id: 'sobremesas',
        name: 'Sobremesas',
        subcategories: [
            { name: 'Clássicas', items: [] },
            { name: 'Doces Finos', items: [] }
        ]
    }
];

export default function MenuHub() {
    const scrollAreaRef = useRef(null);
    const tabsRef = useRef(null);
    const pillsRef = useRef(null);
    const reelRef = useRef(null);
    const isProgrammaticScroll = useRef(false);
    const [activeCategory, setActiveCategory] = useState('entradas');
    const [activeSubcategory, setActiveSubcategory] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOrderCode, setShowOrderCode] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userAvatar, setUserAvatar] = useState(null);
    const [isMaestroOpen, setIsMaestroOpen] = useState(false);

    const handleFinishOrder = () => {
        setIsOrderModalOpen(false);
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setShowOrderCode(true);
        }, 5000);
    };

    const handleResetOrder = () => {
        setShowOrderCode(false);
        setCartCount(0);
    };

    // Carousel Automático (Rolagem)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = (prev + 1) % BANNERS.length;
                if (reelRef.current) {
                    reelRef.current.scrollTo({
                        left: next * 329,
                        behavior: 'smooth'
                    });
                }
                return next;
            });
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const centerNavButton = (containerRef, buttonElement) => {
        if (!containerRef.current || !buttonElement) return;
        const container = containerRef.current;
        if (!container) return;
        const scrollLeft = buttonElement.offsetLeft - (container.offsetWidth / 2) + (buttonElement.offsetWidth / 2);
        container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    };

    const scrollToSection = (id, type, value, event) => {
        isProgrammaticScroll.current = true;

        if (type === 'category') {
            setActiveCategory(value);
            setActiveSubcategory('');
            const tabButton = tabsRef.current?.querySelector(`[data-id="${value}"]`);
            if (tabButton) centerNavButton(tabsRef, tabButton);
        } else {
            setActiveSubcategory(value);
            if (event) centerNavButton(pillsRef, event.currentTarget);
        }

        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setTimeout(() => {
            isProgrammaticScroll.current = false;
        }, 800);
    };

    useEffect(() => {
        const scrollContainer = scrollAreaRef.current;
        if (!scrollContainer) return;

        let ticking = false;

        const handleScroll = () => {
            if (isProgrammaticScroll.current || ticking) return;

            ticking = true;
            requestAnimationFrame(() => {
                const scrollPos = scrollContainer.scrollTop + 200;

                for (const cat of MENU_DATA) {
                    const element = document.getElementById(cat.id);
                    if (element && scrollPos >= element.offsetTop && scrollPos < element.offsetTop + element.offsetHeight) {
                        if (activeCategory !== cat.id) {
                            setActiveCategory(cat.id);
                            setActiveSubcategory('');
                            const tabButton = tabsRef.current?.querySelector(`[data-id="${cat.id}"]`);
                            if (tabButton) centerNavButton(tabsRef, tabButton);
                        }
                        break;
                    }
                }
                ticking = false;
            });
        };

        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, [activeCategory]);

    return (
        <div className="menu-hub-container">
            <header className="menu-header">
                <img src={imgLogo} alt="Menux" style={{ height: '20px' }} />
                <div className="header-right">
                    <div className="profile-trigger">
                        {userAvatar && (
                            <img
                                src={userAvatar}
                                alt="Profile"
                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        )}
                    </div>
                    <button className="btn-profile-short" onClick={() => setIsProfileOpen(true)}>Meu perfil</button>
                </div>
            </header>

            <div className="menu-scroll-area" ref={scrollAreaRef}>
                <div className="restaurant-banner"></div>

                <div className="restaurant-info">
                    <div className="restaurant-avatar"></div>
                    <div className="restaurant-name-row">
                        <h2 className="restaurant-name">Menux Restaurante</h2>
                        <img src={imgVerify} alt="Verified" className="verified-icon" />
                    </div>
                    <p className="restaurant-bio">Especialistas em grelhados e gastronomia afetiva. Um pé no mar, outro no bar.</p>
                </div>

                <section className="featured-section">
                    <div className="featured-reel" ref={reelRef}>
                        {BANNERS.map((b, i) => (
                            <div key={i} className="featured-card" style={{ background: b.bg }} onClick={() => setSelectedProduct({ id: i, name: b.title, desc: "Descrição do prato em destaque...", price: b.price })}>
                                <span className="featured-tag">{b.tag}</span>
                                <h3 className="featured-title">{b.title}</h3>
                                <div className="featured-footer">
                                    <span className="featured-price">{b.price}</span>
                                    <button className="btn-order-now">Adicionar ao pedido</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <nav className="category-nav">
                    <div className="category-tabs" ref={tabsRef}>
                        {MENU_DATA.map(cat => (
                            <button
                                key={cat.id}
                                data-id={cat.id}
                                className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={(e) => scrollToSection(cat.id, 'category', cat.id, e)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className="filter-pills" ref={pillsRef}>
                        <button
                            className={`filter-pill ${activeSubcategory === '' ? 'active' : ''}`}
                            onClick={(e) => {
                                document.getElementById(activeCategory)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                setActiveSubcategory('');
                                centerNavButton(pillsRef, e.currentTarget);
                            }}
                        >
                            Todos
                        </button>
                        {MENU_DATA.find(c => c.id === activeCategory)?.subcategories.map(sub => (
                            <button
                                key={sub.name}
                                data-sub={sub.name}
                                className={`filter-pill ${activeSubcategory === sub.name ? 'active' : ''}`}
                                onClick={(e) => scrollToSection(`sub-${sub.name.replace(/\s+/g, '-').toLowerCase()}`, 'sub', sub.name, e)}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </nav>

                {MENU_DATA.map(category => (
                    <div key={category.id} id={category.id}>
                        <div className="menu-list">
                            <h3 className="section-label">{category.name}</h3>
                            {category.subcategories.map(subcategory => (
                                <div key={subcategory.name} id={`sub-${subcategory.name.replace(/\s+/g, '-').toLowerCase()}`}>
                                    <p className="subcategory-label">{subcategory.subcategory_label || subcategory.name}</p>
                                    {subcategory.items.length > 0 ? subcategory.items.map(item => (
                                        <div key={item.id} className="menu-item" onClick={() => setSelectedProduct(item)}>
                                            <div className="item-info">
                                                <h4 className="item-name">{item.name}</h4>
                                                <p className="item-desc">{item.desc}</p>
                                                <div className="item-price">{item.price}</div>
                                            </div>
                                            <div className="item-image"></div>
                                        </div>
                                    )) : (
                                        <div style={{ padding: '20px 0', opacity: 0.3 }}>Nenhum item disponível no momento.</div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="menu-divider-large"></div>
                    </div>
                ))}

                <footer style={{ padding: '40px 0 60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: '#A3A3A3' }}>Este menu foi desenvolvido pela</span>
                    <img src={imgLogo} alt="Menux" style={{ height: '18px', marginTop: '2px', filter: 'brightness(0)' }} />
                </footer>
            </div>

            {/* Floating Maestro Tabbar */}
            {!selectedProduct && (
                <>
                    <div
                        className={`floating-tabbar-container ${cartCount > 0 ? 'has-cart' : ''}`}
                        onClick={() => setIsMaestroOpen(true)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="maestro-icon-wrapper">
                            <img src="/icon-menux.svg" alt="Maestro" className="maestro-icon" />
                        </div>
                        <div className="maestro-text-group">
                            <span className="maestro-title">Oi, eu posso te ajudar!</span>
                            <span className="maestro-subtitle">Te ajudo a escolher o prato...</span>
                        </div>
                    </div>

                    {cartCount > 0 && (
                        <div className="cart-floating-button" onClick={() => setIsOrderModalOpen(true)}>
                            <img src="/room-service.svg" alt="Cart" className="cart-icon" />
                            <div className="cart-badge">{cartCount}</div>
                        </div>
                    )}
                </>
            )}

            <AnimatePresence>
                {selectedProduct && (
                    <ProductDetailModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        onAddToCart={(item, obs) => {
                            setCartCount(prev => prev + 1);
                            setSelectedProduct(null);
                        }}
                    />
                )}
                {isOrderModalOpen && (
                    <OrderModal
                        cartItems={[]}
                        onClose={() => setIsOrderModalOpen(false)}
                        onFinish={handleFinishOrder}
                    />
                )}
                {isProcessing && <ProcessingModal />}
                {showOrderCode && <OrderCodeModal onReset={handleResetOrder} />}
                {isProfileOpen && (
                    <ProfileModal
                        onClose={() => setIsProfileOpen(false)}
                        currentAvatar={userAvatar}
                        onUpdateAvatar={setUserAvatar}
                    />
                )}
                {isMaestroOpen && (
                    <MaestroModal onClose={() => setIsMaestroOpen(false)} />
                )}
            </AnimatePresence>
        </div>
    );
}
