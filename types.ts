export interface SortStep {
  arrayState: number[];
  highlightedIndices: {
    comparing?: number[];
    swapping?: number[];
    placing?: number[];
    sorted?: number[];
    pivot?: number;
    subArray?: [number, number]; // для сортировки слиянием
  };
  description: string;
}

export interface SearchStep {
  arrayState: number[];
  highlightedIndices: {
    low?: number;
    mid?: number;
    high?: number;
    found?: number;
    comparing?: number[];
  };
  description: string;
}

export interface DPStep {
  memoState: (number | undefined | string)[];
  highlightedIndices: {
    calculating?: number;
    fromMemo?: number[];
  };
  description: string;
}

export interface RecursionStep {
    callStack: { funcName: string; input: any; stage: string }[];
    returnValue: any | null;
    description: string;
}

export interface ArrayProcessingStep {
  inputArray: number[];
  resultArray: number[];
  highlightedIndices: {
    checking?: number;
    added?: number;
  };
  description: string;
}

export type VisualizationStep = SortStep | SearchStep | DPStep | RecursionStep | ArrayProcessingStep;

export interface Algorithm {
  id: string;
  name: string;
  category: string;
  type: 'sort' | 'search' | 'dp' | 'recursion' | 'info' | 'array-processing';
  description: string;
  complexity: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };
  code: string;
  generateSteps: (array: number[], target?: number) => VisualizationStep[];
}