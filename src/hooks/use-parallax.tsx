import { useState, useEffect, useRef, RefObject } from 'react';

interface ParallaxOptions {
  speed?: number; // Multiplier for parallax effect (0.1 - 1.0)
  direction?: 'up' | 'down';
}

export function useParallax(options: ParallaxOptions = {}) {
  const { speed = 0.5, direction = 'up' } = options;
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;
      
      // Calculate how far into the viewport the element is
      const scrollProgress = (windowHeight - elementTop) / (windowHeight + rect.height);
      const clampedProgress = Math.max(0, Math.min(1, scrollProgress));
      
      // Calculate offset based on scroll position
      const maxOffset = 100 * speed;
      const newOffset = direction === 'up' 
        ? clampedProgress * maxOffset 
        : -clampedProgress * maxOffset;
      
      setOffset(newOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction]);

  return { ref, offset };
}

export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollY;
}

export function useElementParallax(elementRef: RefObject<HTMLElement>, speed: number = 0.3) {
  const [transform, setTransform] = useState({ y: 0, opacity: 1, scale: 1 });

  useEffect(() => {
    const handleScroll = () => {
      if (!elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      // Distance from viewport center (normalized)
      const distance = (elementCenter - viewportCenter) / windowHeight;
      
      // Calculate transforms
      const y = distance * 50 * speed;
      const opacity = Math.max(0.3, 1 - Math.abs(distance) * 0.5);
      const scale = Math.max(0.95, 1 - Math.abs(distance) * 0.05);

      setTransform({ y, opacity, scale });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [elementRef, speed]);

  return transform;
}
