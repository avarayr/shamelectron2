import { core } from "@/lib/core";
import APPS from "@/lib/apps";
import { FixedStatus, type AppRecord } from "@/types";
import { AppGrid } from "@/components/app-grid";

// This function runs only at build time on the server
async function getStaticAppsData(): Promise<AppRecord[]> {
  console.log("Starting build-time data generation...");

  const current = await core.getAllApps();
  const refreshIds: string[] = [];

  if (!process.env.NO_UPDATE) {
    for (const meta of APPS) {
      const status = current.get(meta.id);
      // no need to refresh if already fixed
      if (status?.isFixed === FixedStatus.FIXED) {
        continue;
      }
      const isUnknown = status?.isFixed === FixedStatus.UNKNOWN;

      const isStale = status?.lastChecked
        ? core.isStale(status.lastChecked)
        : true;

      if (isUnknown || isStale) {
        console.log(`[QUEUED] Refreshing status for ${meta.friendlyName}...`);
        refreshIds.push(meta.id);
      }
    }

    if (refreshIds.length > 0) {
      console.log(
        `Running ${refreshIds.length} app status refreshes in worker pool...`
      );

      // Ensure Worker API exists (Bun). If not, fall back to sequential.
      if (typeof Worker === "undefined") {
        console.warn(
          "Worker is undefined in this runtime. Falling back to sequential checks."
        );
        for (const id of refreshIds) {
          try {
            const meta = APPS.find((a) => a.id === id);
            if (!meta) continue;
            const fixed = await meta.checkIsFixed();
            await core.setIsFixed(id, fixed);
            console.log(`[SUCCESS] ${id} status: ${fixed}`);
          } catch (err) {
            console.error(`[ERROR] Failed to check ${id}:`, err);
            await core.setIsFixed(id, FixedStatus.UNKNOWN);
          }
        }
        console.log("App status refreshes complete.");
      } else {
        // Worker pool sized to CPU cores (Bun exposes this via navigator or falls back)
        const poolSize = Math.max(
          1,
          (globalThis as any).navigator?.hardwareConcurrency ?? 4
        );

        // Use absolute file path to avoid bundler path issues
        const workerEntry = `${process.cwd()}/lib/workers/checkApp.worker.ts`;
        console.log(`Spawning ${poolSize} workers with entry: ${workerEntry}`);

        const workers = Array.from(
          { length: poolSize },
          () => new Worker(workerEntry)
        );

        // Each worker consumes from the shared queue until empty
        const queue = [...refreshIds];
        const runWorker = async (worker: Worker, idx: number) => {
          worker.onerror = (e: any) => {
            console.error(`[WORKER ${idx}] error:`, e?.message || e);
          };
          (worker as any).onmessageerror = (e: any) => {
            console.error(`[WORKER ${idx}] messageerror:`, e);
          };

          while (true) {
            const id = queue.shift();
            if (!id) break;
            console.log(`[WORKER ${idx}] processing ${id}...`);
            const result = await new Promise<{
              id: string;
              ok: boolean;
              fixed?: FixedStatus;
              error?: string;
            }>((resolve) => {
              worker.onmessage = (evt: MessageEvent<any>) =>
                resolve(evt.data as any);
              worker.postMessage({ id });
            });
            if (result.ok) {
              await core.setIsFixed(result.id, result.fixed as FixedStatus);
              console.log(
                `[WORKER ${idx}] [SUCCESS] ${result.id} -> ${result.fixed}`
              );
            } else {
              console.error(
                `[WORKER ${idx}] [ERROR] ${result.id}: ${result.error}`
              );
              await core.setIsFixed(result.id, FixedStatus.UNKNOWN);
            }
          }
          worker.terminate();
        };

        await Promise.all(workers.map((w, i) => runWorker(w, i)));
        console.log("App status refreshes complete.");
      }
    } else {
      console.log("All app statuses are fresh. No refreshes needed.");
    }
  } else {
    console.log("Skipping app status refreshes (env NO_UPDATE).");
  }

  // Fetch the final, potentially updated data
  const finalData = await core.computeStaticApps();
  console.log("Build-time data generation complete.");
  return finalData;
}

export default async function HomePage() {
  const apps = await getStaticAppsData();
  apps.sort((a, b) => a.friendlyName.localeCompare(b.friendlyName));
  return <AppGrid apps={apps} />;
}
