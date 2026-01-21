import { clamp } from "../math";

export function estimateSqsCost(opts: {
  messagesPerMonth: number;
  requestsPerMessage: number;
  pricePerMillionRequestsUsd: number;
  freeRequestsPerMonth?: number;
}) {
  const messagesPerMonth = clamp(opts.messagesPerMonth, 0, 1e18);
  const requestsPerMessage = clamp(opts.requestsPerMessage, 0, 1e6);
  const pricePerMillionRequestsUsd = clamp(opts.pricePerMillionRequestsUsd, 0, 1e9);
  const freeRequestsPerMonth = clamp(opts.freeRequestsPerMonth || 0, 0, 1e18);

  const totalRequests = messagesPerMonth * requestsPerMessage;
  const billableRequests = clamp(totalRequests - freeRequestsPerMonth, 0, 1e18);
  const requestCostUsd = (billableRequests / 1_000_000) * pricePerMillionRequestsUsd;

  const avgRequestsPerMonth = totalRequests;
  const costPerMillionMessagesUsd =
    messagesPerMonth > 0 ? (requestCostUsd / messagesPerMonth) * 1_000_000 : 0;

  return {
    messagesPerMonth,
    requestsPerMessage,
    pricePerMillionRequestsUsd,
    freeRequestsPerMonth,
    totalRequests,
    billableRequests,
    requestCostUsd,
    avgRequestsPerMonth,
    costPerMillionMessagesUsd,
  };
}

