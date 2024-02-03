import { useCallback, useState } from "react";

import { DependencyEntry, PackageLookupResult } from "@/types";
import getSemverCandidate from "@/utils/getSemverCandidate";

const transformLookupResult = (
  dep: DependencyEntry,
  history: Record<string, string>,
): PackageLookupResult => {
  const target = getSemverCandidate(dep.targetVersion, history);
  const latest = getSemverCandidate("*", history);
  return {
    ...dep,
    targetBest: target,
    packageBest: latest,
    upgradeAgeDiff: target?.age - latest?.age,
  };
};

export type RegistryLookupProps = {
  dependencies?: DependencyEntry[];
  registryUrl?: string;
};

const useRegistryLookup = ({
  dependencies,
  registryUrl,
}: RegistryLookupProps) => {
  const [progress, setProgress] = useState({ total: 0, fulfilled: 0 });
  const [results, setResults] = useState<PackageLookupResult[]>([]);

  const lookup = useCallback(async () => {
    if (!dependencies.length || progress.total !== progress.fulfilled) {
      return;
    }

    setResults([]);
    setProgress({ total: dependencies.length, fulfilled: 0 });
    const fetchQueue: Promise<PackageLookupResult | null>[] = [];
    for (const dependency of dependencies) {
      console.log(`Queueing ${dependency.name}@${dependency.targetVersion}`);
      fetchQueue.push(
        fetch(`${registryUrl}/${dependency.name}`, {
          cache: "force-cache",
          mode: "cors",
        })
          .then((raw) => raw.json())
          .then((response) => transformLookupResult(dependency, response.time))
          .catch(() => null)
          .finally(() => {
            setProgress((prev) => ({
              total: prev.total,
              fulfilled: prev.fulfilled + 1,
            }));
          }),
      );
    }

    const queueResults = (await Promise.allSettled(fetchQueue))
      .map((result) => {
        if (result.status !== "fulfilled") {
          return null;
        }
        return result.value;
      })
      .filter(Boolean);

    setResults(queueResults);
    setProgress({ total: 0, fulfilled: 0 });
  }, [dependencies, progress.fulfilled, progress.total, registryUrl]);

  const clear = () => {
    setResults([]);
    setProgress({ total: 0, fulfilled: 0 });
  };

  return {
    progress,
    isFetching: progress.total !== progress.fulfilled,
    results,
    lookup,
    clear,
  };
};

export default useRegistryLookup;
