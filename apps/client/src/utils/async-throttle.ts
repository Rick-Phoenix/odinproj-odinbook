export interface ThrottledFunction {
  (...args: unknown[]): Promise<unknown>;
  cancel(): void;
}

function throttleAsync<T = unknown>(
  fn: (...args: T[]) => unknown,
  delay: number,
  leading: boolean
): ThrottledFunction {
  let timeoutId: NodeJS.Timeout;
  const accumulator: (() => void)[] = [];
  let isLeading = leading;

  const throttledFn = (...args: unknown[]) =>
    new Promise((resolve) => {
      clearTimeout(timeoutId);

      const execute = () =>
        Promise.resolve(fn(...(args as Parameters<typeof fn>))).then((value) => {
          accumulator.pop();
          accumulator.forEach((fn) => fn());
          accumulator.length = 0;
          resolve({ hasResolved: true, value });
        });

      if (isLeading) {
        isLeading = false;
        setTimeout(() => {
          isLeading = true;
        }, delay);
        resolve(execute());
      } else {
        accumulator.push(() => resolve({ hasResolved: false }));
        timeoutId = setTimeout(execute, delay);
      }
    });

  throttledFn.cancel = () => {
    clearTimeout(timeoutId);
    accumulator.pop();
    accumulator.forEach((fn) => fn());
    accumulator.length = 0;
  };

  return throttledFn;
}

export { throttleAsync };
