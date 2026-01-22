import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateRdsCost } from "../../lib/calc/rds";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsRdsCostCalculator() {
  const [instances, setInstances] = useNumberParamState("AwsRdsCost.instances", 1);
  const [pricePerHourUsd, setPricePerHourUsd] = useNumberParamState("AwsRdsCost.pricePerHourUsd", 0.2);
  const [hoursPerMonth, setHoursPerMonth] = useNumberParamState("AwsRdsCost.hoursPerMonth", 730);

  const [storageGb, setStorageGb] = useNumberParamState("AwsRdsCost.storageGb", 200);
  const [pricePerGbMonthUsd, setPricePerGbMonthUsd] = useNumberParamState("AwsRdsCost.pricePerGbMonthUsd", 0.115);

  const [backupGb, setBackupGb] = useNumberParamState("AwsRdsCost.backupGb", 200);
  const [pricePerBackupGbMonthUsd, setPricePerBackupGbMonthUsd] = useNumberParamState("AwsRdsCost.pricePerBackupGbMonthUsd", 0.095);

  const [ioRequestsPerMonth, setIoRequestsPerMonth] = useNumberParamState("AwsRdsCost.ioRequestsPerMonth", 5_000_000_000);
  const [pricePerMillionIoRequestsUsd, setPricePerMillionIoRequestsUsd] = useNumberParamState("AwsRdsCost.pricePerMillionIoRequestsUsd", 0.2);

  const result = useMemo(() => {
    return estimateRdsCost({
      instances: clamp(instances, 0, 1e6),
      pricePerHourUsd: clamp(pricePerHourUsd, 0, 1e6),
      hoursPerMonth: clamp(hoursPerMonth, 0, 744),
      storageGb: clamp(storageGb, 0, 1e12),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e3),
      backupGb: clamp(backupGb, 0, 1e12),
      pricePerBackupGbMonthUsd: clamp(pricePerBackupGbMonthUsd, 0, 1e3),
      ioRequestsPerMonth: clamp(ioRequestsPerMonth, 0, 1e18),
      pricePerMillionIoRequestsUsd: clamp(pricePerMillionIoRequestsUsd, 0, 1e6),
    });
  }, [
    instances,
    pricePerHourUsd,
    hoursPerMonth,
    storageGb,
    pricePerGbMonthUsd,
    backupGb,
    pricePerBackupGbMonthUsd,
    ioRequestsPerMonth,
    pricePerMillionIoRequestsUsd,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Instances</div>
            <input
              type="number"
              inputMode="numeric"
              value={instances}
              min={0}
              step={1}
              onChange={(e) => setInstances(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / hour / instance)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerHourUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerHourUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Billable hours (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={hoursPerMonth}
              min={0}
              step={1}
              onChange={(e) => setHoursPerMonth(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Storage (GB-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={storageGb}
              min={0}
              step={1}
              onChange={(e) => setStorageGb(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerGbMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Backup storage (GB-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={backupGb}
              min={0}
              step={1}
              onChange={(e) => setBackupGb(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Backup price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerBackupGbMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerBackupGbMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">I/O requests (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={ioRequestsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setIoRequestsPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">I/O price ($ / 1M requests)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionIoRequestsUsd}
              min={0}
              step={0.01}
              onChange={(e) => setPricePerMillionIoRequestsUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setInstances(1);
                  setPricePerHourUsd(0.2);
                  setHoursPerMonth(730);
                  setStorageGb(200);
                  setPricePerGbMonthUsd(0.115);
                  setBackupGb(200);
                  setPricePerBackupGbMonthUsd(0.095);
                  setIoRequestsPerMonth(5_000_000_000);
                  setPricePerMillionIoRequestsUsd(0.2);
                }}
              >
                Reset example
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Estimated monthly total</div>
            <div className="v">{formatCurrency2(result.totalCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Compute</div>
            <div className="v">{formatCurrency2(result.computeCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">DB storage</div>
            <div className="v">{formatCurrency2(result.storageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Backups</div>
            <div className="v">{formatCurrency2(result.backupCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">I/O requests</div>
            <div className="v">{formatCurrency2(result.ioCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">I/O requests (per month)</div>
            <div className="v">{formatNumber(result.ioRequestsPerMonth, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

