import { useEffect, useState } from 'react';

import { DependencyEntry } from '@/types';
import sanitizeDependencyArray from '@/utils/sanitizeDependencyArray';

export type PackageIngestProps = {
  input: string | null;
};
export type PackageIngestMetadata = {
  dependencies?: DependencyEntry[];
  counters?: {
    dev: number;
    normal: number;
    skipped: number;
    total: number;
  };
  isValid: boolean;
};

const usePackageIngest = ({
  input,
}: PackageIngestProps): PackageIngestMetadata => {
  const [state, setState] = useState<PackageIngestMetadata>({
    isValid: false,
  });

  useEffect(() => {
    try {
      const parsed = JSON.parse(input || '{}');
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
    } catch (error) {
      setState({
        isValid: false,
      });
      console.error('Hmm, something is fishy with this input.', error);
    }
  }, [input]);

  return state;
};

export default usePackageIngest;
