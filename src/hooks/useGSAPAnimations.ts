"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';

// GSAP 플러그인 등록
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}

// 웹플로우 스타일 글자별 fade 애니메이션
export const useWebflowTextAnimation = <T extends HTMLElement = HTMLElement>(
  texts: string[],
  delay: number = 3
) => {
  const elementRef = useRef<T>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!elementRef.current || texts.length === 0) return;

    const loadSplitType = async () => {
      try {
        // SplitType 동적 임포트
        const { default: SplitType } = await import('split-type');
        
        const element = elementRef.current!;
        
        // 기존 타임라인 정리
        if (timelineRef.current) {
          timelineRef.current.kill();
        }
        
        // HTML 구조 생성 (웹플로우와 동일)
        element.innerHTML = '';
        texts.forEach((item) => {
          const span = document.createElement('span');
          span.style.position = 'absolute';
          span.style.top = '0';
          span.style.left = '0';
          span.textContent = item;
          element.appendChild(span);
        });

        // SplitType으로 글자별 분리
        const textElements = Array.from(element.querySelectorAll('span')).map((item) => {
          return new SplitType(item as HTMLElement);
        });

        // 초기 상태 설정 (모든 글자 숨김)
        textElements.forEach((item) => {
          gsap.set(item.chars, {
            opacity: 0,
          });
        });

        // 첫 번째 텍스트만 보이게 설정
        gsap.set(textElements[0].chars, {
          opacity: 1,
        });

        // 타임라인 생성 (무한 반복)
        const tl = gsap.timeline({
          repeat: -1,
        });

        // 첫 번째 텍스트 fade out
        const firstChars = textElements[0].chars ? [...textElements[0].chars] : [];
        firstChars.reverse();
        tl.fromTo(
          firstChars,
          {
            autoAlpha: 1,
          },
          {
            autoAlpha: 0,
            delay: delay,
            stagger: 0.1,
            onComplete: () => {
              if (textElements[0].chars) {
                textElements[0].chars.reverse();
              }
            },
          }
        );

        // 중간 텍스트들 순환
        for (let i = 1; i < texts.length; i++) {
          const chars = textElements[i].chars || [];
          const currentTextChars = textElements[i].chars;
          const reversedChars = currentTextChars ? [...currentTextChars] : [];
          reversedChars.reverse();
          
          tl.fromTo(
            chars,
            {
              autoAlpha: 0,
            },
            {
              autoAlpha: 1,
              stagger: 0.1,
            },
            '>0.2'
          ).to(reversedChars, {
            autoAlpha: 0,
            stagger: 0.1,
            delay: delay,
            onComplete: () => {
              const currentChars = textElements[i]?.chars;
              if (currentChars) {
                currentChars.reverse();
              }
            },
          });
        }

        // 첫 번째 텍스트로 돌아가기
        const finalChars = textElements[0].chars ? [...textElements[0].chars] : [];
        finalChars.reverse();
        tl.to(
          finalChars,
          {
            autoAlpha: 1,
            stagger: 0.1,
          },
          '>0.2'
        );

        timelineRef.current = tl;
      } catch (error) {
        console.error('SplitType 로딩 실패:', error);
      }
    };

    loadSplitType();

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [texts, delay]);

  return elementRef;
};

// 텍스트 타이핑 애니메이션 (백업용)
export const useTypewriterAnimation = <T extends HTMLElement = HTMLElement>(
  texts: string[],
  duration: number = 4000,
  typingSpeed: number = 0.05
) => {
  const elementRef = useRef<T>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!elementRef.current || texts.length === 0) return;

    const element = elementRef.current;
    let currentIndex = 0;

    const animateText = () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const tl = gsap.timeline({ repeat: -1 });
      
      texts.forEach((text, index) => {
        tl.to(element, {
          duration: text.length * typingSpeed,
          text: text,
          ease: "none",
        })
        .to(element, {
          duration: 0.5,
          opacity: 1,
        })
        .to(element, {
          duration: 0.5,
          opacity: 0.7,
          delay: duration / 1000 - 1,
        });
      });

      timelineRef.current = tl;
    };

    animateText();

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [texts, duration, typingSpeed]);

  return elementRef;
};

// 스크롤 트리거 애니메이션
export const useScrollAnimation = <T extends HTMLElement = HTMLElement>(
  animation: 'fadeInUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'rotateIn',
  options: {
    trigger?: string;
    start?: string;
    end?: string;
    scrub?: boolean;
    delay?: number;
    duration?: number;
  } = {}
) => {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const {
      trigger = element,
      start = "top 80%",
      end = "bottom 20%",
      scrub = false,
      delay = 0,
      duration = 1
    } = options;

    // 초기 상태 설정
    const initialState: gsap.TweenVars = {};
    const animateState: gsap.TweenVars = {};

    switch (animation) {
      case 'fadeInUp':
        initialState.y = 50;
        initialState.opacity = 0;
        animateState.y = 0;
        animateState.opacity = 1;
        break;
      case 'slideInLeft':
        initialState.x = -100;
        initialState.opacity = 0;
        animateState.x = 0;
        animateState.opacity = 1;
        break;
      case 'slideInRight':
        initialState.x = 100;
        initialState.opacity = 0;
        animateState.x = 0;
        animateState.opacity = 1;
        break;
      case 'scaleIn':
        initialState.scale = 0;
        initialState.opacity = 0;
        animateState.scale = 1;
        animateState.opacity = 1;
        break;
      case 'rotateIn':
        initialState.rotation = 180;
        initialState.scale = 0;
        initialState.opacity = 0;
        animateState.rotation = 0;
        animateState.scale = 1;
        animateState.opacity = 1;
        break;
    }

    gsap.set(element, initialState);

    const scrollTrigger = ScrollTrigger.create({
      trigger,
      start,
      end,
      scrub,
      animation: gsap.to(element, {
        ...animateState,
        duration,
        delay,
        ease: "power2.out"
      }),
      once: !scrub
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [animation, options]);

  return elementRef;
};

// 스태거 애니메이션 (순차 등장)
export const useStaggerAnimation = <T extends HTMLElement = HTMLElement>(
  selector: string,
  animation: 'fadeInUp' | 'slideInLeft' | 'slideInRight' | 'scaleIn',
  options: {
    stagger?: number;
    delay?: number;
    duration?: number;
    start?: string;
  } = {}
) => {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const elements = container.querySelectorAll(selector);
    
    if (elements.length === 0) return;

    const {
      stagger = 0.1,
      delay = 0,
      duration = 0.8,
      start = "top 80%"
    } = options;

    // 초기 상태 설정
    const initialState: gsap.TweenVars = {};
    const animateState: gsap.TweenVars = {};

    switch (animation) {
      case 'fadeInUp':
        initialState.y = 30;
        initialState.opacity = 0;
        animateState.y = 0;
        animateState.opacity = 1;
        break;
      case 'slideInLeft':
        initialState.x = -50;
        initialState.opacity = 0;
        animateState.x = 0;
        animateState.opacity = 1;
        break;
      case 'slideInRight':
        initialState.x = 50;
        initialState.opacity = 0;
        animateState.x = 0;
        animateState.opacity = 1;
        break;
      case 'scaleIn':
        initialState.scale = 0.8;
        initialState.opacity = 0;
        animateState.scale = 1;
        animateState.opacity = 1;
        break;
    }

    gsap.set(elements, initialState);

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start,
      animation: gsap.to(elements, {
        ...animateState,
        duration,
        delay,
        stagger,
        ease: "power2.out"
      }),
      once: true
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [selector, animation, options]);

  return containerRef;
};

// 패럴랙스 효과
export const useParallaxAnimation = <T extends HTMLElement = HTMLElement>(
  speed: number = 0.5,
  direction: 'vertical' | 'horizontal' = 'vertical'
) => {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      animation: gsap.fromTo(element, 
        direction === 'vertical' 
          ? { y: -50 * speed } 
          : { x: -50 * speed },
        direction === 'vertical' 
          ? { y: 50 * speed, ease: "none" } 
          : { x: 50 * speed, ease: "none" }
      )
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [speed, direction]);

  return elementRef;
};

// 마우스 따라다니는 효과
export const useMouseFollowAnimation = <T extends HTMLElement = HTMLElement>(
  strength: number = 0.1,
  ease: string = "power2.out"
) => {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      mouseX = (e.clientX - centerX) * strength;
      mouseY = (e.clientY - centerY) * strength;

      gsap.to(element, {
        x: mouseX,
        y: mouseY,
        duration: 1,
        ease
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 1,
        ease
      });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, ease]);

  return elementRef;
};

// 스크롤 진행률 표시
export const useScrollProgress = <T extends HTMLElement = HTMLElement>() => {
  const progressRef = useRef<T>(null);

  useEffect(() => {
    if (!progressRef.current) return;

    const progress = progressRef.current;

    const scrollTrigger = ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      animation: gsap.fromTo(progress, 
        { scaleX: 0 },
        { scaleX: 1, ease: "none", transformOrigin: "left center" }
      )
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return progressRef;
}; 