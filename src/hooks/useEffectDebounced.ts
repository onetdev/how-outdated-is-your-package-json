import { DependencyList, useEffect } from 'react';

const useEffectDebounced = (
  callback: () => void,
  delay: number,
  deps: DependencyList,
) => {
  useEffect(() => {
    const timerId = setTimeout(() => callback(), delay);

    return () => clearTimeout(timerId);
  }, deps);
};

export default useEffectDebounced;
