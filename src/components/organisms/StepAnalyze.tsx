import { FunctionComponent, MouseEventHandler, useEffect } from "react";

import Button from "@/components/atoms/Button";
import Text from "@/components/atoms/Text";
import ProgressBar from "@/components/molecules/ProgressBar";
import StepSection from "@/components/molecules/StepSection";
import { PackageParserResult } from "@/hooks/usePackageParser";
import useRegistryLookup from "@/hooks/useRegistryLookup";
import { PackageLookupResult } from "@/types";

type StepAnalyzeProps = {
  className?: string;
  onResults: (results?: PackageLookupResult[]) => void;
  packageMeta?: PackageParserResult;
  registryUrl: string;
};
const Home: FunctionComponent<StepAnalyzeProps> = ({
  className,
  registryUrl,
  packageMeta: { dependencies, skipped },
  onResults,
}) => {
  const lookup = useRegistryLookup({ dependencies, registryUrl });

  useEffect(() => {
    onResults(lookup.results);
  }, [lookup.results, onResults]);

  const handleFetchStart: MouseEventHandler<HTMLButtonElement> = () =>
    lookup.lookup();

  return (
    <StepSection className={className} title="2. Analyze">
      {dependencies.length < 1 && <p>Complete the previous step first.</p>}
      {dependencies.length > 0 && (
        <div>
          {lookup.progress.total > 0 && (
            <ProgressBar
              total={lookup.progress.total}
              current={lookup.progress.fulfilled}
            />
          )}
          <p>
            Found {dependencies.length} dependencies of which{" "}
            <strong>{dependencies.filter((item) => item.isDev).length}</strong>{" "}
            is dev while{" "}
            <strong>{dependencies.filter((item) => !item.isDev).length}</strong>{" "}
            is regular. Press <strong>start</strong> to see the magic.
          </p>
        </div>
      )}
      {skipped > 0 && (
        <p>
          <Text size="small">
            We had to skip {skipped} packages due to failign semver
            verification, this usually only affects ssh+https and path packages.
          </Text>
        </p>
      )}
      <Button
        onClick={handleFetchStart}
        disabled={!dependencies.length || lookup.isFetching}
      >
        Start
      </Button>
    </StepSection>
  );
};

export default Home;
