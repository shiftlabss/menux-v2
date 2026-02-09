import { useRef, useState, useEffect, useCallback } from 'react';

export default function useScrollSpy(categories) {
    const scrollAreaRef = useRef(null);
    const categoryRefs = useRef({});
    const subcategoryRefs = useRef({});
    const sectionRefs = useRef({});
    const isProgrammaticScroll = useRef(false);

    const [activeCategory, setActiveCategory] = useState('entradas');
    const [activeSubcategory, setActiveSubcategory] = useState('');

    const centerNavButton = (containerRef, buttonElement) => {
        if (!containerRef.current || !buttonElement) return;
        const container = containerRef.current;
        const scrollLeft = buttonElement.offsetLeft - (container.offsetWidth / 2) + (buttonElement.offsetWidth / 2);
        container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    };

    const scrollToSection = useCallback((id, type, value) => {
        isProgrammaticScroll.current = true;
        if (type === 'category') {
            setActiveCategory(value);
            setActiveSubcategory('');
            const el = categoryRefs.current[value];
            if (el) centerNavButton({ current: el.parentElement.parentElement }, el);
        } else {
            setActiveSubcategory(value);
        }

        let targetId;
        if (type === 'category') {
            targetId = `cat-${id}`;
        } else {
            const normalizedId = (typeof id === 'number' || !id?.includes(' '))
                ? id
                : id.replace(/\s+/g, '-').toLowerCase();
            targetId = `sub-${activeCategory}-${normalizedId}`;
        }

        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => { isProgrammaticScroll.current = false; }, 800);
    }, [activeCategory]);

    // Intersection Observer for scroll spy
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
                    if (entry.target.id.startsWith('cat-')) {
                        const catId = entry.target.id.replace('cat-', '');
                        setActiveCategory(catId);
                    }
                }
            });
        }, observerOptions);

        categories.forEach(cat => {
            const el = document.getElementById(`cat-${cat.id}`);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [categories]);

    return {
        scrollAreaRef,
        categoryRefs,
        subcategoryRefs,
        sectionRefs,
        activeCategory,
        activeSubcategory,
        scrollToSection,
    };
}
