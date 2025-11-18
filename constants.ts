import { Algorithm } from './types';
import { 
  bubbleSortGenerator, 
  selectionSortGenerator, 
  insertionSortGenerator,
  quickSortGenerator,
  mergeSortGenerator,
  binarySearchGenerator,
  linearSearchGenerator,
  factorialGenerator,
  fibonacciDPGenerator,
  recursiveFilterEvenGenerator,
  coinChangeGenerator,
  permutationsGenerator,
} from './services/algorithmService';

export const ALGORITHMS: Algorithm[] = [
  {
    id: 'bigO',
    name: 'Что такое Big O?',
    category: 'Big O',
    type: 'info',
    description: `
**Нотация Big O (О-нотация)** — это математическое обозначение, которое используется в информатике для описания сложности алгоритмов. Она позволяет оценить, как время выполнения или объем требуемой памяти растут с увеличением размера входных данных.

### Ключевые идеи:
- **Асимптотический анализ**: Big O описывает поведение алгоритма на *очень больших* входных данных.
- **Худший случай**: Обычно Big O относится к *худшему* сценарию производительности. Это дает гарантию, что алгоритм не будет работать медленнее.

### Основные классы сложности по времени (Time Complexity):
- **O(1) — Константная**: Время выполнения не зависит от размера данных. (например, доступ к элементу массива по индексу \`arr[5]\`)
- **O(log n) — Логарифмическая**: Время выполнения растет очень медленно. При удвоении данных время увеличивается на константу. (например, бинарный поиск)
- **O(n) — Линейная**: Время выполнения прямо пропорционально количеству данных. (например, линейный поиск)
- **O(n log n) — Линейно-логарифмическая**: Эффективные алгоритмы сортировки. (например, сортировка слиянием)
- **O(n²) — Квадратичная**: Время выполнения растет пропорционально квадрату размера данных. Часто встречается в алгоритмах с вложенными циклами. (например, сортировка пузырьком)
- **O(2ⁿ) — Экспоненциальная**: Время выполнения удваивается при добавлении всего одного элемента. Очень медленные алгоритмы.

### Сложность по памяти (Space Complexity)
Помимо времени, Big O также используется для анализа требуемой **памяти**. Это показывает, сколько дополнительной памяти (помимо входных данных) требуется алгоритму.
- **O(1) — Константная**: Алгоритм использует фиксированное количество памяти. (например, сортировка пузырьком)
- **O(n) — Линейная**: Требуемая память растет пропорционально размеру входных данных. (например, создание копии массива)
- **O(log n) — Логарифмическая**: Память растет логарифмически, что часто встречается в рекурсивных алгоритмах, которые делят данные пополам. (например, быстрая сортировка в среднем)

### Почему мы игнорируем константы?
Big O фокусируется на **скорости роста**. При сравнении алгоритмов, например, \`O(2n)\` и \`O(n²)\`, на малых значениях \`n\` первый может быть медленнее. Но с ростом \`n\`, квадратичная функция \`n²\` будет расти несравнимо быстрее, чем линейная \`2n\`. Поэтому константы (\`2\`) и члены низшего порядка (\`+ 5n + 10\` в \`3n² + 5n + 10\`) отбрасываются, так как на больших данных они становятся незначительными.
    `,
    complexity: { best: '', average: '', worst: '', space: '' },
    code: '',
    generateSteps: () => [],
  },
  {
    id: 'bubbleSort',
    name: 'Сортировка пузырьком',
    category: 'Сортировка',
    type: 'sort',
    description: 'Простой алгоритм сортировки. Он многократно проходит по списку, сравнивает соседние элементы и меняет их местами, если они стоят в неправильном порядке. Проходы по списку повторяются до тех пор, пока на очередном проходе не окажется, что обмены больше не нужны.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}`,
    generateSteps: bubbleSortGenerator,
  },
  {
    id: 'selectionSort',
    name: 'Сортировка выбором',
    category: 'Сортировка',
    type: 'sort',
    description: 'Алгоритм сортировки, который делит массив на две части: отсортированную и неотсортированную. На каждом шаге алгоритм находит минимальный элемент в неотсортированной части и меняет его местами с первым элементом неотсортированной части.',
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    code: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }
  return arr;
}`,
    generateSteps: selectionSortGenerator,
  },
  {
    id: 'insertionSort',
    name: 'Сортировка вставками',
    category: 'Сортировка',
    type: 'sort',
    description: 'Простой алгоритм сортировки, в котором элементы входного массива поочередно вставляются на правильное место в уже отсортированную часть массива. Эффективен для небольших или почти отсортированных массивов.',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    code: `function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j = j - 1;
    }
    arr[j + 1] = key;
  }
  return arr;
}`,
    generateSteps: insertionSortGenerator,
  },
  {
    id: 'quickSort',
    name: 'Быстрая сортировка',
    category: 'Сортировка',
    type: 'sort',
    description: 'Эффективный алгоритм сортировки, использующий стратегию "разделяй и властвуй". Он выбирает "опорный" элемент и перераспределяет другие элементы массива так, чтобы элементы меньше опорного оказались до него, а большие — после. Затем рекурсивно применяется к двум подмассивам.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    code: `function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i]);
  }
  return [...quickSort(left), pivot, ...quickSort(right)];
}`,
    generateSteps: quickSortGenerator,
  },
  {
    id: 'mergeSort',
    name: 'Сортировка слиянием',
    category: 'Сортировка',
    type: 'sort',
    description: 'Эффективный, рекурсивный алгоритм сортировки, основанный на принципе "разделяй и властвуй". Массив рекурсивно делится пополам до тех пор, пока не останутся подмассивы из одного элемента. Затем эти подмассивы сливаются вместе в отсортированном порядке.',
    complexity: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);
  
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right) {
  let resultArray = [], leftIndex = 0, rightIndex = 0;
  
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] < right[rightIndex]) {
      resultArray.push(left[leftIndex]);
      leftIndex++;
    } else {
      resultArray.push(right[rightIndex]);
      rightIndex++;
    }
  }
  
  return resultArray
          .concat(left.slice(leftIndex))
          .concat(right.slice(rightIndex));
}`,
    generateSteps: mergeSortGenerator,
  },
  {
    id: 'linearSearch',
    name: 'Линейный поиск',
    category: 'Поиск',
    type: 'search',
    description: 'Самый простой алгоритм поиска. Он последовательно проверяет каждый элемент массива, пока не найдет искомый элемент или не достигнет конца массива. Не требует отсортированного массива.',
    complexity: { best: 'O(1)', average: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i; // элемент найден
    }
  }
  return null; // элемент не найден
}`,
    generateSteps: (arr, target) => linearSearchGenerator(arr, target ?? arr[0]),
  },
  {
    id: 'binarySearch',
    name: 'Бинарный поиск',
    category: 'Поиск',
    type: 'search',
    description: 'Эффективный алгоритм для поиска элемента в отсортированном массиве. Он работает путем многократного деления пополам той части массива, в которой может находиться искомый элемент, пока размер этой части не сузится до одного элемента.',
    complexity: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    code: `function binarySearch(sortedArr, target) {
  let low = 0;
  let high = sortedArr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const guess = sortedArr[mid];

    if (guess === target) {
      return mid;
    }
    if (guess > target) {
      high = mid - 1;
    } else {
      low = mid + 1;
    }
  }

  return null; // элемент не найден
}`,
    generateSteps: (arr, target) => binarySearchGenerator(arr.slice().sort((a, b) => a - b), target ?? arr[0]),
  },
   {
    id: 'recursiveFilterEven',
    name: 'Фильтр четных чисел',
    category: 'Обработка массивов',
    type: 'array-processing',
    description: 'Пример рекурсивной обработки массива. Функция проходит по элементам, не используя циклы, и строит новый массив только из тех элементов, которые удовлетворяют условию (в данном случае — четные числа).',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    code: `function filterEven(arr) {
  if (arr.length === 0) {
    return [];
  }
  const [first, ...rest] = arr;
  const result = filterEven(rest);
  if (first % 2 === 0) {
    return [first, ...result];
  }
  return result;
}`,
    generateSteps: (arr) => recursiveFilterEvenGenerator(arr),
  },
  {
    id: 'recursionInfo',
    name: 'Что такое Рекурсия?',
    category: 'Рекурсия',
    type: 'info',
    description: `
**Рекурсия** — это концепция в программировании, где функция вызывает саму себя для решения задачи. Это мощный метод, который позволяет элегантно решать сложные проблемы, разбивая их на более простые, однотипные подзадачи.

### Два ключевых компонента рекурсии:
- **Базовый случай (Base Case)**: Это условие, при котором функция прекращает вызывать саму себя и возвращает конкретное значение. Без базового случая рекурсия будет бесконечной и приведет к ошибке \`переполнения стека\` (stack overflow). Пример для факториала: \`if (n <= 1) return 1;\`.
- **Рекурсивный шаг (Recursive Step)**: Это часть функции, где она вызывает саму себя, но с измененными данными, которые приближают ее к базовому случаю. Пример: \`return n * factorial(n - 1);\`.

### Как это работает: Стек вызовов
Когда функция вызывает другую функцию (или саму себя), текущее состояние (аргументы, локальные переменные) "замораживается" и помещается в специальную область памяти, называемую **стеком вызовов**. Новый вызов выполняется поверх. Когда вложенный вызов завершается и возвращает результат, он удаляется из стека, и выполнение возвращается к предыдущей функции. Визуализация факториала наглядно демонстрирует этот процесс.

### Преимущества и недостатки
**Преимущества:**
- **Элегантность и читаемость**: Код для задач, имеющих рекурсивную природу (например, обход деревьев), часто получается короче и понятнее.
- **Мощный инструмент**: Позволяет решать сложные задачи, которые трудно реализовать итеративно.

**Недостатки:**
- **Производительность**: Каждый вызов функции требует дополнительной памяти в стеке и времени на выполнение. Итеративные решения часто быстрее.
- **Риск переполнения стека**: При слишком глубокой рекурсии может закончиться память в стеке.
    `,
    complexity: { best: '', average: '', worst: '', space: '' },
    code: '',
    generateSteps: () => [],
  },
  {
    id: 'factorial',
    name: 'Факториал',
    category: 'Рекурсия',
    type: 'recursion',
    description: 'Классический пример рекурсии. Факториал числа n (обозначается n!) — это произведение всех натуральных чисел от 1 до n. Рекурсивное определение: factorial(n) = n * factorial(n-1), с базовым случаем factorial(0) = 1.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    code: `function factorial(n) {
  if (n <= 1) {
    return 1; // Базовый случай
  }
  // Рекурсивный случай
  return n * factorial(n - 1);
}`,
    generateSteps: (arr, target) => factorialGenerator(arr, target!),
  },
  {
    id: 'permutations',
    name: 'Перестановки строки',
    category: 'Рекурсия',
    type: 'recursion',
    description: 'Классическая задача на рекурсию. Дана строка без повторяющихся символов, нужно найти все возможные перестановки этих символов. Алгоритм работает, фиксируя поочередно каждый символ и рекурсивно находя все перестановки для оставшейся части строки.',
    complexity: { best: 'O(n*n!)', average: 'O(n*n!)', worst: 'O(n*n!)', space: 'O(n*n!)' },
    code: `function permutations(str) {
    if (str.length === 0) {
        return [""];
    }
    const results = [];

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const rest = str.slice(0, i) + str.slice(i + 1);
        const subPermutations = permutations(rest);
        
        for (const sub of subPermutations) {
            results.push(char + sub);
        }
    }

    return results;
}`,
    generateSteps: (arr, target) => permutationsGenerator(arr, target!),
  },
  {
    id: 'fibonacci',
    name: 'Числа Фибоначчи (ДП)',
    category: 'Динамическое программирование',
    type: 'dp',
    description: 'Пример использования динамического программирования (с мемоизацией) для оптимизации рекурсивного алгоритма. Последовательность Фибоначчи — это ряд чисел, в котором каждое следующее число равно сумме двух предыдущих. Простое рекурсивное решение имеет экспоненциальную сложность, но ДП позволяет свести ее к линейной.',
    complexity: { best: 'O(n)', average: 'O(n)', worst: 'O(n)', space: 'O(n)' },
    code: `function fibonacci(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}`,
    generateSteps: (arr, target) => fibonacciDPGenerator(arr, target!),
  },
  {
    id: 'coinChange',
    name: 'Задача о сдаче (ДП)',
    category: 'Динамическое программирование',
    type: 'dp',
    description: 'Классическая задача ДП. Имея набор номиналов монет и целевую сумму, нужно найти минимальное количество монет, необходимое для составления этой суммы. Алгоритм строит таблицу, где для каждой суммы от 1 до цели вычисляется оптимальное решение.',
    complexity: { best: 'O(S*n)', average: 'O(S*n)', worst: 'O(S*n)', space: 'O(S)' },
    code: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i - coin >= 0) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    generateSteps: (arr, target) => coinChangeGenerator(arr, target!),
  },
];