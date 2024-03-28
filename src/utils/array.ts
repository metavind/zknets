const argMax = (arr: Array<number>) =>
  arr.reduce(
    (maxIndex, currentValue, currentIndex) =>
      currentValue > arr[maxIndex] ? currentIndex : maxIndex,
    0
  );

export { argMax };
