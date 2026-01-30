import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useMemo } from 'react';
import ProductDetailModal from './ProductDetailModal';
import ProductPizzaModal from './ProductPizzaModal';
import ProductWineModal from './ProductWineModal';
import OrderModal from './OrderModal';
import ProcessingModal from './ProcessingModal';
import OrderCodeModal from './OrderCodeModal';
import ProfileModal from './ProfileModal';
import MaestroModal from './MaestroModal';
import MyOrdersModal from './MyOrdersModal';
import MenuHeader from './hub/MenuHeader';
import CategoryNav from './hub/CategoryNav';
import ProductGrid from './hub/ProductGrid';
import { useStudio } from '../context/StudioContext';
import { useToast } from '../context/ToastContext';

const imgLogo = "/logo-menux.svg";
const imgVerify = "/verify-icon.svg";

const BANNERS = [
    {
        tag: "Sugestão do Chef",
        title: "Filé Mignon ao Poivre",
        price: "R$ 84",
        bg: "#D9D9D9",
        image: "/imgs/pratos-principais/pratop-file-mignon.jpg"
    },
    {
        tag: "Sabor Inigualável",
        title: "Picanha Grelhada",
        price: "R$ 69,90",
        bg: "#E2E2E2",
        image: "/imgs/pratos-principais/pratop-picanha.jpg"
    },
    {
        tag: "Drink da Semana",
        title: "Moscow Mule",
        price: "R$ 34,00",
        bg: "#D0D0D0",
        image: "/imgs/bebidas-e-drinks/drinks-moscow-mule.jpg"
    }
];

const MENU_DATA = [
    {
        id: 'entradas',
        name: 'Entradas',
        subcategories: [
            {
                name: 'Favoritos', items: [
                    { id: 101, name: "Carpaccio de Carne", desc: "Lâminas de filé mignon, molho de alcaparras, parmesão e rúcula fresca.", price: "R$ 44,90", image: "/imgs/entrada/entrada-carpacio-de-carne.jpg" },
                    { id: 102, name: "Ceviche Clássico", desc: "Peixe branco marinado no limão, cebola roxa e pimenta dedo de moça.", price: "R$ 42,90", image: "/imgs/entrada/entrada-ceviche.jpg" },
                    { id: 105, name: "Burrata Artesanal", desc: "Burrata cremosa, tomates cereja confitados e pesto de manjericão.", price: "R$ 58,00", image: "/imgs/entrada/entrada-burrata.jpg" },
                ]
            },
            {
                name: 'Quentes', items: [
                    { id: 103, name: "Bolinho de Costela", desc: "6 unidades de bolinhos crocantes de costela desfiada com cream cheese.", price: "R$ 38,00", image: "/imgs/entrada/entrada-bolinho-costela.jpg" },
                    { id: 104, name: "Camarão Crocante", desc: "Camarões empanados na farinha panko com molho agridoce.", price: "R$ 62,00", image: "/imgs/entrada/entrada-camarão.jpg" },
                    { id: 106, name: "Dadinho de Tapioca", desc: "Dadinhos de tapioca com queijo coalho servidos com geleia de pimenta.", price: "R$ 32,00", image: "/imgs/entrada/entrada-dadinho.jpg" },
                    { id: 107, name: "Tábua de Frios", desc: "Seleção de queijos e embutidos artesanais, acompanhados de pães e antepastos.", price: "R$ 89,00", image: "/imgs/entrada/entrada-tabua.jpg" },
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
                    { id: 401, name: "Salada Caesar", desc: "Alface americana, croutons artesanais, molho caesar caseiro e lascas de grana padano.", price: "R$ 38,00", image: "/imgs/lanche/acomp-salada-verde.jpg" },
                    { id: 402, name: "Salada Verde", desc: "Mix de folhas verdes frescas, tomate cereja e molho especial da casa.", price: "R$ 28,00", image: "/imgs/lanche/acomp-salada-verde.jpg" },
                ]
            }
        ]
    },
    {
        id: 'pizzas',
        name: 'Pizzas',
        subcategories: [
            {
                name: 'Monte do seu jeito', items: [
                    {
                        id: 'pizza-custom',
                        name: "Pizza Customizável",
                        desc: "Escolha sua massa, sabores, bordas e acompanhamentos.",
                        price: "R$ 49,90",
                        image: "/imgs/pratos-principais/pratop-picanha.jpg", // Using a placeholder image that exists
                        type: 'pizza'
                    },
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
                    { id: 201, name: "Picanha Grelhada", desc: "Picanha bovina selecionada, grelhada no ponto da casa, finalizada com manteiga de ervas. Acompanha arroz branco, farofa e vinagrete.", price: "R$ 69,90", image: "/imgs/pratos-principais/pratop-picanha.jpg" },
                    { id: 202, name: "Contra Filé na Chapa", desc: "Contra filé bovino grelhado, preparado na chapa quente para preservar a suculência. Acompanha arroz temperado e batata frita.", price: "R$ 59,90", image: "/imgs/pratos-principais/pratop-contrafile.jpg" },
                    { id: 203, name: "Filé Mignon ao Molho Madeira", desc: "Filé mignon bovino macio, servido com molho madeira e champignons frescos. Acompanha purê de batatas e arroz branco.", price: "R$ 74,90", image: "/imgs/pratos-principais/pratop-file-mignon.jpg" },
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
                    { id: 207, name: "Salmão Grelhado", desc: "Filé de salmão grelhado, finalizado com ervas frescas. Acompanha arroz com amêndoas e legumes no vapor.", price: "R$ 79,90", image: "/imgs/pratos-principais/pratop-salmao.jpg" },
                    { id: 208, name: "Tilápia Empanada", desc: "Filé de tilápia empanado e crocante, servido com arroz, feijão e salada da casa.", price: "R$ 46,90", image: "/imgs/pratos-principais/pratop-tilapia.jpg" },
                    { id: 211, name: "Atum Selado", desc: "Lombo de atum selado com crosta de gergelim, servido mal passado com molho teriyaki.", price: "R$ 82,90", image: "/imgs/pratos-principais/pratop-atum.jpg" }
                ]
            },
            {
                name: 'Massas',
                items: [
                    { id: 209, name: "Spaghetti à Bolonhesa", desc: "Massa spaghetti ao molho bolonhesa tradicional, preparada com carne bovina e tomate. Finalizada com queijo parmesão.", price: "R$ 39,90", image: "/imgs/pratos-principais/pratop-spaghetti.jpg" },
                    { id: 210, name: "Fettuccine Alfredo com Frango", desc: "Massa fettuccine ao molho cremoso à base de queijo, acompanhada de cubos de frango grelhado.", price: "R$ 45,90", image: "/imgs/pratos-principais/pratop-penne.jpg" },
                    { id: 212, name: "Gnochi ao Sugo", desc: "Massa fresca de batata com molho de tomate artesanal e manjericão fresco.", price: "R$ 42,00", image: "/imgs/pratos-principais/pratop-gnocchi.jpg" }
                ]
            }
        ]
    },
    {
        id: 'bebidas',
        name: 'Bebidas',
        subcategories: [
            {
                name: 'Sucos Naturais', items: [
                    { id: 301, name: "Suco Natural da Estação", desc: "Sucos preparados na hora com frutas frescas selecionadas.", price: "R$ 12,00", image: "/imgs/bebidas-e-drinks/drink-suco-natural.jpg" },
                    { id: 302, name: "Água com Gás", desc: "Água mineral com gás, servida gelada com ou sem rodela de limão.", price: "R$ 6,00", image: "/imgs/bebidas-e-drinks/drinks-agua-gas.jpg" }
                ]
            },
            {
                name: 'Drinks Autorais', items: [
                    { id: 303, name: "Caipirinha Clássica", desc: "A autêntica caipirinha brasileira com limão tahiti, cachaça artesanal e açúcar.", price: "R$ 24,00", image: "/imgs/bebidas-e-drinks/drink-caipirinha.jpg" },
                    { id: 304, name: "Moscow Mule", desc: "Vodka, xarope de gengibre, limão e espuma cítrica de gengibre.", price: "R$ 34,00", image: "/imgs/bebidas-e-drinks/drinks-moscow-mule.jpg" },
                    { id: 305, name: "Gin Tônica", desc: "Gin importado, água tônica premium, rodela de limão siciliano e alecrim.", price: "R$ 32,00", image: "/imgs/bebidas-e-drinks/drinks-gin-tonica.jpg" },
                    { id: 306, name: "Negroni", desc: "O clássico italiano com Gin, Vermouth Rosso e Campari em partes iguais.", price: "R$ 36,00", image: "/imgs/bebidas-e-drinks/drinks-negroni.jpg" }
                ]
            }
        ]
    },
    {
        id: 'sobremesas',
        name: 'Sobremesas',
        subcategories: [
            {
                name: 'Clássicas', items: [
                    { id: 501, name: "Pudim de Leite", desc: "Pudim de leite condensado tradicional, liso e cremoso, com calda de caramelo.", price: "R$ 18,00", image: "/imgs/sobremesas/sobremesa-pudim.jpg" },
                    { id: 502, name: "Torta de Limão", desc: "Massa crocante, recheio cremoso de limão e cobertura de merengue maçaricado.", price: "R$ 22,00", image: "/imgs/sobremesas/sobremesa-torta-limao.jpg" },
                    { id: 503, name: "Churros com Doce de Leite", desc: "Porção de mini churros crocantes passados no açúcar e canela, servidos com doce de leite.", price: "R$ 24,00", image: "/imgs/sobremesas/sobremesa-churros.jpg" }
                ]
            },
            {
                name: 'Doces Finos', items: [
                    { id: 504, name: "Petit Gateau", desc: "Bolo quente de chocolate com interior cremoso, servido com bola de sorvete de baunilha.", price: "R$ 28,00", image: "/imgs/sobremesas/sobremesa-petit-gateau.jpg" },
                    { id: 505, name: "Brownie com Sorvete", desc: "Brownie de chocolate meio amargo com nozes, servido quente com sorvete de creme.", price: "R$ 26,00", image: "/imgs/sobremesas/sobremesa-brownie-sorvete.jpg" },
                    { id: 506, name: "Mousse de Chocolate", desc: "Mousse aerada de chocolate belga 70% cacau, finalizada com raspas de chocolate.", price: "R$ 20,00", image: "/imgs/sobremesas/sobremesa-mosse-chocolate.jpg" }
                ]
            }
        ]
    },
    {
        id: 'vinhos',
        name: 'Vinhos',
        subcategories: [
            {
                name: 'Seleção Especial', items: [
                    {
                        id: 999,
                        name: "Don Simon Selección Tempranillo",
                        desc: "Vinho tinto seco de corpo equilibrado e notas de frutas vermelhas.",
                        price: "R$ 28,00",
                        image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1000&auto=format&fit=crop",
                        type: 'wine',
                        country: 'Brasileiro',
                        countryFlag: 'https://flagcdn.com/w20/br.png',
                        year: '1982',
                        facts: {
                            vinicola: 'Marchesi Antinori',
                            uvas: 'Cabernet',
                            regiao: 'Toscana',
                            estilo: 'Tinto Encorpado'
                        }
                    },
                    {
                        id: 1000,
                        name: "Casillero del Diablo Reserva",
                        desc: "Cabernet Sauvignon chileno com aromas de cerejas pretas e toques de baunilha.",
                        price: "R$ 89,00",
                        image: "https://images.unsplash.com/photo-1553361371-9bb22026829b?q=80&w=1000&auto=format&fit=crop",
                        type: 'wine',
                        country: 'Chileno',
                        countryFlag: 'https://flagcdn.com/w20/cl.png',
                        year: '2021',
                        facts: {
                            vinicola: 'Concha y Toro',
                            uvas: 'Cabernet Sauvignon',
                            regiao: 'Vale Central',
                            estilo: 'Tinto Médio Corpo'
                        }
                    }
                ]
            }
        ]
    }
];

export default function MenuHub({ onOpenStudio, userName, phone, onAuth, onLogout, userAvatar, onUpdateAvatar, onUpdateProfile }) {
    const scrollAreaRef = useRef(null);
    const tabsRef = useRef(null);
    const pillsRef = useRef(null);
    const categoryRefs = useRef({});
    const subcategoryRefs = useRef({});
    const sectionRefs = useRef({});
    const reelRef = useRef(null);
    const isProgrammaticScroll = useRef(false);

    // States
    const [activeCategory, setActiveCategory] = useState('entradas');
    const [activeSubcategory, setActiveSubcategory] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOrderCode, setShowOrderCode] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMaestroOpen, setIsMaestroOpen] = useState(false);
    const [maestroInitialView, setMaestroInitialView] = useState('welcome');
    const [activeOrderCode, setActiveOrderCode] = useState(null);
    const [activeOrderItems, setActiveOrderItems] = useState([]);
    const [orderHistory, setOrderHistory] = useState([]);
    const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

    const { showToast } = useToast();
    const { branding, categories: dynamicCategories, products: dynamicProducts } = useStudio();

    // --- Persistência (Cart/Orders) ---
    useEffect(() => {
        const savedCart = localStorage.getItem('menux_cart');
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedCode = localStorage.getItem('menux_active_order');
        if (savedCode) setActiveOrderCode(savedCode);

        const savedItems = localStorage.getItem('menux_active_items');
        if (savedItems) setActiveOrderItems(JSON.parse(savedItems));

        const savedHistory = localStorage.getItem('menux_order_history');
        if (savedHistory) setOrderHistory(JSON.parse(savedHistory));
    }, []);

    useEffect(() => {
        localStorage.setItem('menux_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('menux_active_items', JSON.stringify(activeOrderItems));
    }, [activeOrderItems]);

    useEffect(() => {
        if (activeOrderCode) localStorage.setItem('menux_active_order', activeOrderCode);
    }, [activeOrderCode]);

    useEffect(() => {
        localStorage.setItem('menux_order_history', JSON.stringify(orderHistory));
    }, [orderHistory]);

    // --- Data Merging (Static + Dynamic) ---
    const currentCategories = useMemo(() => {
        if (dynamicCategories.length === 0) return MENU_DATA;

        return dynamicCategories.map(cat => {
            const catProducts = dynamicProducts.filter(p => p.categoryId === cat.id);
            let subcategories = [];

            if (cat.subcategories && cat.subcategories.length > 0) {
                subcategories = cat.subcategories.map(sub => ({
                    ...sub,
                    items: catProducts.filter(p => p.subcategoryId === sub.id)
                }));

                const orphaned = catProducts.filter(p => !p.subcategoryId || !cat.subcategories.find(s => s.id === p.subcategoryId));
                if (orphaned.length > 0) {
                    subcategories.push({ id: 'outros', name: 'Outros', items: orphaned });
                }
            } else {
                subcategories = [{ id: 'geral', name: 'Geral', items: catProducts }];
            }

            return { ...cat, subcategories };
        });
    }, [dynamicCategories, dynamicProducts]);

    // --- Handlers ---
    const handleLongPressStart = () => {
        // Logic for long press on logo kept in parent or moved to Header callback, 
        // but here it is attached to the restaurant info.
        setTimeout(() => {
            // simplified for brevity
        }, 800);
    };

    // (Keeping the ref-based logic simple for the timer)
    const pressTimer = useRef(null);
    const onLongPressStart = () => {
        pressTimer.current = setTimeout(() => {
            const pin = window.prompt("Digite o PIN de acesso (1234):");
            if (pin === "1234") onOpenStudio();
            else if (pin !== null) alert("PIN Incorreto");
        }, 800);
    };
    const onLongPressEnd = () => clearTimeout(pressTimer.current);

    const handleOpenMaestroChat = () => {
        setIsOrderModalOpen(false);
        setMaestroInitialView('chat');
        setIsMaestroOpen(true);
    };

    const handleAddToCart = (product, obs, qty = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id && item.obs === obs);
            if (existing) {
                return prev.map(item =>
                    (item.id === product.id && item.obs === obs)
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            }
            return [...prev, { ...product, qty, obs }];
        });
        showToast("Item adicionado ao pedido!");
        setSelectedProduct(null);
    };

    // For + / - controls in ProductGrid
    const handleAddSingle = (item) => handleAddToCart(item);
    const handleRemoveSingle = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (!existing) return prev;
            if (existing.qty > 1) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty - 1 } : i);
            }
            return prev.filter(i => i.id !== item.id);
        });
    };

    const handleUpdateQty = (itemId, obs, delta) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.id === itemId && item.obs === obs) {
                    const newQty = Math.max(0, item.qty + delta);
                    return { ...item, qty: newQty };
                }
                return item;
            }).filter(item => item.qty > 0);
        });
    };

    const handleFinishOrder = () => {
        const orderId = "#" + Math.floor(1000 + Math.random() * 9000);
        const currentItems = [...cart];
        const newOrder = {
            id: orderId,
            time: `Pedido hoje às ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
            status: "waiting",
            statusLabel: "Aguardando Garçom",
            items: currentItems,
            timestamp: Date.now()
        };
        setActiveOrderCode(orderId);
        setActiveOrderItems(currentItems);
        setOrderHistory(prev => [newOrder, ...prev]);
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setShowOrderCode(true);
            setIsOrderModalOpen(false);
        }, 6000);
    };

    const handleViewOrders = () => {
        setShowOrderCode(false);
        setIsMyOrdersOpen(true);
        setCart([]);
    };

    const handleReorder = (items) => {
        setCart(prev => [...prev, ...items]);
        setIsMyOrdersOpen(false);
        showToast("Itens adicionados ao pedido!");
    };

    // --- Scrolling Logic ---
    const centerNavButton = (containerRef, buttonElement) => {
        if (!containerRef.current || !buttonElement) return;
        const container = containerRef.current;
        const scrollLeft = buttonElement.offsetLeft - (container.offsetWidth / 2) + (buttonElement.offsetWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    };

    const scrollToSection = (id, type, value) => {
        isProgrammaticScroll.current = true;
        if (type === 'category') {
            setActiveCategory(value);
            setActiveSubcategory('');
            const el = categoryRefs.current[value];
            if (el) centerNavButton({ current: el.parentElement.parentElement }, el); // approx
        } else {
            setActiveSubcategory(value);
            // logic for centering pill would ideally use ref
        }

        // This relies on the IDs set in ProductGrid: `cat-{id}` and `sub-{catId}-{subId}`
        // For subcategories, we need to match the normalization logic in ProductGrid.jsx line 39
        let targetId;
        if (type === 'category') {
            targetId = `cat-${id}`;
        } else {
            // ProductGrid uses: sub.id || sub.name.replace(/\s+/g, '-').toLowerCase()
            // If id is a number or doesn't have spaces, use it directly
            // Otherwise normalize it like ProductGrid does
            const normalizedId = (typeof id === 'number' || !id?.includes(' '))
                ? id
                : id.replace(/\s+/g, '-').toLowerCase();
            targetId = `sub-${activeCategory}-${normalizedId}`;
        }

        const element = document.getElementById(targetId); // Fallback to DOM lookup if ref not handy or complex

        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => { isProgrammaticScroll.current = false; }, 800);
    };

    // Auto-scroll Banners
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = (prev + 1) % BANNERS.length;
                if (reelRef.current) {
                    reelRef.current.scrollTo({ left: next * 329, behavior: 'smooth' });
                }
                return next;
            });
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    // Scroll Observer
    useEffect(() => {
        const observerOptions = {
            root: scrollAreaRef.current,
            rootMargin: '-10% 0px -80% 0px',
            threshold: 0
        };
        const observer = new IntersectionObserver((entries) => {
            if (isProgrammaticScroll.current) return;
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // ID format: cat-{id}
                    if (entry.target.id.startsWith('cat-')) {
                        const catId = entry.target.id.replace('cat-', '');
                        setActiveCategory(catId);
                        // Update nav scroll
                    }
                }
            });
        }, observerOptions);

        // Observe category sections
        currentCategories.forEach(cat => {
            const el = document.getElementById(`cat-${cat.id}`);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [currentCategories]);

    return (
        <div className="menu-hub-container">
            <MenuHeader
                userName={userName}
                userAvatar={userAvatar}
                activeOrderCode={activeOrderCode}
                onProfileClick={() => setIsProfileOpen(true)}
                onMyOrdersClick={() => setIsMyOrdersOpen(true)}
                onAuth={onAuth}
            />

            <div className="menu-scroll-area" ref={scrollAreaRef}>
                <div
                    className="restaurant-banner"
                    style={{ backgroundImage: branding.restCover ? `url(${branding.restCover})` : 'none' }}
                ></div>

                <div className="restaurant-info">
                    <div
                        className="restaurant-avatar"
                        style={{ backgroundImage: branding.restLogo ? `url(${branding.restLogo})` : 'none' }}
                        onMouseDown={onLongPressStart}
                        onMouseUp={onLongPressEnd}
                        onTouchStart={onLongPressStart}
                        onTouchEnd={onLongPressEnd}
                    ></div>
                    <div className="restaurant-name-row">
                        <h2 className="restaurant-name">{branding.restName}</h2>
                        <img src={imgVerify} alt="Verificado" className="verified-icon" />
                    </div>
                    <p className="restaurant-bio">{branding.restBio}</p>
                </div>

                <section className="featured-section">
                    <div className="featured-reel" ref={reelRef}>
                        {BANNERS.map((b, i) => (
                            <div
                                key={i}
                                className="featured-card"
                                style={{
                                    background: b.image
                                        ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url('${b.image}') center/cover no-repeat`
                                        : b.bg
                                }}
                                onClick={() => setSelectedProduct({
                                    id: `banner-${i}`,
                                    name: b.title,
                                    desc: "Prato em destaque.",
                                    price: b.price,
                                    image: b.image
                                })}
                            >
                                <span className="featured-tag" style={{ color: b.image ? 'rgba(255,255,255,0.9)' : undefined }}>{b.tag}</span>
                                <h3 className="featured-title" style={{ color: b.image ? 'white' : undefined }}>{b.title}</h3>
                                <div className="featured-footer">
                                    <span className="featured-price" style={{ color: b.image ? 'white' : undefined }}>{b.price}</span>
                                    <button className="btn-order-now">Adicionar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <CategoryNav
                    categories={currentCategories}
                    activeCategory={activeCategory}
                    activeSubcategory={activeSubcategory}
                    onCategoryChange={(id) => scrollToSection(id, 'category', id)}
                    onSubcategoryChange={(id) => scrollToSection(id, 'sub', id)}
                    categoryRefs={categoryRefs}
                    subcategoryRefs={subcategoryRefs}
                />

                <ProductGrid
                    categories={currentCategories}
                    cart={cart}
                    onAddToCart={(item) => setSelectedProduct(item)} // Clicking logic preserved: opens modal
                    onRemoveFromCart={handleRemoveSingle}
                    sectionRefs={sectionRefs}
                />

                <footer style={{ padding: '40px 0 60px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <span style={{ fontFamily: 'Geist, sans-serif', fontSize: '13px', color: '#A3A3A3' }}>Desenvolvido por</span>
                    <img src={imgLogo} alt="Menux" style={{ height: '18px', marginTop: '2px', filter: 'brightness(0)' }} />
                </footer>
            </div>

            {/* Floating Maestro Tabbar */}
            {!selectedProduct && (
                <>
                    <div
                        className={`floating-tabbar-container ${cartCount > 0 ? 'has-cart' : ''}`}
                        onClick={() => {
                            setMaestroInitialView('welcome');
                            setIsMaestroOpen(true);
                        }}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="maestro-icon-wrapper">
                            <img src="/icon-menux.svg" alt="Maestro" className="maestro-icon" />
                        </div>
                        <div className="maestro-text-group">
                            <span className="maestro-title">Olá, eu sou o Menux!</span>
                            <span className="maestro-subtitle">Clica aqui que eu te ajudo...</span>
                        </div>
                    </div>

                    {cartCount > 0 && (
                        <div className="cart-floating-button" onClick={() => setIsOrderModalOpen(true)}>
                            <img src="/icon-pedido.svg" alt="Pedido" style={{ width: '24px', height: '24px' }} />
                            <div className="cart-badge">{cartCount}</div>
                        </div>
                    )}
                </>
            )}

            <AnimatePresence>
                {selectedProduct && (
                    selectedProduct.type === 'pizza' ? (
                        <ProductPizzaModal
                            product={selectedProduct}
                            onClose={() => setSelectedProduct(null)}
                            onAddToCart={handleAddToCart}
                        />
                    ) : selectedProduct.type === 'wine' ? (
                        <ProductWineModal
                            product={selectedProduct}
                            onClose={() => setSelectedProduct(null)}
                            onAddToCart={handleAddToCart}
                        />
                    ) : (
                        <ProductDetailModal
                            product={selectedProduct}
                            onClose={() => setSelectedProduct(null)}
                            onAddToCart={handleAddToCart}
                        />
                    )
                )}
                {isOrderModalOpen && (
                    <OrderModal
                        cartItems={cart}
                        onUpdateQty={handleUpdateQty}
                        onAddToCart={handleAddToCart}
                        onOpenChat={handleOpenMaestroChat}
                        onClose={() => setIsOrderModalOpen(false)}
                        onFinish={handleFinishOrder}
                    />
                )}
                {isProcessing && <ProcessingModal />}
                {showOrderCode && <OrderCodeModal code={activeOrderCode} onViewOrders={handleViewOrders} />}
                {isProfileOpen && (
                    <ProfileModal
                        onClose={() => setIsProfileOpen(false)}
                        currentAvatar={userAvatar}
                        onUpdateAvatar={onUpdateAvatar}
                        userName={userName}
                        phone={phone}
                        onLogout={onLogout}
                        onSaveProfile={onUpdateProfile}
                    />
                )}
                {isMyOrdersOpen && (
                    <MyOrdersModal
                        onClose={() => setIsMyOrdersOpen(false)}
                        userName={userName}
                        activeOrderCode={activeOrderCode}
                        activeOrderItems={activeOrderItems}
                        orderHistory={orderHistory}
                        onReorder={handleReorder}
                    />
                )}
                {isMaestroOpen && (
                    <MaestroModal
                        onClose={() => setIsMaestroOpen(false)}
                        initialView={maestroInitialView}
                        products={currentCategories.flatMap(cat => cat.subcategories.flatMap(sub => sub.items))}
                        staticMenuData={MENU_DATA}
                        cart={cart}
                        onAddToCart={handleAddToCart}
                        onRemoveFromCart={(product) => {
                            setCart(prev => prev.filter(item => item.id !== product.id));
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
