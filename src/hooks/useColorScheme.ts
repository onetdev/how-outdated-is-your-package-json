import { useEffect, useState } from 'react';

export type ColorScheme = 'light' | 'dark';

export type PrefersColorSchemeProps = {
  defaultScheme?: ColorScheme;
};

const useColorScheme = ({
  defaultScheme,
}: PrefersColorSchemeProps = {}): ColorScheme => {
  const [preferredColorScheme, setPreferredColorScheme] = useState<ColorScheme>(
    defaultScheme ?? 'dark',
  );

  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    setPreferredColorScheme(mediaQuery.matches ? 'dark' : 'light');

    const onChange = (event: MediaQueryListEvent): void =>
      setPreferredColorScheme(event.matches ? 'dark' : 'light');

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return preferredColorScheme;
};

export default useColorScheme;
