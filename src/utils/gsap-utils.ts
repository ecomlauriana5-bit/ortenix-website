/**
 * GSAP utilities for Ortenix
 * Import dynamically to avoid SSR issues:
 *   const { fadeUp } = await import('../utils/gsap-utils');
 */

export interface AnimationOptions {
  duration?: number;
  delay?: number;
  ease?: string;
  stagger?: number;
  start?: string;
}

const DEFAULT_OPTS: Required<AnimationOptions> = {
  duration: 0.7,
  delay: 0,
  ease: 'power2.out',
  stagger: 0.15,
  start: 'top 80%',
};

/** Fade + slide up on scroll for a single element */
export async function fadeUp(
  selector: string | HTMLElement | NodeListOf<HTMLElement>,
  opts: AnimationOptions = {}
) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const o = { ...DEFAULT_OPTS, ...opts };

  gsap.fromTo(
    selector,
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: o.duration,
      delay: o.delay,
      ease: o.ease,
      scrollTrigger: {
        trigger: selector as Element,
        start: o.start,
        once: true,
      },
    }
  );
}

/** Staggered fade-up for a list of elements inside a container */
export async function staggerFadeUp(
  containerSelector: string,
  itemSelector: string,
  opts: AnimationOptions = {}
) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  const o = { ...DEFAULT_OPTS, ...opts };
  const containers = document.querySelectorAll(containerSelector);

  containers.forEach((container) => {
    const items = container.querySelectorAll(itemSelector);
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: o.duration,
        ease: o.ease,
        stagger: o.stagger,
        scrollTrigger: {
          trigger: container,
          start: o.start,
          once: true,
        },
      }
    );
  });
}

/** Count-up animation for numeric elements */
export async function countUp(
  selector: string,
  opts: { duration?: number } = {}
) {
  const elements = document.querySelectorAll<HTMLElement>(selector);
  const duration = opts.duration ?? 1800;

  elements.forEach((el) => {
    const target = parseInt(el.dataset.target ?? '0', 10);
    const suffix = el.dataset.suffix ?? '';

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = `${target}${suffix}`;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.unobserve(el);

        const start = performance.now();
        const tick = (now: number) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = `${Math.round(eased * target)}${suffix}`;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
  });
}

/** Initialize all scroll animations on the page */
export async function initScrollAnimations() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  // Single fade-up elements
  document.querySelectorAll<HTMLElement>('.fade-up').forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }
    );
  });

  // Stagger containers
  document.querySelectorAll<HTMLElement>('.stagger-container').forEach((container) => {
    const items = container.querySelectorAll<HTMLElement>('.stagger-item');
    if (!items.length) return;

    gsap.fromTo(
      items,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: { trigger: container, start: 'top 80%', once: true },
      }
    );
  });
}
