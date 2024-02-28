import { useState } from 'react';

import { DependencyEntry } from '@/types';
import sanitizeDependencyArray from '@/utils/sanitizeDependencyArray';
import useLogger from '@/hooks/useLogger';

export type PackageIngestResult =
  | {
      dependencies?: DependencyEntry[];
      counters?: {
        dev: number;
        normal: number;
        skipped: number;
        total: number;
      };
      isValid: true;
    }
  | { isValid: false };
export type PackageIngestReturn = {
  result: PackageIngestResult;
  tryParse: (raw: string) => void;
};

const usePackageIngest = (): PackageIngestReturn => {
  const logger = useLogger({ scope: 'usePackageIngest' });
  const [state, setState] = useState<PackageIngestResult>({
    isValid: false,
  });

  const parse = (raw: string) => {
    const parsed = JSON.parse(raw || '{}');
    const depsRaw = parsed.dependencies || {};
    const devDepsRaw = parsed.devDependencies || {};
    const deps = sanitizeDependencyArray(depsRaw);
    const devDeps = sanitizeDependencyArray(devDepsRaw, true);
    const skipCount =
      Object.keys({ ...depsRaw, ...devDepsRaw }).length -
      deps.length -
      devDeps.length;

    setState({
      dependencies: [...deps, ...devDeps],
      counters: {
        dev: devDeps.length,
        normal: deps.length,
        skipped: skipCount,
        total: deps.length + devDeps.length,
      },
      isValid: true,
    });
  };

  const tryParse = (raw: string) => {
    try {
      parse(raw);
    } catch (error) {
      setState({ isValid: false });
      logger.error('Hmm, something is fishy with this input.', error);
    }
  };

  return {
    result: state,
    tryParse,
  };
};

export default usePackageIngest;
