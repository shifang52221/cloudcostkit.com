import React, { useMemo, useState } from "react";
import { estimateRoute53Cost } from "../../lib/calc/route53";
import { formatCurrency2, formatNumber } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsRoute53CostCalculator() {
  const [hostedZones, setHostedZones] = useState(20);
  const [standardQueriesPerMonth, setStandardQueriesPerMonth] = useState(500_000_000);
  const [healthChecks, setHealthChecks] = useState(10);

  const [pricePerHostedZoneUsdPerMonth, setPricePerHostedZoneUsdPerMonth] = useState(0.5);
  const [pricePerMillionQueriesUsd, setPricePerMillionQueriesUsd] = useState(0.4);
  const [pricePerHealthCheckUsdPerMonth, setPricePerHealthCheckUsdPerMonth] = useState(0.5);

  const result = useMemo(() => {
    return estimateRoute53Cost({
      hostedZones: clamp(hostedZones, 0, 1e9),
      standardQueriesPerMonth: clamp(standardQueriesPerMonth, 0, 1e18),
      healthChecks: clamp(healthChecks, 0, 1e9),
      pricePerHostedZoneUsdPerMonth: clamp(pricePerHostedZoneUsdPerMonth, 0, 1e9),
      pricePerMillionQueriesUsd: clamp(pricePerMillionQueriesUsd, 0, 1e9),
      pricePerHealthCheckUsdPerMonth: clamp(pricePerHealthCheckUsdPerMonth, 0, 1e9),
    });
  }, [
    hostedZones,
    standardQueriesPerMonth,
    healthChecks,
    pricePerHostedZoneUsdPerMonth,
    pricePerMillionQueriesUsd,
    pricePerHealthCheckUsdPerMonth,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Hosted zones</div>
            <input
              type="number"
              inputMode="numeric"
              value={hostedZones}
              min={0}
              step={1}
              onChange={(e) => setHostedZones(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Standard queries (per month)</div>
            <input
              type="number"
              inputMode="numeric"
              value={standardQueriesPerMonth}
              min={0}
              step={1000}
              onChange={(e) => setStandardQueriesPerMonth(+e.target.value)}
            />
            <div className="hint">Enter your estimated total DNS queries.</div>
          </div>
          <div className="field field-3">
            <div className="label">Health checks</div>
            <input
              type="number"
              inputMode="numeric"
              value={healthChecks}
              min={0}
              step={1}
              onChange={(e) => setHealthChecks(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Price ($ / hosted zone-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerHostedZoneUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerHostedZoneUsdPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / 1M queries)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerMillionQueriesUsd}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerMillionQueriesUsd(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / health check-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerHealthCheckUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerHealthCheckUsdPerMonth(+e.target.value)}
            />
            <div className="hint">Use your effective region pricing.</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setHostedZones(20);
                  setStandardQueriesPerMonth(500_000_000);
                  setHealthChecks(10);
                  setPricePerHostedZoneUsdPerMonth(0.5);
                  setPricePerMillionQueriesUsd(0.4);
                  setPricePerHealthCheckUsdPerMonth(0.5);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              This model estimates hosted zones + standard queries + health checks only. Advanced routing features may add
              line items.
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
            <div className="k">Hosted zones</div>
            <div className="v">{formatCurrency2(result.hostedZoneCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Queries</div>
            <div className="v">{formatCurrency2(result.queryCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Health checks</div>
            <div className="v">{formatCurrency2(result.healthCheckCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Queries/month</div>
            <div className="v">{formatNumber(result.standardQueriesPerMonth, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

