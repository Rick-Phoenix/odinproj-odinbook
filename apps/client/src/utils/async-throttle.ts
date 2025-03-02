export interface ThrottledFunction {
  (...args: any[]): Promise<unknown>;
  cancel(): void;
}

function throttleAsync(
  fn: (...args: any[]) => any,
  delay: number,
  leading: boolean,
): ThrottledFunction {
  let timeoutId: number;
  const accumulator: (() => void)[] = [];
  let isLeading = leading;

  const throttledFn = (...args: any[]) =>
    new Promise((resolve) => {
      clearTimeout(timeoutId);

      const execute = () =>
        Promise.resolve(fn(...args)).then((value) => {
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
        execute();
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
