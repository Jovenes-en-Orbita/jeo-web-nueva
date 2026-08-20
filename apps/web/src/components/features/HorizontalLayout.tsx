'use client';

import React, { useRef, useEffect } from 'react';

interface HorizontalLayoutProps {
  children: React.ReactNode[];
}

export function HorizontalLayout({ children }: HorizontalLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Wheel listener attached to window to map mouse wheel scrolling directly to horizontal scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Allow internal scrolling for elements that scroll vertically inside cards or drawers
      const target = e.target as HTMLElement;
      if (
        target.closest('.overflow-y-auto, select, input, textarea') &&
        !target.classList.contains('snap-start')
      ) {
        const scrollable = target.closest('.overflow-y-auto') as HTMLElement;
        if (scrollable) {
          const isAtTop = scrollable.scrollTop === 0 && e.deltaY < 0;
          const isAtBottom =
            Math.abs(scrollable.scrollHeight - scrollable.clientHeight - scrollable.scrollTop) < 2 &&
            e.deltaY > 0;
          if (!isAtTop && !isAtBottom) {
            return; // let native internal element scroll
          }
        }
      }

      // Convert vertical mouse wheel scroll to horizontal scroll
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollBy({
          left: e.deltaY * 2.5,
          behavior: 'smooth'
        });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex w-full h-[calc(100vh-79px)] overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth scrollbar-none"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {React.Children.map(children, (child, idx) => (
        <div
          key={idx}
          className="w-full h-full flex-shrink-0 snap-start overflow-y-auto"
        >
          {child}
        </div>
      ))}
    </div>
  );
}
