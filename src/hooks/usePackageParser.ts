import { useEffect, useState } from "react";

import { DependencyEntry } from "@/types";
import sanitizeDependencyArray from "@/utils/sanitizeDependencyArray";

type PackageParserProps = {
  input: string | null;
};

const usePackageParser = ({ input }: PackageParserProps) => {
  const [dependencies, setDependencies] = useState<DependencyEntry[]>([]);

  useEffect(() => {
    try {
      const parsed = JSON.parse(input || "{}");
      setDependencies([
        ...sanitizeDependencyArray(parsed.dependencies || {}),
        ...sanitizeDependencyArray(parsed.devDependencies || {}, true),
      ]);
    } catch (error) {
      console.error("Hmm, something is fishy with this input.", error);
    }
  }, [input]);

  return {
    dependencies,
  };
};

export default usePackageParser;
