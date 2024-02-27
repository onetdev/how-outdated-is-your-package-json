import Head from 'next/head';
import { FunctionComponent, useState } from 'react';

import StepPackageIngest from '@/components/organisms/StepPackageIngest';
import StepResults from '@/components/organisms/StepAnalyze';
import MainLayout from '@/components/templates/MainLayout';
import { PackageIngestResult } from '@/hooks/usePackageIngest';
import styles from '@/styles/Home.module.css';
import AnimatedBackground from '@/components/atoms/AnimatedBackground';
import config from '@/config';

const Home: FunctionComponent = () => {
  const [ingestResult, setIngestResult] =
    useState<PackageIngestResult | null>();

  return (
    <MainLayout>
      <Head>
        <title>How outdated is your package.json?</title>
        <meta
          name="description"
          content="Probably the best way to tell if you app is using old af packages."
        />
        <link rel="icon" href="/favicon.png" sizes="any" />
      </Head>
      <AnimatedBackground />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            How outdated is your{' '}
            <code className={styles.code}>package.json?</code>
          </h1>

          <div className={styles.intro}>
            <p>
              Maintaining up-to-date dependencies is paramount for ensuring the{' '}
              <strong>
                security, performance, and overall vitality of your project
              </strong>
              .
            </p>
            <p>
              Explore the status of your project effortlessly and avoid being
              the one who delivers a project burdened with outdated
              dependencies. Embrace the power of freshness for a resilient and
              efficient development journey.
            </p>
          </div>
        </div>

        <div className={styles.stepContainer}>
          <StepPackageIngest
            className={styles['stepSection--step1']}
            onData={setIngestResult}
          />
          <StepResults
            className={styles['stepSection--step2']}
            ingest={ingestResult}
            registryUrl={config.registryUrl}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
