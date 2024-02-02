import Head from "next/head";
import { FunctionComponent, useState } from "react";

import StepAnalyze from "@/components/organisms/StepAnalyze";
import StepPackage from "@/components/organisms/StepPackage";
import StepResults from "@/components/organisms/StepResults";
import MainLayout from "@/components/templates/MainLayout";
import usePackageParser from "@/hooks/usePackageParser";
import usePackageStats from "@/hooks/usePackageStats";
import styles from "@/styles/Home.module.css";
import { PackageLookupResult } from "@/types";
import AnimatedBackground from "@/components/atoms/AnimatedBackground";

const REGISTRY_URL = "https://registry.npmjs.org";
const Home: FunctionComponent = () => {
  const [inputRaw, setInputRaw] = useState<string | null>(null);
  const [lookupData, setLookupData] = useState<PackageLookupResult[] | null>();
  const parsedPackage = usePackageParser({ input: inputRaw });
  const statData = usePackageStats({ source: lookupData });

  return (
    <MainLayout>
      <Head>
        <title>How outdated is your package.json?</title>
        <meta
          name="description"
          content="Probably the best way to tell if you app is using old af packages."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AnimatedBackground />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            How outdated is your{" "}
            <code className={styles.code}>package.json?</code>
          </h1>

          <div className={styles.intro}>
            We&#8217;ve all been there: &#8220;Don&#8217;t touch if it
            works&#8221;. But how depressingly outdated is your project really?
            Wait no more! I am here to let you know and it might even help you
            to convince your PM, PO, LD, TC, WTH to actually allocate time for
            upgrading.
          </div>
        </div>

        <div className={styles.stepContainer}>
          <StepPackage
            className={styles["stepSection--step1"]}
            onChange={setInputRaw}
          />
          <StepAnalyze
            className={styles["stepSection--step2"]}
            onResults={setLookupData}
            packageMeta={parsedPackage}
            registryUrl={REGISTRY_URL}
          />
          <StepResults
            className={styles["stepSection--step3"]}
            data={statData?.data}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;
