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

    const {
        scrollAreaRef, categoryRefs, subcategoryRefs, sectionRefs,
        activeCategory, activeSubcategory, scrollToSection
    } = useScrollSpy(currentCategories);

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
                const next = (prev + 1) % BANNERS.length;
                if (reelRef.current) {
                    reelRef.current.scrollTo({ left: next * 329, behavior: 'smooth' });
                }
                return next;
            });
        }, 4000);
        return () => clearInterval(timer);
    }, []);

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
                                className={`featured-card ${b.image ? 'has-image' : ''}`}
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
                                <span className="featured-tag">{b.tag}</span>
                                <h3 className="featured-title">{b.title}</h3>
                                <div className="featured-footer">
                                    <span className="featured-price">{b.price}</span>
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
