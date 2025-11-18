import { SortStep, SearchStep, DPStep, RecursionStep, ArrayProcessingStep } from '../types';

export const bubbleSortGenerator = (array: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const arr = [...array];
  const n = arr.length;

  steps.push({
    arrayState: [...arr],
    highlightedIndices: {},
    description: "Начальное состояние массива.",
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        arrayState: [...arr],
        highlightedIndices: { comparing: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => n - 1 - k) },
        description: `Сравниваем arr[${j}] (${arr[j]}) и arr[${j + 1}] (${arr[j + 1]}).`,
      });

      if (arr[j] > arr[j + 1]) {
        swapped = true;
        steps.push({
          arrayState: [...arr],
          highlightedIndices: { swapping: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => n - 1 - k) },
          description: `Меняем местами, так как ${arr[j]} > ${arr[j + 1]}.`,
        });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          arrayState: [...arr],
          highlightedIndices: { swapping: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => n - 1 - k) },
          description: "Массив после обмена.",
        });
      }
    }
    if (!swapped) {
        steps.push({
            arrayState: [...arr],
            highlightedIndices: { sorted: Array.from({ length: n }, (_, k) => k) },
            description: "Массив уже отсортирован. Завершаем досрочно.",
        });
        return steps;
    }
  }

  steps.push({
    arrayState: [...arr],
    highlightedIndices: { sorted: Array.from({ length: n }, (_, k) => k) },
    description: "Сортировка завершена.",
  });

  return steps;
};

export const selectionSortGenerator = (array: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const arr = [...array];
    const n = arr.length;

    steps.push({
        arrayState: [...arr],
        highlightedIndices: {},
        description: "Начальное состояние массива.",
    });

    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            steps.push({
                arrayState: [...arr],
                highlightedIndices: { comparing: [minIndex, j], sorted: Array.from({ length: i }, (_, k) => k) },
                description: `Ищем минимальный элемент. Текущий минимум: ${arr[minIndex]}, сравниваем с ${arr[j]}.`,
            });
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
            }
        }

        steps.push({
            arrayState: [...arr],
            highlightedIndices: { swapping: [i, minIndex], sorted: Array.from({ length: i }, (_, k) => k) },
            description: `Минимальный элемент в неотсортированной части: ${arr[minIndex]}. Меняем его с arr[${i}] (${arr[i]}).`,
        });

        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];

        steps.push({
            arrayState: [...arr],
            highlightedIndices: { swapping: [i, minIndex], sorted: Array.from({ length: i + 1 }, (_, k) => k) },
            description: "Массив после обмена.",
        });
    }

    steps.push({
        arrayState: [...arr],
        highlightedIndices: { sorted: Array.from({ length: n }, (_, k) => k) },
        description: "Сортировка завершена.",
    });

    return steps;
};

export const insertionSortGenerator = (array: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const arr = [...array];
    const n = arr.length;

    steps.push({
        arrayState: [...arr],
        highlightedIndices: {},
        description: "Начальное состояние массива."
    });

    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;

        steps.push({
            arrayState: [...arr],
            highlightedIndices: { pivot: i, sorted: Array.from({ length: i }, (_, k) => k) },
            description: `Выбираем следующий элемент для вставки: ${key}.`
        });

        while (j >= 0 && arr[j] > key) {
            steps.push({
                arrayState: [...arr],
                highlightedIndices: { pivot: i, comparing: [j, j+1], sorted: Array.from({ length: i }, (_, k) => k) },
                description: `Сравниваем ${arr[j]} и ${key}. Так как ${arr[j]} > ${key}, сдвигаем ${arr[j]} вправо.`
            });
            arr[j + 1] = arr[j];
             steps.push({
                arrayState: [...arr],
                highlightedIndices: { pivot: i, swapping: [j, j + 1], sorted: Array.from({ length: i }, (_, k) => k) },
                description: `Массив после сдвига.`
            });
            j = j - 1;
        }
        arr[j + 1] = key;

        steps.push({
            arrayState: [...arr],
            highlightedIndices: { pivot: i, sorted: Array.from({ length: i + 1 }, (_, k) => k) },
            description: `Вставляем ${key} на позицию ${j + 1}. Отсортированная часть увеличена.`
        });
    }

    steps.push({
        arrayState: [...arr],
        highlightedIndices: { sorted: Array.from({ length: n }, (_, k) => k) },
        description: "Сортировка завершена."
    });

    return steps;
};


function partition(arr: number[], low: number, high: number, steps: SortStep[], allSorted: Set<number>) {
    const pivot = arr[high];
    steps.push({
        arrayState: [...arr],
        highlightedIndices: { pivot: high, subArray: [low, high], sorted: Array.from(allSorted) },
        description: `Выбираем опорный элемент (pivot): ${pivot}. Диапазон [${low}, ${high}].`
    });
    let i = low - 1;
    for (let j = low; j < high; j++) {
        steps.push({
            arrayState: [...arr],
            highlightedIndices: { pivot: high, comparing: [j, high], subArray: [low, high], sorted: Array.from(allSorted) },
            description: `Сравниваем ${arr[j]} с опорным элементом ${pivot}.`
        });
        if (arr[j] < pivot) {
            i++;
            steps.push({
                arrayState: [...arr],
                highlightedIndices: { pivot: high, swapping: [i, j], subArray: [low, high], sorted: Array.from(allSorted) },
                description: `Меняем местами ${arr[i]} и ${arr[j]}.`
            });
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    steps.push({
        arrayState: [...arr],
        highlightedIndices: { swapping: [i + 1, high], subArray: [low, high], sorted: Array.from(allSorted) },
        description: `Ставим опорный элемент на свое место. Меняем ${arr[i+1]} и ${arr[high]}.`
    });
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    allSorted.add(i + 1);
    steps.push({
        arrayState: [...arr],
        highlightedIndices: { sorted: Array.from(allSorted) },
        description: `Опорный элемент ${arr[i + 1]} теперь на своем месте.`
    });

    return i + 1;
}

function quickSortRecursive(arr: number[], low: number, high: number, steps: SortStep[], allSorted: Set<number>) {
    if (low < high) {
        const pi = partition(arr, low, high, steps, allSorted);
        quickSortRecursive(arr, low, pi - 1, steps, allSorted);
        quickSortRecursive(arr, pi + 1, high, steps, allSorted);
    } else if (low >= 0 && low < arr.length) {
      allSorted.add(low);
    }
}

export const quickSortGenerator = (array: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const arr = [...array];
    const n = arr.length;
    const allSorted = new Set<number>();

    steps.push({
        arrayState: [...arr],
        highlightedIndices: {},
        description: "Начальное состояние массива."
    });

    quickSortRecursive(arr, 0, n - 1, steps, allSorted);
    
    steps.push({
        arrayState: [...arr],
        highlightedIndices: { sorted: Array.from({ length: n }, (_, k) => k) },
        description: "Сортировка завершена."
    });
    return steps;
};

function merge(arr: number[], l: number, m: number, r: number, steps: SortStep[]) {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    let i = 0, j = 0, k = l;

    while (i < n1 && j < n2) {
        steps.push({ arrayState: [...arr], highlightedIndices: { comparing: [l + i, m + 1 + j], subArray: [l, r] }, description: `Слияние. Сравниваем ${L[i]} и ${R[j]}.` });
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        steps.push({ arrayState: [...arr], highlightedIndices: { placing: [k], subArray: [l, r] }, description: `Вставляем меньший элемент в основной массив.` });
        k++;
    }

    while (i < n1) {
        arr[k] = L[i];
        steps.push({ arrayState: [...arr], highlightedIndices: { placing: [k], subArray: [l, r] }, description: `Копируем остаток левого подмассива.` });
        i++;
        k++;
    }
    while (j < n2) {
        arr[k] = R[j];
        steps.push({ arrayState: [...arr], highlightedIndices: { placing: [k], subArray: [l, r] }, description: `Копируем остаток правого подмассива.` });
        j++;
        k++;
    }
}

function mergeSortRecursive(arr: number[], l: number, r: number, steps: SortStep[]) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    steps.push({ arrayState: [...arr], highlightedIndices: { subArray: [l, r] }, description: `Разделяем массив на части [${l}, ${m}] и [${m + 1}, ${r}].` });
    mergeSortRecursive(arr, l, m, steps);
    mergeSortRecursive(arr, m + 1, r, steps);
    steps.push({ arrayState: [...arr], highlightedIndices: { subArray: [l, r] }, description: `Начинаем слияние частей [${l}, ${m}] и [${m + 1}, ${r}].` });
    merge(arr, l, m, r, steps);
}

export const mergeSortGenerator = (array: number[]): SortStep[] => {
    const steps: SortStep[] = [];
    const arr = [...array];
    steps.push({ arrayState: [...arr], highlightedIndices: {}, description: "Начальное состояние массива." });
    mergeSortRecursive(arr, 0, arr.length - 1, steps);
    steps.push({ arrayState: [...arr], highlightedIndices: { sorted: Array.from({ length: arr.length }, (_, k) => k) }, description: "Сортировка завершена." });
    return steps;
};


export const binarySearchGenerator = (sortedArray: number[], target: number): SearchStep[] => {
  const steps: SearchStep[] = [];
  const arr = [...sortedArray];
  let low = 0;
  let high = arr.length - 1;

  steps.push({
    arrayState: [...arr],
    highlightedIndices: { low, high },
    description: `Начинаем поиск. Диапазон [${low}, ${high}].`,
  });

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    steps.push({
      arrayState: [...arr],
      highlightedIndices: { low, high, mid },
      description: `Вычисляем середину: mid = ${mid}. Значение: ${arr[mid]}.`,
    });

    if (arr[mid] === target) {
      steps.push({
        arrayState: [...arr],
        highlightedIndices: { low, high, found: mid },
        description: `Элемент ${target} найден по индексу ${mid}!`,
      });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({
        arrayState: [...arr],
        highlightedIndices: { low, high, mid },
        description: `${arr[mid]} < ${target}. Ищем в правой половине.`,
      });
      low = mid + 1;
    } else {
      steps.push({
        arrayState: [...arr],
        highlightedIndices: { low, high, mid },
        description: `${arr[mid]} > ${target}. Ищем в левой половине.`,
      });
      high = mid - 1;
    }
  }

  steps.push({
    arrayState: [...arr],
    highlightedIndices: {},
    description: `Элемент ${target} не найден в массиве.`,
  });

  return steps;
};

export const linearSearchGenerator = (array: number[], target: number): SearchStep[] => {
  const steps: SearchStep[] = [];
  const arr = [...array];
  const n = arr.length;

  steps.push({
    arrayState: [...arr],
    highlightedIndices: {},
    description: `Начинаем поиск элемента ${target}.`,
  });

  for (let i = 0; i < n; i++) {
    steps.push({
      arrayState: [...arr],
      highlightedIndices: { comparing: [i] },
      description: `Проверяем элемент по индексу ${i}. Значение: ${arr[i]}.`,
    });

    if (arr[i] === target) {
      steps.push({
        arrayState: [...arr],
        highlightedIndices: { found: i },
        description: `Элемент ${target} найден по индексу ${i}!`,
      });
      return steps;
    }
  }

  steps.push({
    arrayState: [...arr],
    highlightedIndices: {},
    description: `Элемент ${target} не найден в массиве.`,
  });

  return steps;
};

export const fibonacciDPGenerator = (_: number[], n: number): DPStep[] => {
    const steps: DPStep[] = [];
    const memo: (number | undefined)[] = new Array(n + 1).fill(undefined);

    steps.push({ memoState: [...memo], highlightedIndices: {}, description: `Создаем массив для мемоизации размером n+1 (${n+1}).` });
    
    memo[0] = 0;
    steps.push({ memoState: [...memo], highlightedIndices: { calculating: 0 }, description: `Базовый случай: fib(0) = 0.` });

    if (n > 0) {
        memo[1] = 1;
        steps.push({ memoState: [...memo], highlightedIndices: { calculating: 1 }, description: `Базовый случай: fib(1) = 1.` });
    }

    for (let i = 2; i <= n; i++) {
        steps.push({ memoState: [...memo], highlightedIndices: { fromMemo: [i - 1, i - 2] }, description: `Вычисляем fib(${i}) = fib(${i-1}) + fib(${i-2}).` });
        memo[i] = (memo[i - 1] as number) + (memo[i - 2] as number);
        steps.push({ memoState: [...memo], highlightedIndices: { calculating: i }, description: `fib(${i}) = ${memo[i]}. Записываем в таблицу.` });
    }

    steps.push({ memoState: [...memo], highlightedIndices: { calculating: n }, description: `Результат: fib(${n}) = ${memo[n]}.` });
    return steps;
}


export const factorialGenerator = (_: number[], n: number): RecursionStep[] => {
    const steps: RecursionStep[] = [];
    const callStack: { funcName: string; input: number; stage: string }[] = [];

    function factorialRecursive(num: number): number {
        callStack.push({ funcName: 'factorial', input: num, stage: 'вызов' });
        steps.push({ callStack: JSON.parse(JSON.stringify(callStack)), returnValue: null, description: `Вызов factorial(${num}).` });

        if (num <= 1) {
            callStack[callStack.length - 1].stage = 'базовый случай';
            steps.push({ callStack: JSON.parse(JSON.stringify(callStack)), returnValue: 1, description: `Базовый случай: factorial(${num}) возвращает 1.` });
            callStack.pop();
            return 1;
        }

        callStack[callStack.length - 1].stage = `рекурсивный вызов factorial(${num - 1})`;
        steps.push({ callStack: JSON.parse(JSON.stringify(callStack)), returnValue: null, description: `Нужно вычислить factorial(${num - 1}).` });
        
        const returnedValue = factorialRecursive(num - 1);
        
        callStack[callStack.length - 1].stage = `получен результат ${returnedValue}`;
        steps.push({ callStack: JSON.parse(JSON.stringify(callStack)), returnValue: null, description: `factorial(${num - 1}) вернул ${returnedValue}.` });
        
        const result = num * returnedValue;
        
        callStack[callStack.length - 1].stage = `вычисление: ${num} * ${returnedValue}`;
        steps.push({ callStack: JSON.parse(JSON.stringify(callStack)), returnValue: result, description: `Вычисляем результат для factorial(${num}): ${num} * ${returnedValue} = ${result}.` });
        
        callStack[callStack.length - 1].stage = `возврат значения ${result}`;
        steps.push({ callStack: JSON.parse(JSON.stringify(callStack)), returnValue: result, description: `factorial(${num}) возвращает ${result}.` });
        
        callStack.pop();
        return result;
    }

    const finalResult = factorialRecursive(n);
    steps.push({ callStack: [], returnValue: finalResult, description: `Финальный результат: ${finalResult}.` });

    return steps;
};

export const recursiveFilterEvenGenerator = (array: number[]): ArrayProcessingStep[] => {
    const steps: ArrayProcessingStep[] = [];
    
    function filterRecursive(index: number, currentResult: number[]): number[] {
        if (index >= array.length) {
             steps.push({ inputArray: [...array], resultArray: [...currentResult], highlightedIndices: {}, description: "Достигли конца массива. Возвращаем результат." });
            return currentResult;
        }

        steps.push({ inputArray: [...array], resultArray: [...currentResult], highlightedIndices: { checking: index }, description: `Проверяем элемент arr[${index}] = ${array[index]}.` });

        if (array[index] % 2 === 0) {
            steps.push({ inputArray: [...array], resultArray: [...currentResult], highlightedIndices: { checking: index }, description: `${array[index]} - четное. Добавляем в результат.` });
            const newResult = [...currentResult, array[index]];
            steps.push({ inputArray: [...array], resultArray: [...newResult], highlightedIndices: { checking: index, added: array[index] }, description: `Результат после добавления.` });
            return filterRecursive(index + 1, newResult);
        } else {
            steps.push({ inputArray: [...array], resultArray: [...currentResult], highlightedIndices: { checking: index }, description: `${array[index]} - нечетное. Пропускаем.` });
            return filterRecursive(index + 1, currentResult);
        }
    }
    
    steps.push({ inputArray: [...array], resultArray: [], highlightedIndices: {}, description: "Начинаем рекурсивную фильтрацию." });
    const finalResult = filterRecursive(0, []);
    steps.push({ inputArray: [...array], resultArray: [...finalResult], highlightedIndices: {}, description: `Фильтрация завершена. Результат: [${finalResult.join(', ')}]` });

    return steps;
};

export const coinChangeGenerator = (coins: number[], amount: number): DPStep[] => {
    const steps: DPStep[] = [];
    const dp: (number | string)[] = new Array(amount + 1).fill('∞');
    dp[0] = 0;

    steps.push({ memoState: [...dp], highlightedIndices: {}, description: `Создаем DP-таблицу. dp[i] - мин. монет для суммы i. dp[0] = 0.` });

    for (let i = 1; i <= amount; i++) {
        steps.push({ memoState: [...dp], highlightedIndices: { calculating: i }, description: `Вычисляем dp[${i}].` });
        let minCoins = Infinity;
        for (const coin of coins) {
            if (i - coin >= 0) {
                steps.push({ memoState: [...dp], highlightedIndices: { calculating: i, fromMemo: [i-coin] }, description: `Проверяем монету ${coin}. Смотрим на dp[${i - coin}] = ${dp[i-coin]}.` });
                if (dp[i-coin] !== '∞') {
                    minCoins = Math.min(minCoins, (dp[i-coin] as number) + 1);
                }
            }
        }
        if (minCoins !== Infinity) {
            dp[i] = minCoins;
        }
         steps.push({ memoState: [...dp], highlightedIndices: { calculating: i }, description: `Минимальное кол-во монет для суммы ${i} равно ${dp[i]}.` });
    }

    const result = dp[amount] === '∞' ? -1 : dp[amount];
    steps.push({ memoState: [...dp], highlightedIndices: { calculating: amount }, description: `Результат для суммы ${amount}: ${result === -1 ? 'невозможно собрать' : result}.` });

    return steps;
};

export const permutationsGenerator = (_: number[], n: number): RecursionStep[] => {
    const steps: RecursionStep[] = [];
    const initialString = "ABC".substring(0, n);
    const callStack: { funcName: string; input: any; stage: string }[] = [];

    function permutationsRecursive(str: string): string[] {
        const funcName = 'permutations';
        const input = `"${str}"`;

        callStack.push({ funcName, input, stage: 'вызов' });
        steps.push({
            callStack: JSON.parse(JSON.stringify(callStack)),
            returnValue: null,
            description: `Вызов permutations("${str}").`
        });

        if (str.length === 0) {
            callStack[callStack.length - 1].stage = 'базовый случай';
            steps.push({
                callStack: JSON.parse(JSON.stringify(callStack)),
                returnValue: [''],
                description: `Базовый случай. Возвращаем массив с пустой строкой [""]`
            });
            callStack.pop();
            return [""];
        }

        const results: string[] = [];
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const rest = str.slice(0, i) + str.slice(i + 1);

            callStack[callStack.length - 1].stage = `в цикле, char='${char}', вызов для "${rest}"`;
            steps.push({
                callStack: JSON.parse(JSON.stringify(callStack)),
                returnValue: null,
                description: `Фиксируем '${char}'. Рекурсивно ищем перестановки для "${rest}".`
            });

            const subPermutations = permutationsRecursive(rest);
            
            callStack[callStack.length - 1].stage = `получен результат для "${rest}"`;
            steps.push({
                callStack: JSON.parse(JSON.stringify(callStack)),
                returnValue: null,
                description: `Получили [${subPermutations.map(s => `"${s}"`).join(', ')}] от permutations("${rest}").`
            });

            const variantsWithChr = subPermutations.map(variant => char + variant);
            results.push(...variantsWithChr);
            
            callStack[callStack.length - 1].stage = `обновляем результаты`;
            steps.push({
                callStack: JSON.parse(JSON.stringify(callStack)),
                returnValue: null,
                description: `Добавляем '${char}' к каждому варианту. Промежуточный результат: [${results.map(s => `"${s}"`).join(', ')}]`
            });
        }
        
        callStack[callStack.length - 1].stage = `возврат значения`;
        steps.push({
            callStack: JSON.parse(JSON.stringify(callStack)),
            returnValue: results,
            description: `Возвращаем [${results.map(s => `"${s}"`).join(', ')}] из permutations("${str}").`
        });

        callStack.pop();
        return results;
    }

    const finalResult = permutationsRecursive(initialString);
    steps.push({
        callStack: [],
        returnValue: finalResult,
        description: `Финальный результат: [${finalResult.map(s => `"${s}"`).join(', ')}]`
    });

    return steps;
};