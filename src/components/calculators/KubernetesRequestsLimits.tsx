import React, { useMemo, useState } from "react";
import { estimateK8sResources } from "../../lib/calc/k8s";
import { formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function KubernetesRequestsLimitsCalculator() {
  const [pods, setPods] = useState(60);
  const [cpuRequestMillicores, setCpuRequestMillicores] = useState(250);
  const [memRequestMiB, setMemRequestMiB] = useState(512);
  const [cpuLimitMillicores, setCpuLimitMillicores] = useState(500);
  const [memLimitMiB, setMemLimitMiB] = useState(1024);
  const [nodeCpuCores, setNodeCpuCores] = useState(8);
  const [nodeMemGiB, setNodeMemGiB] = useState(32);
  const [nodeAllocatablePct, setNodeAllocatablePct] = useState(90);

  const result = useMemo(() => {
    return estimateK8sResources({
      pods: clamp(pods, 0, 1e8),
      cpuRequestMillicores: clamp(cpuRequestMillicores, 0, 1e9),
      memRequestMiB: clamp(memRequestMiB, 0, 1e12),
      cpuLimitMillicores: clamp(cpuLimitMillicores, 0, 1e9),
      memLimitMiB: clamp(memLimitMiB, 0, 1e12),
      nodeCpuCores: clamp(nodeCpuCores, 0.25, 2048),
      nodeMemGiB: clamp(nodeMemGiB, 0.5, 8192),
      nodeAllocatablePct: clamp(nodeAllocatablePct, 50, 100) / 100,
    });
  }, [
    pods,
    cpuRequestMillicores,
    memRequestMiB,
    cpuLimitMillicores,
    memLimitMiB,
    nodeCpuCores,
    nodeMemGiB,
    nodeAllocatablePct,
  ]);

  return (
    <div className="calc-grid">
      <div className="panel">
        <h3>Inputs</h3>
        <div className="form">
          <div className="field field-3">
            <div className="label">Pods</div>
            <input
              type="number"
              inputMode="numeric"
              value={pods}
              min={0}
              step={1}
              onChange={(e) => setPods(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">CPU request (mCPU / pod)</div>
            <input
              type="number"
              inputMode="numeric"
              value={cpuRequestMillicores}
              min={0}
              step={10}
              onChange={(e) => setCpuRequestMillicores(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Memory request (MiB / pod)</div>
            <input
              type="number"
              inputMode="numeric"
              value={memRequestMiB}
              min={0}
              step={32}
              onChange={(e) => setMemRequestMiB(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">CPU limit (mCPU / pod)</div>
            <input
              type="number"
              inputMode="numeric"
              value={cpuLimitMillicores}
              min={0}
              step={10}
              onChange={(e) => setCpuLimitMillicores(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Memory limit (MiB / pod)</div>
            <input
              type="number"
              inputMode="numeric"
              value={memLimitMiB}
              min={0}
              step={32}
              onChange={(e) => setMemLimitMiB(+e.target.value)}
            />
          </div>

          <div className="field field-3">
            <div className="label">Node CPU (cores)</div>
            <input
              type="number"
              inputMode="decimal"
              value={nodeCpuCores}
              min={0.25}
              step={0.25}
              onChange={(e) => setNodeCpuCores(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Node memory (GiB)</div>
            <input
              type="number"
              inputMode="decimal"
              value={nodeMemGiB}
              min={0.5}
              step={0.5}
              onChange={(e) => setNodeMemGiB(+e.target.value)}
            />
          </div>
          <div className="field field-3">
            <div className="label">Allocatable (%)</div>
            <input
              type="number"
              inputMode="numeric"
              value={nodeAllocatablePct}
              min={50}
              max={100}
              step={1}
              onChange={(e) => setNodeAllocatablePct(+e.target.value)}
            />
            <div className="hint">Reserve capacity for kubelet/daemonsets/overhead.</div>
          </div>

          <div className="field field-6">
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPods(60);
                  setCpuRequestMillicores(250);
                  setMemRequestMiB(512);
                  setCpuLimitMillicores(500);
                  setMemLimitMiB(1024);
                  setNodeCpuCores(8);
                  setNodeMemGiB(32);
                  setNodeAllocatablePct(90);
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
            <div className="k">Total CPU requests</div>
            <div className="v">{formatNumber(result.totalCpuRequestCores, 2)} cores</div>
          </div>
          <div className="kpi">
            <div className="k">Total memory requests</div>
            <div className="v">{formatNumber(result.totalMemRequestGiB, 2)} GiB</div>
          </div>
          <div className="kpi">
            <div className="k">Nodes needed (requests)</div>
            <div className="v">{formatNumber(result.nodesNeededForRequests, 0)}</div>
          </div>
          <div className="kpi">
            <div className="k">Allocatable per node</div>
            <div className="v">
              {formatNumber(result.allocatableCpu, 2)} cores / {formatNumber(result.allocatableMemGiB, 2)} GiB (
              {formatPercent(result.nodeAllocatablePct, 0)})
            </div>
          </div>
        </div>

        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: "pointer", fontWeight: 800 }}>Limits (burst risk)</summary>
          <div style={{ overflowX: "auto", marginTop: 10 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Metric</th>
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CPU limits</td>
                  <td className="num">{formatNumber(result.totalCpuLimitCores, 2)} cores</td>
                </tr>
                <tr>
                  <td>Memory limits</td>
                  <td className="num">{formatNumber(result.totalMemLimitGiB, 2)} GiB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </details>
      </div>
    </div>
  );
}

