import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { ALGORITHMS } from './constants';
import { Algorithm } from './types';
import AlgorithmSelector from './components/AlgorithmSelector';
import AlgorithmVisualizer from './components/AlgorithmVisualizer';
import CodeBlock from './components/CodeBlock';
import ControlPanel from './components/ControlPanel';

const generateRandomArray = (size = 20) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 95) + 5);
};

const App: React.FC = () => {
  const [selectedAlgorithmId, setSelectedAlgorithmId] = useState<string>(ALGORITHMS[0].id);
  const [array, setArray] = useState<number[]>([]);
  const [target, setTarget] = useState<number | null>(null);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  
  const timeoutRef = useRef<number | null>(null);

  const selectedAlgorithm = useMemo<Algorithm | undefined>(
    () => ALGORITHMS.find((alg) => alg.id === selectedAlgorithmId),
    [selectedAlgorithmId]
  );
  
  const resetVisualization = useCallback(() => {
      setIsPlaying(false);
      setCurrentStepIndex(0);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
  }, []);
  
  const setupNewProblem = useCallback(() => {
    const algorithm = ALGORITHMS.find(alg => alg.id === selectedAlgorithmId);
    if (!algorithm) return;

    resetVisualization();
    
    switch(algorithm.type) {
        case 'sort':
            setArray(generateRandomArray(20));
            setTarget(null);
            break;
        case 'search':
            const newArr = generateRandomArray(12);
            if (algorithm.id === 'binarySearch') {
                const sorted = newArr.slice().sort((a, b) => a - b);
                setArray(sorted);
                setTarget(sorted[Math.floor(Math.random() * sorted.length)]);
            } else {
                setArray(newArr);
                const shouldFind = Math.random() > 0.3;
                setTarget(shouldFind ? newArr[Math.floor(Math.random() * newArr.length)] : 101);
            }
            break;
        case 'dp':
             if (algorithm.id === 'coinChange') {
                setArray([1, 3, 4, 5]); // Coins
                setTarget(Math.floor(Math.random() * 5) + 8); // Amount between 8 and 12
             } else { // Fibonacci
                setTarget(Math.floor(Math.random() * 8) + 8); // n between 8 and 15
                setArray([]);
             }
             break;
        case 'recursion':
             if (algorithm.id === 'permutations') {
                setTarget(3); // For string "ABC"
                setArray([]);
             } else { // Factorial
                setTarget(Math.floor(Math.random() * 4) + 5); // n between 5 and 8
                setArray([]);
             }
             break;
        case 'array-processing':
            setArray(generateRandomArray(10));
            setTarget(null);
            break;
        case 'info':
        default:
            setArray([]);
            setTarget(null);
            break;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAlgorithmId, resetVisualization]);


  useEffect(() => {
    setupNewProblem();
  }, [setupNewProblem]);


  const steps = useMemo(() => {
    if (!selectedAlgorithm || (selectedAlgorithm.type !== 'info' && selectedAlgorithm.type !== 'dp' && selectedAlgorithm.type !== 'recursion' && array.length === 0)) {
        if (selectedAlgorithm?.id === 'permutations' || selectedAlgorithm?.id === 'factorial' || selectedAlgorithm?.id === 'fibonacci' || selectedAlgorithm?.id === 'coinChange') {
            // these are ok with empty array
        } else {
            return [];
        }
    }
    const currentTarget = target ?? 0;
    return selectedAlgorithm.generateSteps(array, currentTarget);
  }, [selectedAlgorithm, array, target]);
  
  useEffect(() => {
    resetVisualization();
  }, [steps, resetVisualization]);


  useEffect(() => {
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timeoutRef.current = window.setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 1000 / speed);
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, speed]);


  const handlePlayPause = () => {
    if (currentStepIndex >= steps.length - 1 && steps.length > 0) {
        resetVisualization();
        setTimeout(() => setIsPlaying(true), 50);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleSelectAlgorithm = (id: string) => {
    setSelectedAlgorithmId(id);
  };
  
  if (!selectedAlgorithm) {
    return <div className="p-4 text-red-500">Ошибка: Алгоритм не найден.</div>;
  }
  
  const getProblemStatement = () => {
    switch(selectedAlgorithm.id){
        case 'search': return `Искомый элемент: <span class="font-bold text-xl text-indigo-400">${target}</span>`;
        case 'dp':
        case 'recursion': return `Входное значение (n): <span class="font-bold text-xl text-indigo-400">${target}</span>`;
        case 'coinChange':
            return `Монеты: <span class="font-bold text-lg text-indigo-400">[${array.join(', ')}]</span>, Сумма: <span class="font-bold text-xl text-indigo-400">${target}</span>`;
        case 'permutations':
            return `Исходная строка: <span class="font-bold text-xl text-indigo-400">"${"ABC".substring(0, target!)}"</span>`;
        default: return null;
    }
  }
  
  const renderInfoContent = (content: string) => {
    const processMarkdown = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+?)`/g, '<code class="bg-gray-700 rounded px-1 py-0.5 font-mono text-sm text-indigo-300">$1</code>');
    };

    return content.trim().split('\n\n').map((block, i) => {
      if (block.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-bold mt-4 mb-2 text-indigo-400" dangerouslySetInnerHTML={{ __html: processMarkdown(block.substring(4)) }} />;
      }
      if (block.trim().startsWith('- ')) {
        const listItems = block.trim().split('\n').map(item => item.substring(2));
        return (
          <ul key={i} className="list-disc list-inside space-y-2 pl-4">
            {listItems.map((item, j) => (
              <li key={j} dangerouslySetInnerHTML={{ __html: processMarkdown(item) }} />
            ))}
          </ul>
        );
      }
      return <p key={i} dangerouslySetInnerHTML={{ __html: processMarkdown(block) }} />;
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Визуализатор Алгоритмов JS</h1>
        <p className="text-indigo-400 mt-2">Изучайте алгоритмы в действии</p>
      </header>
      
      <div className="flex flex-col md:flex-row gap-8">
        <AlgorithmSelector
          algorithms={ALGORITHMS}
          selectedAlgorithmId={selectedAlgorithm.id}
          onSelect={handleSelectAlgorithm}
        />
        
        <main className="flex-1 flex flex-col gap-6">
          <section className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-3xl font-bold mb-3 text-white">{selectedAlgorithm.name}</h2>
            
            {selectedAlgorithm.type === 'info' 
              ? <div className="text-gray-300 space-y-4 leading-relaxed">{renderInfoContent(selectedAlgorithm.description)}</div>
              : <p className="text-gray-400">{selectedAlgorithm.description}</p>
            }
            
            {selectedAlgorithm.type !== 'info' && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div><span className="font-semibold text-green-400">Лучший случай:</span> {selectedAlgorithm.complexity.best}</div>
                    <div><span className="font-semibold text-yellow-400">Средний случай:</span> {selectedAlgorithm.complexity.average}</div>
                    <div><span className="font-semibold text-red-400">Худший случай:</span> {selectedAlgorithm.complexity.worst}</div>
                    <div><span className="font-semibold text-blue-400">Память:</span> {selectedAlgorithm.complexity.space}</div>
                </div>
            )}
          </section>

          {selectedAlgorithm.type !== 'info' && (
            <>
              {getProblemStatement() && (
                <div className="text-center bg-gray-800 p-2 rounded-md" dangerouslySetInnerHTML={{ __html: getProblemStatement()! }}>
                </div>
              )}
              
              <ControlPanel
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onReset={resetVisualization}
                speed={speed}
                onSpeedChange={setSpeed}
                onNewArray={setupNewProblem}
              />

              <AlgorithmVisualizer
                algorithm={selectedAlgorithm}
                steps={steps}
                currentStepIndex={currentStepIndex}
              />

              <CodeBlock code={selectedAlgorithm.code} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;