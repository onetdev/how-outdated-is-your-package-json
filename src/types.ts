import { Dayjs } from "dayjs";

export type AgeInSeconds = number;
export type DependencyEntry = {
  name: string;
  targetVersion: string;
  isDev: boolean;
};
export type LookupVersionCandidate = {
  version: string;
  date: Dayjs;
  age: AgeInSeconds;
};
export type PackageLookupResult = DependencyEntry & {
  targetBest?: LookupVersionCandidate;
  packageBest?: LookupVersionCandidate;
  upgradeAgeDiff: AgeInSeconds;
};

export type PackgeStatListItem = PackageLookupResult;
export type PackageStatCategory<T = PackgeStatListItem> = {
  orderedItems: T[];
  cumulativeAge: AgeInSeconds;
  averageAge: AgeInSeconds;
};
export type PackageStat = {
  counters: { total: number; dev: number; nonDev: number };
  byAge: PackageStatCategory;
  byFreshness: PackageStatCategory;
  byUpgradability: PackageStatCategory;
};
