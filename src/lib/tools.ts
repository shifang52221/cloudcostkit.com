export type ToolCategory =
  | "Networking"
  | "Logging"
  | "Storage"
  | "Kubernetes"
  | "FinOps"
  | "Units";

export type Tool = {
  slug: string;
  title: string;
  description: string;
  category: ToolCategory;
};

export const TOOLS: Tool[] = [
  {
    slug: "cdn-cost-calculator",
    title: "CDN Cost Calculator",
    description: "Estimate total CDN cost from bandwidth and request pricing.",
    category: "Networking",
  },
  {
    slug: "cloudfront-cost-calculator",
    title: "CloudFront Cost Calculator",
    description: "Estimate CDN cost for CloudFront-style pricing assumptions.",
    category: "Networking",
  },
  {
    slug: "vpc-data-transfer-cost-calculator",
    title: "VPC Data Transfer Cost Calculator",
    description: "Estimate data transfer spend from GB/month and $/GB assumptions.",
    category: "Networking",
  },
  {
    slug: "storage-pricing-calculator",
    title: "Storage Pricing Calculator",
    description: "Estimate object storage pricing from GB-month, requests, and egress.",
    category: "Storage",
  },
  {
    slug: "s3-cost-calculator",
    title: "S3 Cost Calculator",
    description: "Estimate S3-like storage costs: storage, requests, egress, replication.",
    category: "Storage",
  },
  {
    slug: "data-egress-cost-calculator",
    title: "Data Egress Cost Calculator",
    description: "Estimate monthly egress spend from GB transferred and $/GB pricing.",
    category: "Networking",
  },
  {
    slug: "cdn-bandwidth-cost-calculator",
    title: "CDN Bandwidth Cost Calculator",
    description: "Estimate monthly CDN bandwidth cost from GB transferred and $/GB pricing.",
    category: "Networking",
  },
  {
    slug: "cross-region-transfer-cost-calculator",
    title: "Cross-region Transfer Cost Calculator",
    description: "Estimate monthly cross-region transfer cost from GB transferred and $/GB pricing.",
    category: "Networking",
  },
  {
    slug: "api-response-size-transfer-calculator",
    title: "API Response Size Transfer Calculator",
    description: "Estimate monthly transfer from request volume and average response size.",
    category: "Networking",
  },
  {
    slug: "cdn-request-cost-calculator",
    title: "CDN Request Cost Calculator",
    description: "Estimate CDN request fees from monthly requests and $ per 10k/1M pricing.",
    category: "Networking",
  },
  {
    slug: "api-request-cost-calculator",
    title: "API Request Cost Calculator",
    description: "Estimate request-based charges from monthly requests and $ per million.",
    category: "Networking",
  },
  {
    slug: "log-ingestion-cost-calculator",
    title: "Log Ingestion Cost Calculator",
    description: "Estimate monthly log ingestion and retention cost from GB/day and retention days.",
    category: "Logging",
  },
  {
    slug: "log-cost-calculator",
    title: "Log Cost Calculator",
    description: "Estimate total log costs: ingestion, storage, and scan/search.",
    category: "Logging",
  },
  {
    slug: "log-storage-cost-calculator",
    title: "Log Storage Cost Calculator",
    description: "Estimate log storage cost from retention days and $/GB-month pricing.",
    category: "Logging",
  },
  {
    slug: "cloudwatch-log-cost-calculator",
    title: "CloudWatch Logs Cost Calculator",
    description: "Estimate CloudWatch-style log ingestion + retention costs.",
    category: "Logging",
  },
  {
    slug: "log-retention-storage-cost-calculator",
    title: "Log Retention Storage Cost Calculator",
    description: "Estimate retained log storage cost from GB/day, retention days, and $/GB-month pricing.",
    category: "Logging",
  },
  {
    slug: "log-search-scan-cost-calculator",
    title: "Log Search Scan Cost Calculator",
    description: "Estimate monthly scan charges from GB scanned per day and $/GB pricing.",
    category: "Logging",
  },
  {
    slug: "metrics-timeseries-cost-calculator",
    title: "Metrics Time Series Cost Calculator",
    description: "Estimate monthly metrics cost from active series and $ per series-month pricing.",
    category: "Logging",
  },
  {
    slug: "object-storage-cost-calculator",
    title: "Object Storage Cost Calculator",
    description: "Estimate storage and request costs (GET/PUT) for S3-like object storage.",
    category: "Storage",
  },
  {
    slug: "s3-request-cost-calculator",
    title: "S3 Request Cost Calculator",
    description: "Estimate S3-like request costs (GET/PUT) from monthly request volume.",
    category: "Storage",
  },
  {
    slug: "s3-replication-cost-calculator",
    title: "S3 Replication Cost Calculator",
    description: "Estimate replication fee from replicated GB/month and $/GB assumptions.",
    category: "Storage",
  },
  {
    slug: "storage-replication-cost-calculator",
    title: "Storage Replication Cost Calculator",
    description: "Estimate replication transfer/storage cost from replicated GB and $/GB pricing.",
    category: "Storage",
  },
  {
    slug: "database-storage-growth-cost-calculator",
    title: "Database Storage Growth Cost Calculator",
    description: "Estimate storage growth over time and the average monthly cost.",
    category: "Storage",
  },
  {
    slug: "kubernetes-cost-calculator",
    title: "Kubernetes Cost Calculator",
    description: "Estimate cluster cost by sizing nodes from requests and pricing them.",
    category: "Kubernetes",
  },
  {
    slug: "eks-cost-calculator",
    title: "EKS Cost Calculator",
    description: "Estimate EKS-style cost from node sizing and pricing assumptions.",
    category: "Kubernetes",
  },
  {
    slug: "kubernetes-observability-cost-calculator",
    title: "Kubernetes Observability Cost Calculator",
    description: "Estimate log + metrics observability costs for Kubernetes.",
    category: "Kubernetes",
  },
  {
    slug: "kubernetes-requests-limits-calculator",
    title: "Kubernetes Requests & Limits Calculator",
    description: "Convert per-pod requests/limits into cluster totals and node sizing estimates.",
    category: "Kubernetes",
  },
  {
    slug: "kubernetes-node-cost-calculator",
    title: "Kubernetes Node Cost Calculator",
    description: "Estimate cluster monthly cost from node count and per-node hourly pricing.",
    category: "Kubernetes",
  },
  {
    slug: "reserved-vs-on-demand-break-even-calculator",
    title: "Reserved vs On-demand Break-even Calculator",
    description: "Find the utilization point where a commitment beats on-demand pricing.",
    category: "FinOps",
  },
  {
    slug: "compute-instance-cost-calculator",
    title: "Compute Instance Cost Calculator",
    description: "Estimate monthly compute cost from instance count, $/hour, and expected uptime.",
    category: "FinOps",
  },
  {
    slug: "aws-lambda-cost-calculator",
    title: "AWS Lambda Cost Calculator",
    description: "Estimate Lambda-style request + GB-seconds compute cost from your inputs.",
    category: "FinOps",
  },
  {
    slug: "aws-rds-cost-calculator",
    title: "AWS RDS Cost Calculator",
    description: "Estimate RDS-style cost from instance hours, storage, backups, and I/O assumptions.",
    category: "FinOps",
  },
  {
    slug: "rps-to-monthly-requests-calculator",
    title: "RPS to Monthly Requests Calculator",
    description: "Estimate monthly request volume from RPS, hours/day, and utilization.",
    category: "FinOps",
  },
  {
    slug: "unit-converter",
    title: "Cloud Units Converter",
    description: "Convert GB↔GiB, Mbps↔MB/s, and estimate monthly transfer from throughput.",
    category: "Units",
  },
];
