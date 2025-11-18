import React from 'react';
import { VisualizationStep, SortStep, SearchStep, Algorithm, DPStep, RecursionStep, ArrayProcessingStep } from '../types';

interface AlgorithmVisualizerProps {
  algorithm: Algorithm;
  steps: VisualizationStep[];
  currentStepIndex: number;
}

const getSortBarColor = (index: number, step: SortStep): string => {
    const { highlightedIndices } = step;
    if (highlightedIndices.sorted?.includes(index)) return 'bg-green-500';
    if (highlightedIndices.swapping?.includes(index)) return 'bg-red-500';
    if (highlightedIndices.placing?.includes(index)) return 'bg-orange-500';
    if (highlightedIndices.pivot === index) return 'bg-yellow-500';
    if (highlightedIndices.comparing?.includes(index)) return 'bg-blue-500';
    if (highlightedIndices.subArray && index >= highlightedIndices.subArray[0] && index <= highlightedIndices.subArray[1]) {
        return 'bg-purple-500';
    }
    return 'bg-gray-600';
};

const getSearchBoxClass = (index: number, step: SearchStep): string => {
    const { highlightedIndices } = step;
    let classes = 'border-2 transition-all duration-300 text-center rounded-md p-2 w-12 h-12 flex items-center justify-center ';
    if (highlightedIndices.found === index) {
        classes += 'bg-green-500 border-green-300 scale-110';
    } else if (highlightedIndices.mid === index || highlightedIndices.comparing?.includes(index)) {
        classes += 'bg-blue-500 border-blue-300';
    } else {
        classes += 'bg-gray-700 border-gray-600';
    }
    
    if (highlightedIndices.low !== undefined && highlightedIndices.high !== undefined) {
        if (index < highlightedIndices.low || index > highlightedIndices.high) {
            classes += ' opacity-30';
        }
    }
    
    return classes;
};

const getDPBoxClass = (index: number, step: DPStep): string => {
    const { highlightedIndices } = step;
    let classes = 'border-2 transition-all duration-300 text-center rounded-md p-2 w-16 h-16 flex items-center justify-center font-mono text-lg ';
     if (highlightedIndices.calculating === index) {
        classes += 'bg-yellow-500 border-yellow-300 scale-110';
    } else if (highlightedIndices.fromMemo?.includes(index)) {
        classes += 'bg-blue-500 border-blue-300';
    } else {
        classes += 'bg-gray-700 border-gray-600';
    }
    return classes;
}

const renderSort = (step: SortStep) => (
  <div className="flex-grow flex items-end justify-center gap-1 px-4">
    {step.arrayState.map((value, index) => (
      <div key={index} className="flex-1 flex flex-col items-center justify-end">
        <div 
          className={`w-full rounded-t-sm transition-all duration-300 ${getSortBarColor(index, step)}`}
          style={{ height: `${(value / 100) * 250}px` }}
          title={`Значение: ${value}`}
        ></div>
        <span className="text-xs mt-1 text-gray-400">{value}</span>
      </div>
    ))}
  </div>
);

const renderSearch = (step: SearchStep) => (
  <div className="flex-grow flex items-center justify-center gap-2 px-4">
    {step.arrayState.map((value, index) => (
        <div key={index} className="relative flex flex-col items-center pt-2 pb-8 text-sm">
            <div className={getSearchBoxClass(index, step)}>
                 {value}
            </div>
            <div className="absolute bottom-2 text-xs text-gray-500">{index}</div>
            {step.highlightedIndices.low === index && <span className="absolute -bottom-0 text-blue-400 font-bold">L</span>}
            {step.highlightedIndices.high === index && <span className="absolute -bottom-0 text-red-400 font-bold">H</span>}
            {step.highlightedIndices.mid === index && <span className="absolute -bottom-0 text-yellow-400 font-bold">M</span>}
        </div>
     ))}
  </div>
);

const renderDP = (step: DPStep) => (
  <div className="flex-grow flex flex-wrap items-center justify-center gap-2 px-4">
    {step.memoState.map((value, index) => (
        <div key={index} className="relative flex flex-col items-center pt-2 pb-4 text-sm">
            <div className={getDPBoxClass(index, step)}>
                 {value === undefined ? '?' : value}
            </div>
            <div className="absolute -bottom-0 text-xs text-gray-500">dp[{index}]</div>
        </div>
     ))}
  </div>
);

const renderRecursion = (step: RecursionStep) => (
  <div className="flex-grow flex flex-col items-center justify-start gap-2 px-4 w-full">
    <div className="text-lg mb-2">
      Стек вызовов
      {step.returnValue !== null && step.returnValue !== undefined && <span className="font-bold text-green-400 ml-4">Возвращено: {Array.isArray(step.returnValue) ? `[${step.returnValue.join(', ')}]` : step.returnValue}</span>}
    </div>
    <div className="flex flex-col-reverse items-center w-full">
        {step.callStack.map((call, index) => (
            <div key={index} className={`w-full max-w-md p-3 rounded-lg shadow-lg text-center transition-all duration-300 mb-2 ${
                index === step.callStack.length - 1 ? 'bg-indigo-600 scale-105' : 'bg-gray-700'
            }`}>
               <span className="font-bold">{call.funcName}({call.input})</span> - <span className="text-sm text-yellow-300">{call.stage}</span>
            </div>
         ))}
    </div>
  </div>
);

const renderArrayProcessing = (step: ArrayProcessingStep) => (
    <div className="flex-grow flex flex-col items-center justify-center gap-8 px-4 w-full">
        <div>
            <h3 className="text-lg mb-2 font-semibold">Входной массив:</h3>
            <div className="flex flex-wrap justify-center gap-2">
                {step.inputArray.map((value, index) => (
                    <div key={index} className={`border-2 p-2 w-12 h-12 flex items-center justify-center rounded-md transition-all duration-300 ${
                        index === step.highlightedIndices.checking ? 'bg-blue-500 border-blue-300 scale-110' : 'bg-gray-700 border-gray-600'
                    }`}>
                        {value}
                    </div>
                ))}
            </div>
        </div>
        <div>
            <h3 className="text-lg mb-2 font-semibold">Результат:</h3>
            <div className="flex flex-wrap justify-center gap-2 min-h-[56px] bg-gray-900 p-2 rounded-lg">
                {step.resultArray.map((value, index) => (
                    <div key={index} className={`p-2 w-12 h-12 flex items-center justify-center rounded-md bg-green-600 text-white font-bold ${
                        value === step.highlightedIndices.added && index === step.resultArray.length - 1 ? 'animate-pulse' : ''
                    }`}>
                        {value}
                    </div>
                ))}
            </div>
        </div>
    </div>
);


const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({ algorithm, steps, currentStepIndex }) => {
  const currentStep = steps[currentStepIndex];
  if (!currentStep) return null;

  const renderVisualizer = () => {
    switch(algorithm.type) {
      case 'sort':
        return renderSort(currentStep as SortStep);
      case 'search':
        return renderSearch(currentStep as SearchStep);
      case 'dp':
        return renderDP(currentStep as DPStep);
      case 'recursion':
        return renderRecursion(currentStep as RecursionStep);
      case 'array-processing':
        return renderArrayProcessing(currentStep as ArrayProcessingStep);
      default:
        return null;
    }
  }

  return (
    <div className="bg-gray-800 p-4 rounded-lg min-h-[350px] flex flex-col justify-between">
      {renderVisualizer()}
      <div className="mt-4 pt-4 border-t border-gray-700 text-center text-gray-300 h-12 flex items-center justify-center">
        <p>{currentStep.description}</p>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;