import { clamp } from "../math";

export function estimateK8sResources(opts: {
  pods: number;
  cpuRequestMillicores: number;
  memRequestMiB: number;
  cpuLimitMillicores: number;
  memLimitMiB: number;
  nodeCpuCores: number;
  nodeMemGiB: number;
  nodeAllocatablePct?: number;
}) {
  const pods = Math.floor(clamp(opts.pods, 0, 1e8));
  const cpuRequestMillicores = clamp(opts.cpuRequestMillicores, 0, 1e9);
  const memRequestMiB = clamp(opts.memRequestMiB, 0, 1e12);
  const cpuLimitMillicores = clamp(opts.cpuLimitMillicores, 0, 1e9);
  const memLimitMiB = clamp(opts.memLimitMiB, 0, 1e12);

  const nodeCpuCores = clamp(opts.nodeCpuCores, 0.25, 2048);
  const nodeMemGiB = clamp(opts.nodeMemGiB, 0.5, 8192);
  const nodeAllocatablePct = clamp(opts.nodeAllocatablePct ?? 0.9, 0.5, 1);

  const totalCpuRequestCores = (pods * cpuRequestMillicores) / 1000;
  const totalCpuLimitCores = (pods * cpuLimitMillicores) / 1000;
  const totalMemRequestGiB = (pods * memRequestMiB) / 1024;
  const totalMemLimitGiB = (pods * memLimitMiB) / 1024;

  const allocatableCpu = nodeCpuCores * nodeAllocatablePct;
  const allocatableMemGiB = nodeMemGiB * nodeAllocatablePct;

  const nodesByCpuRequest = allocatableCpu > 0 ? Math.ceil(totalCpuRequestCores / allocatableCpu) : 0;
  const nodesByMemRequest = allocatableMemGiB > 0 ? Math.ceil(totalMemRequestGiB / allocatableMemGiB) : 0;
  const nodesNeededForRequests = Math.max(nodesByCpuRequest, nodesByMemRequest);

  return {
    pods,
    cpuRequestMillicores,
    memRequestMiB,
    cpuLimitMillicores,
    memLimitMiB,
    nodeCpuCores,
    nodeMemGiB,
    nodeAllocatablePct,
    totalCpuRequestCores,
    totalCpuLimitCores,
    totalMemRequestGiB,
    totalMemLimitGiB,
    allocatableCpu,
    allocatableMemGiB,
    nodesByCpuRequest,
    nodesByMemRequest,
    nodesNeededForRequests,
  };
}

