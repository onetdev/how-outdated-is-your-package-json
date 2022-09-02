import { useEffect, useState } from "react";

import { PackageLookupResult, PackageStat, PackageStatData } from "@/types";

type PackageStatsProps = {
  source: PackageLookupResult[] | null;
};

const usePackageStats = ({ source }: PackageStatsProps) => {
  const [stats, setStats] = useState<PackageStat | null>();

  useEffect(() => {
    if (!source) {
      setStats(null);
      return;
    }

    const result: PackageStat = {
      counters: {
        total: source.length,
        dev: source.filter((x) => x.isDev).length,
        nonDev: source.filter((x) => !x.isDev).length,
      },
      data: [],
    };

    for (const entry of source) {
      const { name, targetVersion, upgradeAgeDiff } = entry;
      const { targetBest, packageBest } = entry;

      if (!targetBest || !packageBest) {
        continue;
      }

      const data: PackageStatData = {
        package: name,
        isDev: entry.isDev,
        latestAge: packageBest.age,
        latestDate: packageBest.date,
        latestVersion: packageBest.version,
        maxSatisfiedAge: targetBest.age,
        maxSatisfiedDate: targetBest.date,
        maxSatisfiedVersion: targetBest.version,
        targetVersion,
        upgradeAgeDiff,
      };

      result.data.push(data);
    }

    setStats(result);
  }, [source]);

  return stats;
};

export default usePackageStats;
