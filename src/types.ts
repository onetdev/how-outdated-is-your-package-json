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

export type PackageStatData = {
  package: string;
  latestAge: AgeInSeconds;
  latestDate: Dayjs;
  latestVersion: string;
  maxSatisfiedAge: AgeInSeconds;
  maxSatisfiedDate: Dayjs;
  maxSatisfiedVersion: string;
  targetVersion: string;
  upgradeAgeDiff: AgeInSeconds;
};
export type PackageDataMathFields =
  | "maxSatisfiedAge"
  | "latestAge"
  | "upgradeAgeDiff";
export type PackageStat = {
  counters: { total: number; dev: number; nonDev: number };
  data: PackageStatData[];
};
