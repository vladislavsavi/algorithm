import React, { useMemo, useState } from 'react';
import { Algorithm } from '../types';

interface AlgorithmSelectorProps {
  algorithms: Algorithm[];
  selectedAlgorithmId: string;
  onSelect: (id: string) => void;
}

const ChevronDownIcon = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);


const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ algorithms, selectedAlgorithmId, onSelect }) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
      'Big O': true,
      'Сортировка': true,
  });

  const groupedAlgorithms = useMemo(() => {
    return algorithms.reduce((acc, alg) => {
      (acc[alg.category] = acc[alg.category] || []).push(alg);
      return acc;
    }, {} as Record<string, Algorithm[]>);
  }, [algorithms]);

  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({ ...prev, [category]: !prev[category] }));
  };
  
  const categoryOrder = ['Big O', 'Сортировка', 'Поиск', 'Обработка массивов', 'Рекурсия', 'Динамическое программирование'];

  return (
    <nav className="flex-shrink-0 w-full md:w-64 bg-gray-800 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Темы</h2>
      <div className="space-y-2">
        {categoryOrder.map(category => groupedAlgorithms[category] && (
          <div key={category}>
            <button
              onClick={() => toggleCategory(category)}
              className="w-full flex justify-between items-center text-left px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <span className="font-semibold text-white">{category}</span>
              <ChevronDownIcon className={`transition-transform duration-200 ${openCategories[category] ? 'rotate-180' : ''}`} />
            </button>
            {openCategories[category] && (
              <ul className="pl-2 pt-2 space-y-1">
                {groupedAlgorithms[category].map((alg) => (
                  <li key={alg.id}>
                    <button
                      onClick={() => onSelect(alg.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors duration-200 text-sm ${
                        selectedAlgorithmId === alg.id
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      {alg.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
};

export default AlgorithmSelector;