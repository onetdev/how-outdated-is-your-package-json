import { Dayjs } from 'dayjs';

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
  isDev: boolean;
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
  | 'maxSatisfiedAge'
  | 'latestAge'
  | 'upgradeAgeDiff';
export type PackageStat = {
  counters: { total: number; dev: number; nonDev: number };
  data: PackageStatData[];
};

// More info: https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md
export type NpmRegistryPackageVersion = {
  _id: string;
  _npmUser: { name: string; email: string };
  _npmVersion: string;
  author: { name?: string; email?: string; url?: string };
  dependencies: Record<string, string>;
  description: string;
  devDependencies: Record<string, string>;
  dist: { shasum: string; tarball: string };
  homepage: string;
  license: string;
  maintainers: { name?: string; email?: string; url?: string }[];
  name: string;
  readme: string;
  readmeFilename: string;
  repository: { type: string; url: string };
  scripts: Record<string, string>;
  version: string;
};

export type NpmRegistryApiResponse = {
  _attachments: string;
  _id: string;
  _rev: string;
  'dist-tags': Record<'latest' | string, string>;
  author: { name?: string; email?: string; url?: string };
  authors: { name?: string; email?: string; url?: string }[];
  bugs: { url: string };
  description: string;
  homepage: string;
  keywords: string[];
  license: string;
  name: string;
  readme: string;
  readmeFilename: string;
  repository: { type: string; url: string };
  time: Record<string, string>;
  users: Record<string, boolean>;
  versions: Record<string, NpmRegistryPackageVersion>;
};
