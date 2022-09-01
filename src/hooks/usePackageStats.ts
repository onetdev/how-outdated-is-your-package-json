import { useEffect, useState } from "react";

import { PackageLookupResult, PackageStat, PackageStatCategory } from "@/types";

type PackageStatsProps = {
  source: PackageLookupResult[] | null;
};

const getStatByField = (
  source: PackageLookupResult[],
  getter: (data: PackageLookupResult) => number
): PackageStatCategory => ({
  orderedItems: source.sort((a, b) => getter(a) - getter(b)),
  cumulativeAge: source.reduce((acc, x) => acc + getter(x), 0),
  averageAge: source.reduce((acc, x) => acc + getter(x), 0) / source.length,
});

const usePackageStats = ({ source }: PackageStatsProps) => {
  const [stats, setStats] = useState<PackageStat | null>();

  useEffect(() => {
    if (!source) {
      setStats(null);
      return;
    }

    setStats({
      counters: {
        total: source.length,
        dev: source.filter((x) => x.isDev).length,
        nonDev: source.filter((x) => !x.isDev).length,
      },
      // From oldest to youngest deps (max satisfied by target version)
      byAge: getStatByField(source, (data) => data.targetBest?.age || 0),
      // From least maintained to most maintained deps
      byFreshness: getStatByField(source, (data) => data.packageBest?.age || 0),
      // Deps that have the most upgrade potential
      byUpgradability: getStatByField(
        source,
        (data) => data.upgradeAgeDiff || 0
      ),
    });
  }, [source]);

  return stats;
};

export default usePackageStats;
