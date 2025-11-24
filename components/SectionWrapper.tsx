
import React, { useRef, useState, useEffect, ReactNode } from 'react';

interface SectionWrapperProps {
  children: (isVisible: boolean) => ReactNode;
  id?: string;
  className?: string;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, id, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we don't need to observe anymore (unless we want it to reset on scroll out)
          if (domRef.current) observer.unobserve(domRef.current);
        }
      });
    }, { threshold: 0.2 }); // Trigger when 20% of section is visible

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section id={id} ref={domRef} className={`scroll-mt-24 min-h-[200px] ${className}`}>
      {children(isVisible)}
    </section>
  );
};
