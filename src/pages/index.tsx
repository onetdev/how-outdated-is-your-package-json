import Head from "next/head";
import DataTable, { TableColumn } from "react-data-table-component";
import {
  ChangeEventHandler,
  FunctionComponent,
  MouseEventHandler,
  useState,
} from "react";

import styles from "@/styles/Home.module.css";
import usePackageParser from "@/hooks/usePackageParser";
import useRegistryLookup from "@/hooks/useRegistryLookup";
import usePackageStats from "@/hooks/usePackageStats";
import { AgeInSeconds, PackageStatData } from "@/types";
import dayjs from "@/utils/date";

const REGISTRY_URL = "https://registry.npmjs.org";
const Home: FunctionComponent = () => {
  const [inputRaw, setInputRaw] = useState<string | null>(null);
  const { dependencies } = usePackageParser({ input: inputRaw });
  const lookup = useRegistryLookup({ dependencies, registryUrl: REGISTRY_URL });
  const stats = usePackageStats({ source: lookup.results });

  const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    setInputRaw(event.target.value);
  };

  const handleFetchStart: MouseEventHandler<HTMLButtonElement> = () =>
    lookup.lookup();

  const humanizeAge = (age: AgeInSeconds) =>
    dayjs.duration(age, "seconds").humanize(false);

  const statColumns: TableColumn<PackageStatData>[] = [
    {
      name: "Package",
      selector: (a) => a.package,
      sortable: true,
      grow: 2,
      format: (a) => (
        <a
          href={`https://www.npmjs.com/package/${a.package}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {a.package}
        </a>
      ),
    },
    { name: "Target version", selector: (a) => a.targetVersion, compact: true },
    {
      name: "The maximum you allow",
      selector: (a) => a.maxSatisfiedDate.format(),
      format: (a) => (
        <>
          {a.maxSatisfiedVersion}
          <br />
          {a.maxSatisfiedDate.format("l")}
        </>
      ),
    },
    {
      name: "It could be",
      selector: (a) => a.latestDate.format(),
      format: (a) => (
        <>
          {a.latestVersion}
          <br />
          {a.latestDate.format("l")}
        </>
      ),
    },
    {
      name: "Youngest allowed",
      selector: (a) => a.maxSatisfiedAge,
      sortable: true,
      format: (a) => humanizeAge(a.maxSatisfiedAge),
    },
    {
      name: "Youngest possible",
      selector: (a) => a.latestAge,
      sortable: true,
      format: (a) => humanizeAge(a.latestAge),
    },
    {
      name: "How far from latest",
      selector: (a) => a.upgradeAgeDiff,
      sortable: true,
      format: (a) =>
        a.upgradeAgeDiff ? humanizeAge(a.upgradeAgeDiff) : "on the latest",
    },
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>How old is my package.json?</title>
        <meta
          name="description"
          content="Probably the best way to tell if you app is using old af packages."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          How old is my <code>package.json?</code>
        </h1>

        <p className={styles.description}>
          We&#8217;ve all been there: &#8220;Don&#8217;t touch if it
          works&#8221;. But how depressingly outdated is your project really?
          Wait no more! I am here to let you know and it might even help you to
          convince your PM, PO, LD, TC, WTH to actually allocate time for
          upgrading.
        </p>

        <div className={styles.stepContainer}>
          <section className={styles.stepSection}>
            <h2>1. step</h2>
            <h3>
              Put your package in here. Don&#8217;t worry, we don&#8217;t store
              your <code>package.json</code>.
            </h3>
            <p>
              Dev and regular dependencies will be extracted alongside version
              targets, based on that we will get all the package manifests and
              perform live magic on top of it. Check out the repo on Github for
              more details.
            </p>
            <textarea
              className={styles.jsonInput}
              onChange={handleInputChange}
            ></textarea>
          </section>

          <section className={styles.stepSection}>
            <h2>2. step</h2>
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
              Please note that packages with invalid version targets are
              removed.
            </p>
            <button
              onClick={handleFetchStart}
              disabled={!dependencies.length || lookup.isFetching}
            >
              Start
            </button>
          </section>

          <section className={styles.stepSection}>
            <h2>3. step</h2>
            <p>Check out your freshly baked results</p>
            {stats?.counters?.total > 0 && (
              <DataTable columns={statColumns} data={stats.data} />
            )}
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <a href="https://onet.dev" target="_blank" rel="noopener noreferrer">
          Jozsef Koller
        </a>
        <a
          href="https://buymeacoffee.com/onetdev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sponsor my addiction
        </a>
      </footer>
    </div>
  );
};

export default Home;
