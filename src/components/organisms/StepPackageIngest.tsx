import {
  ChangeEventHandler,
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { WandIcon } from 'lucide-react';

import dummy from '@/assets/dummy-package.json';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import TextArea from '@/components/atoms/TextArea';
import StepSection from '@/components/molecules/StepSection';
import globalStyles from '@/styles/Global.module.css';
import usePackageIngest, {
  PackageIngestResult,
} from '@/hooks/usePackageIngest';
import useLogger from '@/hooks/useLogger';
import LoadingIndacator from '@/components/atoms/LoadingIndicator';

import styles from './StepPackageIngest.module.css';

export type StepPackageIngestProps = {
  className?: string;
  onData: (data: PackageIngestResult) => void;
};
const StepPackageIngest: FunctionComponent<StepPackageIngestProps> = ({
  className,
  onData,
}) => {
  const logger = useLogger({ scope: 'StepPackageIngest' });
  const $input = useRef<HTMLTextAreaElement>(null);
  const [autoMode, setAutoMode] = useState<boolean>(false);
  const { result, tryParse } = usePackageIngest();
  const dummyPackage = useMemo(() => JSON.stringify(dummy, null, 2), []);
  const hasDummyPopulated = dummyPackage === $input.current?.value;

  useEffect(() => {
    if (!result.isValid) return;

    const { total, skipped } = result.counters;
    logger.info(
      `Updating parent with parsed package.json [${total} deps, ${skipped} skipped]`,
    );
    onData(result);
  }, [logger, onData, result]);

  const getValue = () => $input.current?.value || '';
  const handleManualSubmit = () => tryParse(getValue());
  const handleChangeText: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    console.log('CHANGE TEXT', e.target.value);
    if (autoMode) {
      tryParse(getValue());
    }
  };
  const handleDummyFill: MouseEventHandler<HTMLButtonElement> = () => {
    if (!$input.current) return;

    logger.info('Filling with dummy data...');
    $input.current.value = dummyPackage;
    if (autoMode) {
      tryParse(dummyPackage);
    }
  };

  return (
    <StepSection
      className={className}
      title={
        <>
          You paste your <code>package.json</code> here
        </>
      }>
      <div className={styles.inputWrap}>
        {getValue().length > 0 && !result.isValid && (
          <div className={styles.invalidJson}>⚠️ Invalid JSON</div>
        )}
        <TextArea
          forwardRef={$input}
          placeholder={`{"todo":"Put your package.json here"}`}
          rows={16}
          onChange={handleChangeText}
        />
        {!hasDummyPopulated && (
          <div className={styles.dummyButtonWrap}>
            <Button size="normal" variant="rainbow" onClick={handleDummyFill}>
              <WandIcon size={'1rem'} />
              &nbsp; Use demo <code>package.json</code>
            </Button>
          </div>
        )}
      </div>
      <div className={styles.actionContainer}>
        {autoMode && (
          <Button size="normal" variant="rainbow" disabled>
            <LoadingIndacator />
          </Button>
        )}
        {!autoMode && (
          <Button size="normal" variant="rainbow" onClick={handleManualSubmit}>
            Analyze!
          </Button>
        )}
        <label>
          <input
            type="checkbox"
            name="autoMode"
            onChange={() => setAutoMode((prev) => !prev)}
            value={autoMode ? '1' : '0'}
            checked={autoMode}
          />
          Auto process
        </label>
      </div>
      <p>
        <Text size="small">
          The website extracts{' '}
          <code className={globalStyles.code}>dependencies</code> and{' '}
          <code className={globalStyles.code}>devDependencies</code> from any
          valid json object while removing semver incompatible version locks
          (thus removing https/ssh/path packages).{' '}
          <strong>
            Don&#8217;t worry, we don&#8217;t store your{' '}
            <code className={globalStyles.code}>package.json</code> and only
            query package manifests from the remote registry.
          </strong>
        </Text>
      </p>
    </StepSection>
  );
};

export default StepPackageIngest;
