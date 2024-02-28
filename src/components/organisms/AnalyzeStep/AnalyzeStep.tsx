import { FunctionComponent, useEffect, useState } from 'react';

import Text from '@/components/atoms/Text';
import StepSection from '@/components/molecules/StepSection';
import styles from '@/components/organisms/AnalyzeStep/AnalyzeStep.module.css';
import { PackageIngestResult } from '@/hooks/usePackageIngest';
import useDependencyStats from '@/hooks/useDependencyStats';
import useRegistryLookup from '@/hooks/useRegistryLookup';
import useEffectDebounced from '@/hooks/useEffectDebounced';
import JsonDownloadButton from '@/components/molecules/JsonDownloadButton';
import { PackageStatData } from '@/types';

import AnalyzeTable from './AnalyzeTable';

export type AnalyzeStepProps = {
  className?: string;
  ingest: PackageIngestResult;
  registryUrl: string;
};
const AnalyzeStep: FunctionComponent<AnalyzeStepProps> = ({
  className,
  ingest,
  registryUrl,
}) => {
  const lookup = useRegistryLookup({ registryUrl });
  const stats = useDependencyStats({ source: lookup.results });
  const [data, setData] = useState<PackageStatData[]>([]);

  useEffect(() => {
    // Keeping the old data so that page won't jumpt on every small json change
    // using auto process mode
    if ((stats?.data.length || 0) < 1) return;
    setData(stats.data);
  }, [stats?.data]);

  useEffectDebounced(
    () => {
      void lookup.lookup(ingest?.isValid ? ingest?.dependencies : []);
    },
    200,
    [ingest],
  );

  return (
    <StepSection
      className={className}
      titleAction={data.length ? <JsonDownloadButton data={data} /> : null}
      title="Check the results">
      <AnalyzeTable
        data={data}
        loading={lookup.isFetching}
        emptyFallback={
          <Text className={styles.emptyFallback}>
            Results will be available here once you fill in the package.json.
          </Text>
        }
        loadingFallback={
          lookup.progress && (
            <Text>
              Updating table with the latest data...
              <br />
              {lookup.progress.total} / {lookup.progress.fulfilled}
            </Text>
          )
        }
      />
    </StepSection>
  );
};

export default AnalyzeStep;
