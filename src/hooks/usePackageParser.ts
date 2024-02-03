import { useEffect, useState } from "react";

import { DependencyEntry } from "@/types";
import sanitizeDependencyArray from "@/utils/sanitizeDependencyArray";

export type PackageParserProps = {
  input: string | null;
};
export type PackageParserResult = {
  dependencies: DependencyEntry[];
  skipped: number;
};
const usePackageParser = ({
  input,
}: PackageParserProps): PackageParserResult => {
  const [dependencies, setDependencies] = useState<DependencyEntry[]>([]);
  const [skipped, setSkipped] = useState<number>(0);

  useEffect(() => {
    try {
      const parsed = JSON.parse(input || "{}");
      const depsRaw = parsed.dependencies || {};
      const devDepsRaw = parsed.devDependencies || {};
      const deps = sanitizeDependencyArray(depsRaw);
      const devDeps = sanitizeDependencyArray(devDepsRaw, true);
      setDependencies([...deps, ...devDeps]);
      setSkipped(
        Object.keys({ ...depsRaw, ...devDepsRaw }).length -
          deps.length -
          devDeps.length,
      );
    } catch (error) {
      setDependencies([]);
      setSkipped(0);
      console.error("Hmm, something is fishy with this input.", error);
    }
  }, [input]);

  return {
    dependencies,
    skipped,
  };
};

export default usePackageParser;
