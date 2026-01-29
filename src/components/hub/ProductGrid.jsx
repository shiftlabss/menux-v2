import React from 'react';

const ProductCard = ({ item, onAdd, onRemove, isInCart }) => {
    return (
        <div className="product-card">
            <div className="product-image" style={{ backgroundImage: `url(${item.image})` }}>
                {isInCart && (
                    <div className="product-qty-badge">
                        {isInCart.qty}
                    </div>
                )}
            </div>
            <div className="product-info">
                <h3 className="product-title">{item.name}</h3>
                <p className="product-desc">{item.desc}</p>
                <div className="product-footer">
                    <span className="product-price">{item.price}</span>
                    {isInCart ? (
                        <div className="product-controls">
                            <button className="btn-control remove" onClick={(e) => { e.stopPropagation(); onRemove(item); }}>-</button>
                            <span className="qty-value">{isInCart.qty}</span>
                            <button className="btn-control add" onClick={(e) => { e.stopPropagation(); onAdd(item); }}>+</button>
                        </div>
                    ) : (
                        <button className="btn-add" onClick={(e) => { e.stopPropagation(); onAdd(item); }}>
                            Adicionar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function ProductGrid({
    categories,
    cart,
    onAddToCart,
    onRemoveFromCart,
    sectionRefs
}) {
    return (
        <div className="menu-list">
            {categories.map(cat => (
                <div key={cat.id} id={`cat-${cat.id}`} ref={el => sectionRefs.current[cat.id] = el} className="category-section">
                    <h2 className="category-title">{cat.name}</h2>
                    {cat.subcategories.map(sub => (
                        <div key={sub.id} id={`sub-${cat.id}-${sub.id}`} className="subcategory-section">
                            <h3 className="subcategory-name">{sub.name}</h3>
                            <div className="products-grid">
                                {sub.items.map(item => {
                                    const cartItem = cart.find(c => c.id === item.id);
                                    return (
                                        <ProductCard
                                            key={item.id}
                                            item={item}
                                            isInCart={cartItem}
                                            onAdd={onAddToCart}
                                            onRemove={onRemoveFromCart}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
