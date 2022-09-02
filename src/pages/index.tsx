import { clsx } from "clsx";
import Head from "next/head";
import {
  ChangeEventHandler,
  FunctionComponent,
  MouseEventHandler,
  useRef,
  useState,
} from "react";

import dummy from "@/assets/dummy-package.json";
import Button from "@/components/atoms/Button";
import TextArea from "@/components/atoms/TextArea";
import StatTable from "@/components/organisms/StatTable";
import MainLayout from "@/components/templates/MainLayout";
import usePackageParser from "@/hooks/usePackageParser";
import usePackageStats from "@/hooks/usePackageStats";
import useRegistryLookup from "@/hooks/useRegistryLookup";
import styles from "@/styles/Home.module.css";

const REGISTRY_URL = "https://registry.npmjs.org";

const Home: FunctionComponent = () => {
  const $input = useRef<HTMLTextAreaElement>(null);
  const [inputRaw, setInputRaw] = useState<string | null>(null);
  const { dependencies } = usePackageParser({ input: inputRaw });
  const lookup = useRegistryLookup({ dependencies, registryUrl: REGISTRY_URL });
  const stats = usePackageStats({ source: lookup.results });

  const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setInputRaw(event.target.value);
  };
  const handleDummyFill: MouseEventHandler<HTMLButtonElement> = () => {
    if (!$input.current) {
      return;
    }
    const json = JSON.stringify(dummy, null, 2);
    $input.current.value = json;
    setInputRaw(json);
  };

  const handleFetchStart: MouseEventHandler<HTMLButtonElement> = () =>
    lookup.lookup();

  return (
    <MainLayout>
      <Head>
        <title>How old is my package.json?</title>
        <meta
          name="description"
          content="Probably the best way to tell if you app is using old af packages."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className={styles.title}>
        How old is my <code className={styles.code}>package.json?</code>
      </h1>

      <p className={styles.description}>
        We&#8217;ve all been there: &#8220;Don&#8217;t touch if it works&#8221;.
        But how depressingly outdated is your project really? Wait no more! I am
        here to let you know and it might even help you to convince your PM, PO,
        LD, TC, WTH to actually allocate time for upgrading.
      </p>

      <div className={styles.stepContainer}>
        <section
          className={clsx(styles.stepSection, styles["stepSection--step1"])}
        >
          <h2>
            1. Providing <code>package.json</code>
          </h2>
          <div className={styles.jsonInput}>
            <TextArea
              forwardRef={$input}
              onChange={handleInputChange}
              placeholder={`{"todo":"Put your package.json here"}`}
              rows={16}
            />
            <Button
              size="small"
              variant="secondary"
              className={styles.jsonDummyButton}
              onClick={handleDummyFill}
            >
              Use demo <code>package.json</code>
            </Button>
          </div>
          <p className={styles.sectionDislaimer}>
            <small>
              The website extracts{" "}
              <code className={styles.code}>dependencies</code> and{" "}
              <code className={styles.code}>devDependencies</code> from any
              valid json object while removing semver incompatible version locks
              (thus removing https/ssh/path packages).{" "}
              <strong>
                Don&#8217;t worry, we don&#8217;t store your{" "}
                <code className={styles.code}>package.json</code> and only query
                package manifests from the remote registry.
              </strong>
            </small>
          </p>
        </section>

        <section
          className={clsx(styles.stepSection, styles["stepSection--step2"])}
        >
          <h2>2. Analyze</h2>
          {dependencies.length > 0 && (
            <h3>
              Found {dependencies.length} dependencies of which{" "}
              <strong>
                {dependencies.filter((item) => item.isDev).length}
              </strong>{" "}
              is dev while{" "}
              <strong>
                {dependencies.filter((item) => !item.isDev).length}
              </strong>{" "}
              is regular. Press <strong>start</strong> to see the magic.
            </h3>
          )}
          <p>
            Please note that packages with invalid version targets are removed.
          </p>
          <Button
            onClick={handleFetchStart}
            disabled={!dependencies.length || lookup.isFetching}
          >
            Start
          </Button>
        </section>

        <section
          className={clsx(styles.stepSection, styles["stepSection--step3"])}
        >
          <h2>3. Results</h2>
          {lookup.isFetching && (
            <p>
              Something is cooking, are you ready? We&#8217;ve already fetched{" "}
              {lookup.progress.fulfilled} out of {lookup.progress.total}{" "}
              packages.
            </p>
          )}
          {!lookup.isFetching && (
            <p>
              Check out your freshly baked results... right after you clicked on
              start.
            </p>
          )}
          {stats?.counters?.total > 0 && <StatTable data={stats.data} />}
        </section>
      </div>
    </MainLayout>
  );
};

export default Home;
