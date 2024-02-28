import { coerce, valid } from 'semver';

import { DependencyEntry } from '@/types';

const sanitizeDependencyArray = (
  items: Record<string, string>,
  isDev = false,
): DependencyEntry[] =>
  Object.entries(items)
    .filter(([, target]) => valid(coerce(target)))
    .map(([name, target]) => ({ name, targetVersion: target, isDev }));

export default sanitizeDependencyArray;
