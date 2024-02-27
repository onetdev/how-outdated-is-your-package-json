import {
  ChangeEventHandler,
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { styled } from 'styled-components';
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
  const [value, setValue] = useState<string>('');
  const [autoMode, setAutoMode] = useState<boolean>(false);
  const { result, tryParse } = usePackageIngest({ input: value });
  const dummyPackage = useMemo(() => JSON.stringify(dummy, null, 2), []);
  const hasDummyPopulated = dummyPackage === value;

  useEffect(() => {
    if (!result.isValid) return;

    const { total, skipped } = result.counters;
    logger.info(
      `Updating parent with parsed package.json [${total} deps, ${skipped} skipped]`,
    );
    onData(result);
  }, [logger, onData, result]);

  const handleManualSubmit = () => tryParse();
  const handleChangeText: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setValue(e.target.value);
    if (autoMode) {
      tryParse();
    }
  };
  const handleDummyFill: MouseEventHandler<HTMLButtonElement> = () => {
    if (!$input.current) return;

    logger.info('Filling with dummy data...');
    $input.current.value = dummyPackage;
    setValue(dummyPackage);
  };

  return (
    <StepSection
      className={className}
      title={
        <>
          You paste your <code>package.json</code> here
        </>
      }>
      <InputWrap>
        <TextArea
          forwardRef={$input}
          placeholder={`{"todo":"Put your package.json here"}`}
          rows={16}
          onChange={handleChangeText}
        />
        {!hasDummyPopulated && (
          <DummyButtonWrap>
            <Button size="normal" variant="rainbow" onClick={handleDummyFill}>
              <WandIcon size={'1rem'} />
              &nbsp; Use demo <code>package.json</code>
            </Button>
          </DummyButtonWrap>
        )}
      </InputWrap>
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
      {!autoMode && (
        <Button size="normal" variant="rainbow" onClick={handleManualSubmit}>
          Analyze!
        </Button>
      )}
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

const InputWrap = styled.div`
  width: 100%;
  position: relative;
`;
const DummyButtonWrap = styled.div`
  position: absolute;
  right: 0.75rem;
  bottom: 1rem;
  white-space: nowrap;
`;

export default StepPackageIngest;
