import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateEbsSnapshotCost } from "../../lib/calc/ebsSnapshot";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsEbsSnapshotCostCalculator() {
  const [volumeGb, setVolumeGb] = useNumberParamState("AwsEbsSnapshotCost.volumeGb", 1000);
  const [dailyChangePct, setDailyChangePct] = useNumberParamState("AwsEbsSnapshotCost.dailyChangePct", 2);
  const [retentionDays, setRetentionDays] = useNumberParamState("AwsEbsSnapshotCost.retentionDays", 30);
  const [pricePerGbMonthUsd, setPricePerGbMonthUsd] = useNumberParamState("AwsEbsSnapshotCost.pricePerGbMonthUsd", 0.05);

  const result = useMemo(() => {
    return estimateEbsSnapshotCost({
      volumeGb: clamp(volumeGb, 0, 1e12),
      dailyChangePct: clamp(dailyChangePct, 0, 100),
      retentionDays: clamp(retentionDays, 0, 3650),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e6),
    });
  }, [volumeGb, dailyChangePct, retentionDays, pricePerGbMonthUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Volume size (GB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={volumeGb}
              min={0}
              step={1}
              onChange={(e) => setVolumeGb(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Daily change rate (%)</div>
            <input
              type="number"
              inputMode="decimal"
              value={dailyChangePct}
              min={0}
              max={100}
              step={0.1}
              onChange={(e) => setDailyChangePct(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Retention (days)</div>
            <input
              type="number"
              inputMode="numeric"
              value={retentionDays}
              min={0}
              step={1}
              onChange={(e) => setRetentionDays(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Snapshot storage price ($ / GB-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerGbMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerGbMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setVolumeGb(1000);
                  setDailyChangePct(2);
                  setRetentionDays(30);
                  setPricePerGbMonthUsd(0.05);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              This is a simplified steady-state estimate for planning. Snapshot storage is incremental, but real behavior
              depends on change patterns, deletes, compaction, and service specifics.
            </div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Results</h3>
        <div className="kpis">
          <div className="kpi">
            <div className="k">Estimated snapshot stored volume</div>
            <div className="v">{formatNumber(result.estimatedStoredGb, 0)} GB</div>
          </div>
          <div className="kpi">
            <div className="k">Estimated monthly snapshot storage cost</div>
            <div className="v">{formatCurrency2(result.estimatedMonthlyCostUsd)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

