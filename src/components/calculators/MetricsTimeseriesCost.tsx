import React, { useMemo, useState } from "react";
import { estimateTimeseriesCost } from "../../lib/calc/metrics";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function MetricsTimeseriesCostCalculator() {
  const [activeSeries, setActiveSeries] = useState(50_000);
  const [pricePerSeriesMonthUsd, setPricePerSeriesMonthUsd] = useState(0.0005);

  const result = useMemo(() => {
    return estimateTimeseriesCost({
      activeSeries: clamp(activeSeries, 0, 1e12),
      pricePerSeriesMonthUsd: clamp(pricePerSeriesMonthUsd, 0, 1e6),
    });
  }, [activeSeries, pricePerSeriesMonthUsd]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Active time series</div>
            <input
              type="number"
              inputMode="numeric"
              value={activeSeries}
              min={0}
              step={100}
              onChange={(e) => setActiveSeries(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / series-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerSeriesMonthUsd}
              min={0}
              step={0.0001}
              onChange={(e) => setPricePerSeriesMonthUsd(+e.target.value)}
            />
            <div className="hint">Providers define “active series” differently; use the definition in your billing docs.</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setActiveSeries(50_000);
                  setPricePerSeriesMonthUsd(0.0005);
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
            <div className="k">Estimated monthly metrics cost</div>
            <div className="v">{formatCurrency2(result.monthlyCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Active series</div>
            <div className="v">{formatNumber(result.activeSeries, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

