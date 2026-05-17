export const buildState =
  <T>(initial: T) =>
  (overrides: Partial<T> = {}): T => ({
    ...initial,
    ...overrides,
  });
