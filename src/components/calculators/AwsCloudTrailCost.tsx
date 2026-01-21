import React, { useMemo, useState } from "react";
import { estimateCloudTrailCost } from "../../lib/calc/cloudTrail";
import { formatCurrency2 } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsCloudTrailCostCalculator() {
  const [managementEventsPerMonth, setManagementEventsPerMonth] = useState(50_000_000);
  const [dataEventsPerMonth, setDataEventsPerMonth] = useState(10_000_000);
  const [insightsEventsPerMonth, setInsightsEventsPerMonth] = useState(1_000_000);

  const [pricePer100kManagementEventsUsd, setPricePer100kManagementEventsUsd] = useState(0.1);
  const [pricePer100kDataEventsUsd, setPricePer100kDataEventsUsd] = useState(0.2);
  const [pricePer100kInsightsEventsUsd, setPricePer100kInsightsEventsUsd] = useState(0.35);

  const result = useMemo(() => {
    return estimateCloudTrailCost({
      managementEventsPerMonth: clamp(managementEventsPerMonth, 0, 1e18),
      dataEventsPerMonth: clamp(dataEventsPerMonth, 0, 1e18),
      insightsEventsPerMonth: clamp(insightsEventsPerMonth, 0, 1e18),
      pricePer100kManagementEventsUsd: clamp(pricePer100kManagementEventsUsd, 0, 1e9),
      pricePer100kDataEventsUsd: clamp(pricePer100kDataEventsUsd, 0, 1e9),
      pricePer100kInsightsEventsUsd: clamp(pricePer100kInsightsEventsUsd, 0, 1e9),
    });
  }, [
    managementEventsPerMonth,
    dataEventsPerMonth,
    insightsEventsPerMonth,
    pricePer100kManagementEventsUsd,
    pricePer100kDataEventsUsd,
    pricePer100kInsightsEventsUsd,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Management events (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={managementEventsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setManagementEventsPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Data events (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={dataEventsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setDataEventsPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Insights events (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={insightsEventsPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setInsightsEventsPerMonth(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Management price ($ / 100k events)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePer100kManagementEventsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePer100kManagementEventsUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Data price ($ / 100k events)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePer100kDataEventsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePer100kDataEventsUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Insights price ($ / 100k events)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePer100kInsightsEventsUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePer100kInsightsEventsUsd(+e.target.value)}
            />
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setManagementEventsPerMonth(50_000_000);
                  setDataEventsPerMonth(10_000_000);
                  setInsightsEventsPerMonth(1_000_000);
                  setPricePer100kManagementEventsUsd(0.1);
                  setPricePer100kDataEventsUsd(0.2);
                  setPricePer100kInsightsEventsUsd(0.35);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              Pricing can vary by region and product features. Use your effective prices.
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
            <div className="k">Management events</div>
            <div className="v">{formatCurrency2(result.managementCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Data events</div>
            <div className="v">{formatCurrency2(result.dataCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Insights events</div>
            <div className="v">{formatCurrency2(result.insightsCostUsd)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

