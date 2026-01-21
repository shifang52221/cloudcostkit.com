import React, { useMemo, useState } from "react";
import { estimateCloudwatchAlarmsCost } from "../../lib/calc/cloudwatchAlarms";
import { formatCurrency2 } from "../../lib/format";
import { clamp } from "../../lib/math";

export function AwsCloudwatchAlarmsCostCalculator() {
  const [standardAlarms, setStandardAlarms] = useState(500);
  const [highResAlarms, setHighResAlarms] = useState(50);
  const [compositeAlarms, setCompositeAlarms] = useState(20);

  const [pricePerStandardAlarmUsdPerMonth, setPricePerStandardAlarmUsdPerMonth] = useState(0.1);
  const [pricePerHighResAlarmUsdPerMonth, setPricePerHighResAlarmUsdPerMonth] = useState(0.3);
  const [pricePerCompositeAlarmUsdPerMonth, setPricePerCompositeAlarmUsdPerMonth] = useState(0.5);

  const result = useMemo(() => {
    return estimateCloudwatchAlarmsCost({
      standardAlarms: clamp(standardAlarms, 0, 1e9),
      highResAlarms: clamp(highResAlarms, 0, 1e9),
      compositeAlarms: clamp(compositeAlarms, 0, 1e9),
      pricePerStandardAlarmUsdPerMonth: clamp(pricePerStandardAlarmUsdPerMonth, 0, 1e9),
      pricePerHighResAlarmUsdPerMonth: clamp(pricePerHighResAlarmUsdPerMonth, 0, 1e9),
      pricePerCompositeAlarmUsdPerMonth: clamp(pricePerCompositeAlarmUsdPerMonth, 0, 1e9),
    });
  }, [
    standardAlarms,
    highResAlarms,
    compositeAlarms,
    pricePerStandardAlarmUsdPerMonth,
    pricePerHighResAlarmUsdPerMonth,
    pricePerCompositeAlarmUsdPerMonth,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Standard alarms</div>
            <input
              type="number"
              inputMode="numeric"
              value={standardAlarms}
              min={0}
              step={1}
              onChange={(e) => setStandardAlarms(+e.target.value)}
            />
            <div className="hint">Typical 1-minute period alarms.</div>
          </div>
          <div className="field field-3">
            <div className="label">High-resolution alarms</div>
            <input
              type="number"
              inputMode="numeric"
              value={highResAlarms}
              min={0}
              step={1}
              onChange={(e) => setHighResAlarms(+e.target.value)}
            />
            <div className="hint">Alarms that evaluate on shorter periods.</div>
          </div>
          <div className="field field-3">
            <div className="label">Composite alarms</div>
            <input
              type="number"
              inputMode="numeric"
              value={compositeAlarms}
              min={0}
              step={1}
              onChange={(e) => setCompositeAlarms(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Price ($ / standard alarm-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerStandardAlarmUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerStandardAlarmUsdPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / high-res alarm-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerHighResAlarmUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerHighResAlarmUsdPerMonth(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Price ($ / composite alarm-month)</div>
            <input
              type="number"
              inputMode="decimal"
              value={pricePerCompositeAlarmUsdPerMonth}
              min={0}
              step={0.001}
              onChange={(e) => setPricePerCompositeAlarmUsdPerMonth(+e.target.value)}
            />
            <div className="hint">Use your effective region pricing.</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setStandardAlarms(500);
                  setHighResAlarms(50);
                  setCompositeAlarms(20);
                  setPricePerStandardAlarmUsdPerMonth(0.1);
                  setPricePerHighResAlarmUsdPerMonth(0.3);
                  setPricePerCompositeAlarmUsdPerMonth(0.5);
                }}
              >
                Reset example
              </button>
            </div>
            <div className="muted" style={{ marginTop: 8, fontSize: 12 }}>
              This estimates alarm charges only. Metric ingestion, dashboards, and notifications can be additional line
              items.
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
            <div className="k">Standard alarms</div>
            <div className="v">{formatCurrency2(result.standardCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">High-resolution alarms</div>
            <div className="v">{formatCurrency2(result.highResCostUsd)}</div>
          </div>
          <div className="kpi">
            <div className="k">Composite alarms</div>
            <div className="v">{formatCurrency2(result.compositeCostUsd)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

