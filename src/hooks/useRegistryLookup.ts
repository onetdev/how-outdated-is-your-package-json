import { useCallback, useState } from 'react';

import { DependencyEntry, PackageLookupResult } from '@/types';
import getSemverCandidate from '@/utils/getSemverCandidate';
import useLogger from '@/hooks/useLogger';

export type RegistryLookupState = {
  progress: {
    total: number;
    fulfilled: number;
    failed: number;
  };
  results: PackageLookupResult[];
};
export type RegistryLookupResult = {
  isFetching: boolean;
  lookup: (dependencies: DependencyEntry[]) => void;
  progress?: RegistryLookupState['progress'];
  results?: PackageLookupResult[];
};
export type RegistryLookupProps = {
  registryUrl?: string;
};

const useRegistryLookup = ({
  registryUrl,
}: RegistryLookupProps): RegistryLookupResult => {
  const logger = useLogger({ scope: 'useRegistryLookup' });
  const [state, setState] = useState<RegistryLookupState | null>(null);

  const createFetchTask = useCallback(
    async (dependency: DependencyEntry) =>
      fetch(`${registryUrl}/${dependency.name}`, {
        cache: 'force-cache',
        mode: 'cors',
      })
        .then((raw) => raw.json())
        .then((response) => transformLookupResult(dependency, response.time))
        .catch(() => null),
    [registryUrl],
  );

  const setupFetchQueue = useCallback(
    (dependencies: DependencyEntry[]) => {
      setState({
        progress: {
          total: dependencies.length,
          fulfilled: 0,
          failed: 0,
        },
        results: [],
      });

      const queue: Promise<PackageLookupResult | null>[] = [];
      for (const dependency of dependencies) {
        logger.log(`Queueing ${dependency.name}@${dependency.targetVersion}`);
        const item = createFetchTask(dependency).then((data) => {
          setState((prev) => ({
            results: prev.results,
            progress: {
              ...prev.progress,
              fulfilled: prev.progress.fulfilled + 1,
            },
          }));
          return data;
        });
        queue.push(item);
      }

      return queue;
    },
    [createFetchTask, logger],
  );

  const lookup = useCallback(
    async (dependencies: DependencyEntry[]) => {
      if (!dependencies) {
        setState(null);
        return;
      }

      const queue = setupFetchQueue(dependencies);
      const queueResults = (await Promise.allSettled(queue))
        .map((result) => {
          if (result.status !== 'fulfilled') {
            return null;
          }
          return result.value;
        })
        .filter(Boolean);

      setState((prev) => ({
        results: queueResults,
        progress: { ...prev.progress },
      }));
    },
    [setupFetchQueue],
  );

  return {
    ...state,
    isFetching:
      state !== null &&
      state.progress.total !== state.progress.fulfilled + state.progress.failed,
    lookup,
  };
};

const transformLookupResult = (
  dep: DependencyEntry,
  history: Record<string, string>,
): PackageLookupResult => {
  const target = getSemverCandidate(dep.targetVersion, history);
  const latest = getSemverCandidate('*', history);
  return {
    ...dep,
    targetBest: target,
    packageBest: latest,
    upgradeAgeDiff: target?.age - latest?.age,
  };
};

export default useRegistryLookup;
