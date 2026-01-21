import React, { useMemo, useState } from "react";
import { estimateEbsCost } from "../../lib/calc/ebs";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsEbsCostCalculator() {
  const [storageGb, setStorageGb] = useState(500);
  const [pricePerGbMonthUsd, setPricePerGbMonthUsd] = useState(0.08);

  const [provisionedIops, setProvisionedIops] = useState(6000);
  const [pricePerIopsMonthUsd, setPricePerIopsMonthUsd] = useState(0.005);

  const [provisionedThroughputMbps, setProvisionedThroughputMbps] = useState(250);
  const [pricePerMbpsMonthUsd, setPricePerMbpsMonthUsd] = useState(0.04);

  const result = useMemo(() => {
    return estimateEbsCost({
      storageGb: clamp(storageGb, 0, 1e12),
      pricePerGbMonthUsd: clamp(pricePerGbMonthUsd, 0, 1e3),
      provisionedIops: clamp(provisionedIops, 0, 1e9),
      pricePerIopsMonthUsd: clamp(pricePerIopsMonthUsd, 0, 1e3),
      provisionedThroughputMbps: clamp(provisionedThroughputMbps, 0, 1e9),
      pricePerMbpsMonthUsd: clamp(pricePerMbpsMonthUsd, 0, 1e3),
    });
  }, [
    storageGb,
    pricePerGbMonthUsd,
    provisionedIops,
    pricePerIopsMonthUsd,
    provisionedThroughputMbps,
    pricePerMbpsMonthUsd,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
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
            <div className="label">Provisioned IOPS (IOPS-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={provisionedIops}
              min={0}
              step={1}
              onChange={(e) => setProvisionedIops(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">IOPS price ($ / IOPS-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerIopsMonthUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePerIopsMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Provisioned throughput (MB/s-month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={provisionedThroughputMbps}
              min={0}
              step={1}
              onChange={(e) => setProvisionedThroughputMbps(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Throughput price ($ / MB/s-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMbpsMonthUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerMbpsMonthUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStorageGb(500);
                  setPricePerGbMonthUsd(0.08);
                  setProvisionedIops(6000);
                  setPricePerIopsMonthUsd(0.005);
                  setProvisionedThroughputMbps(250);
                  setPricePerMbpsMonthUsd(0.04);
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
            <div className="k">Storage</div>
            <div className="v">{formatCurrency2(result.storageCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Provisioned IOPS</div>
            <div className="v">{formatCurrency2(result.iopsCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Provisioned throughput</div>
            <div className="v">{formatCurrency2(result.throughputCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">IOPS-month</div>
            <div className="v">{formatNumber(result.provisionedIops, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">MB/s-month</div>
            <div className="v">{formatNumber(result.provisionedThroughputMbps, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

