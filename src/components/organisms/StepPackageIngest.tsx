import {
  FunctionComponent,
  MouseEventHandler,
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
import styles from '@/styles/Home.module.css';
import usePackageIngest, {
  PackageIngestMetadata,
} from '@/hooks/usePackageIngest';
import useLogger from '@/hooks/useLogger';

export type StepPackageIngestProps = {
  className?: string;
  onData: (data: PackageIngestMetadata) => void;
};
const StepPackageIngest: FunctionComponent<StepPackageIngestProps> = ({
  className,
  onData,
}) => {
  const logger = useLogger({ scope: 'StepPackageIngest' });
  const $input = useRef<HTMLTextAreaElement>(null);
  const [autoMode, setAutoMode] = useState<boolean>(false);
  const parserResult = usePackageIngest({ input: $input.current?.value });
  const dummyPackage = useMemo(() => JSON.stringify(dummy, null, 2), []);
  const hasDummyPopulated = dummyPackage === $input.current?.value;

  const sendData = () => {
    if (!$input.current) return;

    logger.info(
      `Updating parent with parsed package.json [${parserResult.counters.total} deps, ${parserResult.counters.skipped} skipped]`,
    );
    onData(parserResult);
  };

  const handleChange = () => sendData();
  const handleDummyFill: MouseEventHandler<HTMLButtonElement> = () => {
    if (!$input.current) return;

    logger.info('Filling with dummy data...');
    $input.current.value = dummyPackage;
    sendData();
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
          onChange={handleChange}
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
        <Button size="normal" variant="rainbow" onClick={sendData}>
          Analyze!
        </Button>
      )}
      <p>
        <Text size="small">
          The website extracts <code className={styles.code}>dependencies</code>{' '}
          and <code className={styles.code}>devDependencies</code> from any
          valid json object while removing semver incompatible version locks
          (thus removing https/ssh/path packages).{' '}
          <strong>
            Don&#8217;t worry, we don&#8217;t store your{' '}
            <code className={styles.code}>package.json</code> and only query
            package manifests from the remote registry.
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
