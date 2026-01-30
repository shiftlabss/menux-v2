import React from 'react';

export default function CategoryNav({
    categories,
    activeCategory,
    activeSubcategory,
    onCategoryChange,
    onSubcategoryChange,
    categoryRefs, // Note: The parent now needs to pass the ref attached to the container if we want scroll centering, or we manage it here. Ref forwarding was a bit mixed up.
    subcategoryRefs
}) {
    // We need internal refs if we want to expose them or just attach the passed refs

    return (
        <nav className="category-nav">
            <div className="category-tabs">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        // If parent passes a ref object to store elements, we use it. 
                        // The parent passed `categoryRefs` as a mutable ref object (useRef({}))
                        ref={el => { if (categoryRefs?.current) categoryRefs.current[cat.id] = el }}
                        className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => onCategoryChange(cat.id)}
                    >
                        {cat.name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </button>
                ))}
            </div>

            <div className="filter-pills">
                <button
                    className={`filter-pill ${activeSubcategory === '' ? 'active' : ''}`}
                    onClick={() => onSubcategoryChange('')}
                >
                    Todos
                </button>
                {activeCategory && categories.find(c => c.id === activeCategory)?.subcategories.map((sub) => (
                    <button
                        key={sub.id || sub.name}
                        ref={el => { if (subcategoryRefs?.current) subcategoryRefs.current[`${activeCategory}-${sub.id || sub.name}`] = el }}
                        className={`filter-pill ${activeSubcategory === (sub.id || sub.name) ? 'active' : ''}`}
                        onClick={() => onSubcategoryChange(sub.id || sub.name)}
                    >
                        {sub.name}
                    </button>
                ))}
            </div>
        </nav>
    );
}
