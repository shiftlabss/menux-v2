import React from 'react';

const ProductItem = ({ item, onClick }) => {
    return (
        <div className="menu-item" onClick={() => onClick(item)}>
            <div className="item-info">
                <h4 className="item-name">{item.name}</h4>
                <p className="item-desc">{item.desc}</p>
                <div className="item-price">{item.price}</div>
            </div>
            <div
                className="item-image"
                style={{
                    backgroundImage: item.image ? `url(${item.image})` : 'none',
                    backgroundSize: 'cover'
                }}
            ></div>
        </div>
    );
};

export default function ProductGrid({
    categories,
    cart, // Not used in original list view (qty was not shown in list), but kept for compat
    onAddToCart, // Acts as "Open Detail" in the original logic
    onRemoveFromCart,
    sectionRefs
}) {
    return (
        <div className="menu-list-container">
            {categories.map(cat => (
                <div key={cat.id} id={`cat-${cat.id}`} ref={el => sectionRefs.current[cat.id] = el} className="menu-section-visible-check">
                    <div className="menu-list">
                        <h3 className="section-label">
                            {cat.name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </h3>

                        {cat.subcategories.map(sub => (
                            <div key={sub.id || sub.name} id={`sub-${cat.id}-${sub.id || sub.name.replace(/\s+/g, '-').toLowerCase()}`}>
                                <p className="subcategory-label">
                                    {(sub.subcategory_label || sub.name).toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                </p>

                                {sub.items && sub.items.length > 0 ? (
                                    sub.items.map(item => (
                                        <ProductItem
                                            key={item.id}
                                            item={item}
                                            onClick={onAddToCart} // In original MenuHub, clicking an item opened the detail modal (setSelectedProduct) which we passed as onAddToCart here for now, I should rename the prop in MenuHub to make it clear.
                                        />
                                    ))
                                ) : (
                                    <div style={{ padding: '20px 0', opacity: 0.3 }}>Nenhum item disponível no momento.</div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="menu-divider-large"></div>
                </div>
            ))}
        </div>
    );
}
