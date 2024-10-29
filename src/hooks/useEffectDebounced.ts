import { DependencyList, useEffect } from 'react';

const useEffectDebounced = (
  callback: () => void,
  delay: number,
  deps: DependencyList,
) => {
  useEffect(() => {
    const timerId = setTimeout(() => callback(), delay);

    return () => clearTimeout(timerId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useEffectDebounced;
