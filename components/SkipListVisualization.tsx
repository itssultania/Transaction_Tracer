import React from "react";
import { TransactionType, TransactionPriority } from "./SkipListTransactionSystem";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  timestamp: number;
  type: TransactionType;  
  priority: TransactionPriority;
}

interface VisualizationProps {
  transactions: Transaction[];
  selectedType: TransactionType | "all";
  selectedPriority: TransactionPriority | "all";
}

const SkipListVisualization: React.FC<VisualizationProps> = ({ 
  transactions, 
  selectedType, 
  selectedPriority 
}) => {
  if (transactions.length === 0) {
    return <div className="text-center p-4">No transactions to visualize</div>;
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">Skip List Visualization</h3>
      
      {/* Main Lane */}
      <div className="mb-6">
        <div className="text-sm font-medium mb-1">Main Lane (Timestamp Order)</div>
        <div className="flex items-center">
          <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded">HEAD</div>
          <div className="h-0.5 w-4 bg-gray-400"></div>
          {transactions.map((tx, index) => (
            <React.Fragment key={tx.id}>
              <div className={`p-2 rounded text-xs ${
                tx.id === transactions[transactions.length - 1].id ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'
              }`}>
                {tx.id.substring(0, 4)}...
              </div>
              {index < transactions.length - 1 && (
                <div className="h-0.5 w-4 bg-gray-400"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Type Lanes */}
      {selectedType !== "all" && (
        <div className="mb-6">
          <div className="text-sm font-medium mb-1">
            Type Lane: {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
          </div>
          <div className="flex items-center">
            <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded">HEAD</div>
            <div className="h-0.5 w-4 bg-gray-400"></div>
            {transactions
              .filter(tx => tx.type === selectedType)
              .map((tx, index, filteredArray) => (
                <React.Fragment key={tx.id}>
                  <div className={`p-2 rounded text-xs ${
                    tx.type === TransactionType.PAYMENT ? 'bg-blue-100 text-blue-800' :
                    tx.type === TransactionType.DEPOSIT ? 'bg-green-100 text-green-800' :
                    tx.type === TransactionType.WITHDRAWAL ? 'bg-red-100 text-red-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {tx.id.substring(0, 4)}...
                  </div>
                  {index < filteredArray.length - 1 && (
                    <div className="h-0.5 w-4 bg-gray-400"></div>
                  )}
                </React.Fragment>
              ))}
          </div>
        </div>
      )}
      
      {/* Priority Lanes */}
      {selectedPriority !== "all" && (
        <div className="mb-6">
          <div className="text-sm font-medium mb-1">
            Priority Lane: {selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}
          </div>
          <div className="flex items-center">
            <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded">HEAD</div>
            <div className="h-0.5 w-4 bg-gray-400"></div>
            {transactions
              .filter(tx => tx.priority === selectedPriority)
              .map((tx, index, filteredArray) => (
                <React.Fragment key={tx.id}>
                  <div className={`p-2 rounded text-xs ${
                    tx.priority === TransactionPriority.LOW ? 'bg-gray-100 text-gray-800' :
                    tx.priority === TransactionPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                    tx.priority === TransactionPriority.HIGH ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tx.id.substring(0, 4)}...
                  </div>
                  {index < filteredArray.length - 1 && (
                    <div className="h-0.5 w-4 bg-gray-400"></div>
                  )}
                </React.Fragment>
              ))}
          </div>
        </div>
      )}
      
      {/* Express Lanes (Level visualization) */}
      <div>
        <div className="text-sm font-medium mb-1">Express Lanes (Random Levels)</div>
        <div className="space-y-2">
          {[...Array(Math.min(3, transactions.length))].map((_, level) => (
            <div key={level} className="flex items-center">
              <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded text-xs">L{level}</div>
              <div className="h-0.5 w-4 bg-gray-400"></div>
              {transactions.map((tx, index) => {
                // Simulate random level assignment
                const hasLevel = index % (level + 1) === 0;
                return (
                  <React.Fragment key={tx.id}>
                    {hasLevel ? (
                      <>
                        <div className="p-2 rounded text-xs bg-indigo-100 text-indigo-800">
                          {tx.id.substring(0, 4)}...
                        </div>
                        {index < transactions.length - 1 && (
                          <div className="h-0.5 w-8 bg-gray-400"></div>
                        )}
                      </>
                    ) : (
                      <div className="w-12"></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p>This is a simplified visualization of the skip list structure.</p>
        <p>The actual implementation uses multiple levels and specialized lanes for efficient lookups.</p>
      </div>
    </div>
  );
};

export default SkipListVisualization;