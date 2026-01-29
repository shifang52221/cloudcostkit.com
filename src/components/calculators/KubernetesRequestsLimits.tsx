import React, { useMemo } from "react";
import { useNumberParamState } from "./useNumberParamState";
import { estimateK8sResources } from "../../lib/calc/k8s";
import { formatNumber, formatPercent } from "../../lib/format";
import { clamp } from "../../lib/math";

export function KubernetesRequestsLimitsCalculator() {
  const [pods, setPods] = useNumberParamState("KubernetesRequestsLimits.pods", 60);
  const [cpuRequestMillicores, setCpuRequestMillicores] = useNumberParamState("KubernetesRequestsLimits.cpuRequestMillicores", 250);
  const [memRequestMiB, setMemRequestMiB] = useNumberParamState("KubernetesRequestsLimits.memRequestMiB", 512);
  const [cpuLimitMillicores, setCpuLimitMillicores] = useNumberParamState("KubernetesRequestsLimits.cpuLimitMillicores", 500);
  const [memLimitMiB, setMemLimitMiB] = useNumberParamState("KubernetesRequestsLimits.memLimitMiB", 1024);
  const [nodeCpuCores, setNodeCpuCores] = useNumberParamState("KubernetesRequestsLimits.nodeCpuCores", 8);
  const [nodeMemGiB, setNodeMemGiB] = useNumberParamState("KubernetesRequestsLimits.nodeMemGiB", 32);
  const [nodeAllocatablePct, setNodeAllocatablePct] = useNumberParamState("KubernetesRequestsLimits.nodeAllocatablePct", 90);
  const [maxPodsPerNode, setMaxPodsPerNode] = useNumberParamState("KubernetesRequestsLimits.maxPodsPerNode", 110);
  const [peakPodMultiplierPct, setPeakPodMultiplierPct] = useNumberParamState("KubernetesRequestsLimits.peakPodMultiplierPct", 125);

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
      maxPodsPerNode: clamp(maxPodsPerNode, 0, 10000),
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
    maxPodsPerNode,
  ]);

  const peakResult = useMemo(() => {
    const safeMultiplier = clamp(peakPodMultiplierPct, 100, 1000) / 100;
    const peakPods = Math.ceil(clamp(pods, 0, 1e8) * safeMultiplier);

    return estimateK8sResources({
      pods: peakPods,
      cpuRequestMillicores: clamp(cpuRequestMillicores, 0, 1e9),
      memRequestMiB: clamp(memRequestMiB, 0, 1e12),
      cpuLimitMillicores: clamp(cpuLimitMillicores, 0, 1e9),
      memLimitMiB: clamp(memLimitMiB, 0, 1e12),
      nodeCpuCores: clamp(nodeCpuCores, 0.25, 2048),
      nodeMemGiB: clamp(nodeMemGiB, 0.5, 8192),
      nodeAllocatablePct: clamp(nodeAllocatablePct, 50, 100) / 100,
      maxPodsPerNode: clamp(maxPodsPerNode, 0, 10000),
    });
  }, [
    cpuLimitMillicores,
    cpuRequestMillicores,
    maxPodsPerNode,
    memLimitMiB,
    memRequestMiB,
    nodeAllocatablePct,
    nodeCpuCores,
    nodeMemGiB,
    peakPodMultiplierPct,
    pods,
  ]);

  const peakPods = Math.ceil(clamp(pods, 0, 1e8) * (clamp(peakPodMultiplierPct, 100, 1000) / 100));
  const peakDeltaNodes = peakResult.nodesNeededForRequests - result.nodesNeededForRequests;
  const cpuRequestCoresPerPod = cpuRequestMillicores / 1000;
  const memRequestGiBPerPod = memRequestMiB / 1024;

  const bottleneckLabel = (r: typeof result) => {
    const maxNodes = r.nodesNeededForRequests;
    if (maxNodes === 0) return "None";
    if (r.nodesByPodLimit === maxNodes && r.nodesByPodLimit > 0) return "Max pods per node";
    if (r.nodesByCpuRequest === maxNodes && r.nodesByCpuRequest > 0) return "CPU requests";
    if (r.nodesByMemRequest === maxNodes && r.nodesByMemRequest > 0) return "Memory requests";
    return "Mixed";
  };

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
            <div className="hint">~{formatNumber(cpuRequestCoresPerPod, 2)} cores per pod.</div>
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
            <div className="hint">~{formatNumber(memRequestGiBPerPod, 2)} GiB per pod.</div>
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

          <div className="field field-3">
            <div className="label">Max pods per node</div>
            <input
              type="number"
              inputMode="numeric"
              value={maxPodsPerNode}
              min={0}
              step={1}
              onChange={(e) => setMaxPodsPerNode(+e.target.value)}
            />
            <div className="hint">Set to 0 to ignore pod limits.</div>
          </div>

          <div className="field field-3">
            <div className="label">Peak pods multiplier (%)</div>
            <input
              type="number"
              inputMode="numeric"
              value={peakPodMultiplierPct}
              min={100}
              max={1000}
              step={5}
              onChange={(e) => setPeakPodMultiplierPct(+e.target.value)}
            />
            <div className="hint">Model a peak month (traffic spikes, reprocessing, incidents).</div>
          </div>

          <div className="field field-6">
            <div className="label">Scenario presets</div>
            <div className="btn-row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPods(30);
                  setCpuRequestMillicores(200);
                  setMemRequestMiB(384);
                  setCpuLimitMillicores(400);
                  setMemLimitMiB(768);
                  setNodeCpuCores(4);
                  setNodeMemGiB(16);
                  setNodeAllocatablePct(85);
                  setMaxPodsPerNode(60);
                  setPeakPodMultiplierPct(140);
                }}
              >
                Small service
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPods(80);
                  setCpuRequestMillicores(300);
                  setMemRequestMiB(512);
                  setCpuLimitMillicores(600);
                  setMemLimitMiB(1024);
                  setNodeCpuCores(8);
                  setNodeMemGiB(32);
                  setNodeAllocatablePct(90);
                  setMaxPodsPerNode(110);
                  setPeakPodMultiplierPct(150);
                }}
              >
                Prod baseline
              </button>
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setPods(120);
                  setCpuRequestMillicores(400);
                  setMemRequestMiB(768);
                  setCpuLimitMillicores(800);
                  setMemLimitMiB(1536);
                  setNodeCpuCores(16);
                  setNodeMemGiB(64);
                  setNodeAllocatablePct(85);
                  setMaxPodsPerNode(110);
                  setPeakPodMultiplierPct(180);
                }}
              >
                High traffic
              </button>
            </div>
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
                  setMaxPodsPerNode(110);
                  setPeakPodMultiplierPct(125);
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
            <div className="k">Bottleneck</div>
            <div className="v">{bottleneckLabel(result)}</div>
          </div>
          <div className="kpi">
            <div className="k">Allocatable per node</div>
            <div className="v">
              {formatNumber(result.allocatableCpu, 2)} cores / {formatNumber(result.allocatableMemGiB, 2)} GiB (
              {formatPercent(result.nodeAllocatablePct, 0)})
            </div>
          </div>
          <div className="kpi">
            <div className="k">Max pods per node</div>
            <div className="v">{maxPodsPerNode > 0 ? formatNumber(maxPodsPerNode, 0) : "Ignored"}</div>
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>Baseline vs peak</div>
          <table className="table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th className="num">Pods</th>
                <th className="num">Nodes</th>
                <th className="num">CPU req (cores)</th>
                <th className="num">Mem req (GiB)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Baseline</td>
                <td className="num">{formatNumber(result.pods, 0)}</td>
                <td className="num">{formatNumber(result.nodesNeededForRequests, 0)}</td>
                <td className="num">{formatNumber(result.totalCpuRequestCores, 2)}</td>
                <td className="num">{formatNumber(result.totalMemRequestGiB, 2)}</td>
              </tr>
              <tr>
                <td>Peak</td>
                <td className="num">{formatNumber(peakPods, 0)}</td>
                <td className="num">{formatNumber(peakResult.nodesNeededForRequests, 0)}</td>
                <td className="num">{formatNumber(peakResult.totalCpuRequestCores, 2)}</td>
                <td className="num">{formatNumber(peakResult.totalMemRequestGiB, 2)}</td>
              </tr>
              <tr>
                <td>Delta</td>
                <td className="num">{formatNumber(peakPods - result.pods, 0)}</td>
                <td className="num">{formatNumber(peakDeltaNodes, 0)}</td>
                <td className="num">{formatNumber(peakResult.totalCpuRequestCores - result.totalCpuRequestCores, 2)}</td>
                <td className="num">{formatNumber(peakResult.totalMemRequestGiB - result.totalMemRequestGiB, 2)}</td>
              </tr>
            </tbody>
          </table>
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
