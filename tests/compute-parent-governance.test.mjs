import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const normalize = (value) => value.replace(/\s+/g, " ").trim();

const computeGuide = normalize(
  readFileSync(new URL("../src/pages/guides/compute-costs.astro", import.meta.url), "utf8"),
);
const ec2Guide = normalize(
  readFileSync(new URL("../src/pages/guides/aws-ec2-cost-estimation.astro", import.meta.url), "utf8"),
);
const serverlessGuide = normalize(
  readFileSync(new URL("../src/pages/guides/serverless-costs.astro", import.meta.url), "utf8"),
);
const kubernetesGuide = normalize(
  readFileSync(new URL("../src/pages/guides/kubernetes-costs.astro", import.meta.url), "utf8"),
);

test("compute guide owns the compute runtime budgeting parent role", () => {
  assert.match(computeGuide, /This is the compute runtime budgeting parent page/i);
  assert.match(
    computeGuide,
    /move into VM estimation, serverless architecture budgeting, or Kubernetes system budgeting only after the workload shape is clear/i,
  );
});

test("EC2 guide owns the VM and instance-fleet estimation role", () => {
  assert.match(ec2Guide, /This is the VM and instance-fleet estimation page inside the broader compute hierarchy/i);
  assert.match(ec2Guide, /go back to the compute parent guide if the broader runtime-model choice is still unclear/i);
});

test("serverless guide stays a compute subpath parent rather than a stand-alone top-level model", () => {
  assert.match(
    serverlessGuide,
    /This is the cross-provider serverless architecture budgeting parent page inside the broader compute hierarchy/i,
  );
  assert.match(
    serverlessGuide,
    /go back to the compute parent guide if the broader runtime-model choice is still unclear/i,
  );
});

test("kubernetes guide stays a compute subpath parent rather than a stand-alone top-level model", () => {
  assert.match(
    kubernetesGuide,
    /This is the Kubernetes system budgeting parent page inside the broader compute hierarchy/i,
  );
  assert.match(
    kubernetesGuide,
    /go back to the compute parent guide if the broader runtime-model choice is still unclear/i,
  );
});
