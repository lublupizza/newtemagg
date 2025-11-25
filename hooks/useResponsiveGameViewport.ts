import { useEffect, useMemo, useState } from 'react';

export type ScreenTier = 'mobile' | 'tablet' | 'desktop';

type MaybeResponsiveValue = number | ((ctx: { viewport: { width: number; height: number }; screen: ScreenTier }) => number);

interface StageSizingOptions {
  reservedTop?: MaybeResponsiveValue;
  reservedBottom?: MaybeResponsiveValue;
  minHeight?: MaybeResponsiveValue;
  minWidth?: MaybeResponsiveValue;
  maxHeightScale?: MaybeResponsiveValue;
  maxWidthScale?: MaybeResponsiveValue;
  fillHeight?: MaybeResponsiveValue;
  fillWidth?: MaybeResponsiveValue;
  horizontalPadding?: MaybeResponsiveValue;
}

interface ResponsiveOptions extends StageSizingOptions {
  breakpoints?: Partial<Record<ScreenTier, StageSizingOptions>>;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const resolve = (
  value: MaybeResponsiveValue | undefined,
  ctx: { viewport: { width: number; height: number }; screen: ScreenTier },
  fallback: number
) => {
  if (typeof value === 'function') return value(ctx);
  if (typeof value === 'number') return value;
  return fallback;
};

const defaultOptions: StageSizingOptions = {
  reservedTop: 0,
  reservedBottom: 0,
  minHeight: 420,
  minWidth: 320,
  maxHeightScale: 0.98,
  maxWidthScale: 0.96,
  fillHeight: 0.94,
  fillWidth: 0.94,
  horizontalPadding: 16,
};

export const useResponsiveGameViewport = (options: ResponsiveOptions = {}) => {
  const readViewport = () => {
    if (typeof window === 'undefined') return { width: 1280, height: 720 };
    const vv = window.visualViewport;
    return {
      width: vv?.width ?? window.innerWidth,
      height: vv?.height ?? window.innerHeight,
    };
  };

  const [viewport, setViewport] = useState(readViewport());

  useEffect(() => {
    const handleResize = () => setViewport(readViewport());

    handleResize();
    window.addEventListener('resize', handleResize);
    window.visualViewport?.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.visualViewport?.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const isMobile = viewport.width < 640;
  const isTablet = viewport.width >= 640 && viewport.width < 1024;
  const isDesktop = viewport.width >= 1024;
  const screen: ScreenTier = isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile';

  const mergedOptions = useMemo(() => {
    const preset = options.breakpoints?.[screen] ?? {};
    return {
      ...defaultOptions,
      ...options,
      ...preset,
    } satisfies StageSizingOptions;
  }, [options, screen]);

  const ctx = { viewport, screen } as const;

  const horizontalPadding = resolve(mergedOptions.horizontalPadding, ctx, 0);
  const minHeight = resolve(mergedOptions.minHeight, ctx, defaultOptions.minHeight!);
  const minWidth = resolve(mergedOptions.minWidth, ctx, defaultOptions.minWidth!);
  const reservedTop = resolve(mergedOptions.reservedTop, ctx, 0);
  const reservedBottom = resolve(mergedOptions.reservedBottom, ctx, 0);
  const fillHeight = resolve(mergedOptions.fillHeight, ctx, defaultOptions.fillHeight!);
  const fillWidth = resolve(mergedOptions.fillWidth, ctx, defaultOptions.fillWidth!);
  const maxHeightScale = resolve(mergedOptions.maxHeightScale, ctx, defaultOptions.maxHeightScale!);
  const maxWidthScale = resolve(mergedOptions.maxWidthScale, ctx, defaultOptions.maxWidthScale!);

  const availableHeight = Math.max(viewport.height - reservedTop - reservedBottom, minHeight);

  const stageHeight = clamp(availableHeight * fillHeight, minHeight, maxHeightScale * viewport.height);

  const availableWidth = Math.max(viewport.width - horizontalPadding * 2, minWidth);
  const stageWidth = clamp(availableWidth * fillWidth, minWidth, maxWidthScale * viewport.width);

  return {
    viewport,
    isMobile,
    isTablet,
    isDesktop,
    screen,
    stageHeight,
    stageWidth,
    availableHeight,
    options: mergedOptions,
  } as const;
};

export default useResponsiveGameViewport;
