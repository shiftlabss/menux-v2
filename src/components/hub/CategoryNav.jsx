import React from 'react';
import { motion } from 'framer-motion';

export default function CategoryNav({
    categories,
    activeCategory,
    activeSubcategory,
    onCategoryChange,
    onSubcategoryChange,
    categoryRefs,
    subcategoryRefs
}) {
    return (
        <div className="sticky-nav-container">
            {/* Main Categories (Tabs) */}
            <div className="categories-wrapper">
                <div className="categories-scroll">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            ref={el => categoryRefs.current[cat.id] = el}
                            className={`category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                            onClick={() => onCategoryChange(cat.id)}
                        >
                            {cat.name}
                            {activeCategory === cat.id && (
                                <motion.div className="active-indicator" layoutId="activeTab" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Subcategories (Pills) */}
            {activeCategory && categories.find(c => c.id === activeCategory)?.subcategories && (
                <div className="subcategories-wrapper">
                    <div className="subcategories-scroll">
                        {categories.find(c => c.id === activeCategory).subcategories.map((sub) => (
                            <button
                                key={sub.id}
                                ref={el => subcategoryRefs.current[`${activeCategory}-${sub.id}`] = el}
                                className={`subcategory-pill ${activeSubcategory === sub.id ? 'active' : ''}`}
                                onClick={() => onSubcategoryChange(sub.id)}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
