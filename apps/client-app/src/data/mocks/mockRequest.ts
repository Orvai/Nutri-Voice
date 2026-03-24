import { consumeMockFailure, type MockDomain } from "@/data/mocks/mockStore";

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const randomDelay = (minMs = 200, maxMs = 700): number => {
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
};

export async function mockRequest<T>(
  domain: MockDomain,
  producer: () => T,
  options?: { minMs?: number; maxMs?: number }
): Promise<T> {
  await sleep(randomDelay(options?.minMs, options?.maxMs));

  const failure = consumeMockFailure(domain);
  if (failure) {
    throw new Error(failure);
  }

  return producer();
}
