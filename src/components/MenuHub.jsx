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
import { BANNERS } from '../data/banners';
import { MENU_DATA } from '../data/menu';
import useCart from '../hooks/useCart';
import useScrollSpy from '../hooks/useScrollSpy';
import useAdminPin from '../hooks/useAdminPin';
import { useUser } from '../context/UserContext';


const imgLogo = "/logo-menux.svg";
const imgVerify = "/verify-icon.svg";

export default function MenuHub({ onOpenStudio, onAuth, onLogout, onDeleteAccount }) {
    const { userName, phone, userAvatar, updateAvatar, updateProfile, registeredAt } = useUser();
    const RoomServiceIcon = () => (
        <svg width="24" height="24" viewBox="0 -960 960 960" fill="black">
            <path d="M480-200q-142 0-248.5-47T85-375q-4-2-6-5.5t-2-7.5q0-5 3.5-8.5T89-400h782q5 0 8.5 3.5t3.5 8.5q0 4-2 7.5t-6 5.5q-40 81-146.5 128Q582-200 480-200Zm0-240q-137 0-240.5-83T121-720q-1-4-1-6.5t1.5-4.5q1.5-2 4.5-3.5t6.5-1.5h693q4 0 6.5 1.5t4.5 3.5q2 2 1.5 4.5t-1.5 6.5q-15 114-118.5 197T480-440Zm0-320q-17 0-28.5-11.5T440-800q0-17 11.5-28.5T480-840q17 0 28.5 11.5T520-800q0 17-11.5 28.5T480-760Z" />
        </svg>
    );

    const DEFAULT_BANNERS = [
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
        }
    ];

    // export default function MenuHub({ onOpenStudio, userName, phone, onAuth, onLogout }) {
    const scrollAreaRef = useRef(null);
    const tabsRef = useRef(null);
    const pillsRef = useRef(null);
    const reelRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showOrderCode, setShowOrderCode] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMaestroOpen, setIsMaestroOpen] = useState(false);
    const [maestroInitialView, setMaestroInitialView] = useState('welcome');
    const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);

    const { showToast } = useToast();
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        if (import.meta.env.VITE_USE_MOCK_AUTH === 'false') {
            const fetchHighlights = async () => {
                try {
                    const restaurantId = import.meta.env.VITE_RESTAURANT_ID;
                    if (!restaurantId) return;
                    const data = await getMenuHighlights(restaurantId);
                    if (data && Array.isArray(data) && data.length > 0) {
                        const newBanners = data.map(item => ({
                            tag: item.tag || "Sugestão",
                            title: item.name,
                            price: item.price ? `R$ ${Number(item.price).toFixed(2).replace('.', ',')}` : '',
                            bg: "#D9D9D9",
                            image: item.imageUrl,
                            // Store full item for details
                            ...item
                        }));
                        setBanners(newBanners);
                        // console.log(newBanners);
                    }
                } catch (err) {
                    console.error("Failed to fetch highlights:", err);
                }
            };
            fetchHighlights();
        }
    }, []);

    // Cart Persistence
    useEffect(() => {
        const savedCart = localStorage.getItem('menux_cart');
        if (savedCart) setCart(JSON.parse(savedCart));

        const savedCode = localStorage.getItem('menux_active_order');
        if (savedCode) setActiveOrderCode(savedCode);

        const savedItems = localStorage.getItem('menux_active_items');
        if (savedItems) setActiveOrderItems(JSON.parse(savedItems));
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
    const { branding, categories: dynamicCategories, products: dynamicProducts } = useStudio();

    // --- Custom Hooks ---
    const {
        cart, cartCount, activeOrderCode, activeOrderItems, orderHistory,
        addToCart, removeSingle, removeProduct, updateQty, finishOrder, reorder, clearCart
    } = useCart();

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

    // const {
    //     scrollAreaRef, categoryRefs, subcategoryRefs, sectionRefs,
    //     activeCategory, activeSubcategory, scrollToSection
    // } = useScrollSpy(currentCategories);

    const { onLongPressStart, onLongPressEnd } = useAdminPin({
        onSuccess: onOpenStudio,
        showToast
    });

    // --- Handlers ---
    const handleOpenMaestroChat = () => {
        setIsOrderModalOpen(false);
        setMaestroInitialView('chat');
        setIsMaestroOpen(true);
    };

    const handleAddToCart = (product, obs, qty = 1) => {
        addToCart(product, obs, qty);
        showToast("Item adicionado ao pedido!");
        setSelectedProduct(null);
    };

    const handleFinishOrder = () => {
        finishOrder();
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
        clearCart();
    };

    const handleReorder = (items) => {
        reorder(items);
        setIsMyOrdersOpen(false);
        showToast("Itens adicionados ao pedido!");
    };

    // Auto-scroll Banners
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = (prev + 1) % banners.length;
                if (reelRef.current) {
                    reelRef.current.scrollTo({ left: next * 329, behavior: 'smooth' });
                }
                return next;
            });
        }, 4000);
        return () => clearInterval(timer);
    }, [banners.length]);

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

    const handleBannerClick = (index) => {
        const banner = banners[index];
        if (banner) {
            setSelectedProduct({
                id: banner.id || `banner-${index}`,
                name: banner.item.name,
                desc: banner.item.description || "Prato em destaque.",
                price: banner.item.price,
                image: banner.item.imageUrl
            });
        }
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
        const observerOptions = {
            root: scrollAreaRef.current,
            rootMargin: '-10% 0px -80% 0px', // Trigger when section is near the top
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            if (isProgrammaticScroll.current) return;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const categoryId = entry.target.id;
                    setActiveCategory(categoryId);
                    setActiveSubcategory('');
                    const tabButton = tabsRef.current?.querySelector(`[data-id="${categoryId}"]`);
                    if (tabButton) centerNavButton(tabsRef, tabButton);
                }
            });
        }, observerOptions);

        const sections = currentCategories.map(cat => document.getElementById(cat.id)).filter(Boolean);
        sections.forEach(section => observer.observe(section));

        return () => {
            sections.forEach(section => observer.unobserve(section));
        };
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
                        {banners && banners.map((b, i) => (

                            <div
                                key={i}
                                className={`featured-card ${b.image ? 'has-image' : ''}`}
                                style={{
                                    background: !b.image
                                        ? `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.6)), url('${b.item.imageUrl}') center/cover no-repeat`
                                        : b.item.bgColor
                                }}
                                onClick={() => setSelectedProduct({
                                    id: `banner-${i}`,
                                    name: b.title,
                                    desc: "Prato em destaque.",
                                    price: b.price,
                                    image: b.image
                                })}
                            >
                                <span className="featured-tag">{b.tag}</span>
                                <h3 className="featured-title">{b.title}</h3>
                                <div className="featured-footer">
                                    <span className="featured-price">{b.price}</span>
                                    <button className="btn-order-now">Adicionar</button>
                                    {/* <span className="featured-tag" style={{ color: b.item.imageUrl ? 'rgba(255,255,255,0.9)' : undefined }}>{b.item.tag}</span>
                                <h3 className="featured-title" style={{ color: b.item.imageUrl ? 'white' : undefined }}>{b.item.name}</h3>
                                <div className="featured-footer">
                                    <span className="featured-price" style={{ color: b.item.imageUrl ? 'white' : undefined }}>{Number(b.item.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                    <button className="btn-order-now">Adicionar ao pedido</button> */}
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
                    onAddToCart={(item) => setSelectedProduct(item)}
                    onRemoveFromCart={removeSingle}
                    sectionRefs={sectionRefs}
                />

                <footer className="menu-footer">
                    <span className="menu-footer-text">Desenvolvido por</span>
                    <img src={imgLogo} alt="Menux" className="menu-footer-logo" />
                </footer>
            </div>

            {/* Floating Maestro Tabbar */}
            {!selectedProduct && (
                <>
                    <div
                        className={`floating-tabbar-container ${cartCount > 0 ? 'has-cart' : ''}`}
                        role="button"
                        aria-label="Abrir assistente Menux"
                        onClick={() => {
                            setMaestroInitialView('welcome');
                            setIsMaestroOpen(true);
                        }}
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
                        <div className="cart-floating-button" onClick={() => setIsOrderModalOpen(true)} role="button" aria-label="Ver pedido">
                            <img src="/icon-pedido.svg" alt="Pedido" className="cart-icon" />
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
                        onUpdateQty={updateQty}
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
                        onUpdateAvatar={updateAvatar}
                        userName={userName}
                        phone={phone}
                        onLogout={onLogout}
                        onDeleteAccount={onDeleteAccount}
                        onSaveProfile={updateProfile}
                        registeredAt={registeredAt}
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
                        onRemoveFromCart={removeProduct}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
