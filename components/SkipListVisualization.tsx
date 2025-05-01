import React from "react";
import { TransactionType, TransactionPriority, Transaction } from "./SkipListTransactionSystem";

interface VisualizationProps {
  transactions: Transaction[];
  selectedType: TransactionType | "all";
  selectedPriority: TransactionPriority | "all";
}

const SkipListVisualization: React.FC<VisualizationProps> = ({ 
  transactions, 
  selectedType, 
  selectedPriority 
}: VisualizationProps) => {
  if (transactions.length === 0) {
    return <div className="text-center p-4">No transactions to visualize</div>;
  }

  // Priority order mapping (from lowest to highest)
  const priorityOrder = {
    [TransactionPriority.LOW]: 1,
    [TransactionPriority.MEDIUM]: 2,
    [TransactionPriority.HIGH]: 3,
    [TransactionPriority.CRITICAL]: 4
  };

  // Ordered priority levels
  const orderedPriorities = [
    TransactionPriority.LOW,
    TransactionPriority.MEDIUM,
    TransactionPriority.HIGH,
    TransactionPriority.CRITICAL
  ];

  // Get color based on transaction priority
  const getPriorityColor = (priority: TransactionPriority) => {
    switch(priority) {
      case TransactionPriority.LOW:
        return 'bg-gray-200 text-gray-800';
      case TransactionPriority.MEDIUM:
        return 'bg-yellow-200 text-yellow-800';
      case TransactionPriority.HIGH:
        return 'bg-orange-200 text-orange-800';
      case TransactionPriority.CRITICAL:
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  // Get background color for priority lane headers
  const getPriorityHeaderColor = (priority: TransactionPriority) => {
    switch(priority) {
      case TransactionPriority.LOW:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
      case TransactionPriority.MEDIUM:
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case TransactionPriority.HIGH:
        return 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200';
      case TransactionPriority.CRITICAL:
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  // Get color based on transaction type
  const getTypeColor = (type: TransactionType) => {
    switch(type) {
      case TransactionType.PAYMENT:
        return 'bg-blue-200 text-blue-800';
      case TransactionType.DEPOSIT:
        return 'bg-green-200 text-green-800';
      case TransactionType.WITHDRAWAL:
        return 'bg-red-200 text-red-800';
      case TransactionType.TRANSFER:
        return 'bg-purple-200 text-purple-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2">Skip List Visualization</h3>
      
      {/* Lane Labels */}
      <div className="p-3 mb-4 rounded bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
        <h4 className="font-medium mb-2">Lane Color Guide:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-2 bg-white dark:bg-gray-800 rounded">
            <h5 className="text-sm font-medium mb-1">Transaction Types:</h5>
            <div className="flex flex-wrap gap-2">
              {Object.values(TransactionType).map((type) => (
                <span key={type} className={`px-3 py-1 rounded text-xs font-medium border ${getTypeColor(type)}`}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              ))}
            </div>
          </div>
          <div className="p-2 bg-white dark:bg-gray-800 rounded">
            <h5 className="text-sm font-medium mb-1">Priority Levels (Low → Critical):</h5>
            <div className="flex flex-wrap gap-2">
              {orderedPriorities.map((priority) => (
                <span key={priority} className={`px-3 py-1 rounded text-xs font-medium border ${getPriorityColor(priority)}`}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Lane */}
      <div className="mb-6">
        <div className="text-sm font-medium mb-1 py-1 px-2 bg-blue-100 dark:bg-blue-900 dark:text-blue-100 rounded border border-blue-200 dark:border-blue-800">
          Main Lane (Timestamp Order)
        </div>
        <div className="flex items-center overflow-x-auto pb-2">
          <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded min-w-[50px] text-center font-medium">HEAD</div>
          <div className="h-0.5 w-4 bg-gray-400"></div>
          {transactions.map((tx, index) => (
            <React.Fragment key={tx.id}>
              <div className={`p-2 rounded text-xs min-w-[80px] text-center font-medium ${
                tx.id === transactions[transactions.length - 1].id ? 'bg-blue-300 text-blue-800' : 'bg-blue-200 text-blue-800'
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
          <div className="text-sm font-medium mb-1 py-1 px-2 bg-green-100 dark:bg-green-900 dark:text-green-100 rounded border border-green-200 dark:border-green-800">
            Type Lane: {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
          </div>
          <div className="flex items-center overflow-x-auto pb-2">
            <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded min-w-[50px] text-center font-medium">HEAD</div>
            <div className="h-0.5 w-4 bg-gray-400"></div>
            {transactions
              .filter(tx => tx.type === selectedType)
              .map((tx, index, filteredArray) => (
                <React.Fragment key={tx.id}>
                  <div className={`p-2 rounded text-xs min-w-[80px] text-center font-medium ${getTypeColor(tx.type)}`}>
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
          <div className={`text-sm font-medium mb-1 py-1 px-2 rounded border ${getPriorityHeaderColor(selectedPriority as TransactionPriority)}`}>
            Priority Lane: {selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1)}
          </div>
          <div className="flex items-center overflow-x-auto pb-2">
            <div className="bg-gray-300 dark:bg-gray-600 p-2 rounded min-w-[50px] text-center font-medium">HEAD</div>
            <div className="h-0.5 w-4 bg-gray-400"></div>
            {transactions
              .filter(tx => tx.priority === selectedPriority)
              .map((tx, index, filteredArray) => (
                <React.Fragment key={tx.id}>
                  <div className={`p-2 rounded text-xs min-w-[80px] text-center font-medium border ${getPriorityColor(tx.priority)}`}>
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
      
      {/* Express Lanes (Priority Levels) */}
      <div>
        <div className="text-sm font-medium mb-1 py-1 px-2 bg-purple-100 dark:bg-purple-900 dark:text-purple-100 rounded border border-purple-200 dark:border-purple-800">
          Priority Lanes (Skip List Structure)
        </div>
        <div className="space-y-3">
          {/* Show express lanes by priority instead of levels */}
          {orderedPriorities.slice(0, 3).reverse().map((priority, index) => (
            <div key={priority} className="flex items-center overflow-x-auto pb-2">
              <div className={`p-2 rounded min-w-[80px] text-center text-xs font-medium border ${getPriorityColor(priority)}`}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </div>
              <div className="h-0.5 w-4 bg-gray-400"></div>
              {transactions.map((tx, txIndex) => {
                // Simulate priority-based level assignment
                // Higher priorities have more entries
                const includeInLevel = 
                  tx.priority === priority || 
                  (txIndex % (3 - index + 1) === 0); // Show more nodes in higher priority lanes
                
                return (
                  <React.Fragment key={tx.id}>
                    {includeInLevel ? (
                      <>
                        <div className={`p-2 rounded text-xs min-w-[80px] text-center font-medium border ${
                          tx.priority === priority 
                            ? getPriorityColor(priority)
                            : 'bg-indigo-100 text-indigo-800'
                        }`}>
                          {tx.id.substring(0, 4)}...
                        </div>
                        {txIndex < transactions.length - 1 && (
                          <div className="h-0.5 w-8 bg-gray-400"></div>
                        )}
                      </>
                    ) : (
                      <div className="w-[96px]"></div> // Keep width consistent (node + connector)
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800">
        <p className="font-medium mb-2">Legend:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Main Lane: Shows all transactions ordered by timestamp</li>
          <li>Type Lane: Shows transactions of the selected type</li>
          <li>Priority Lane: Shows transactions with the selected priority</li>
          <li>Priority Lanes Structure: Higher priority transactions appear in more lanes for faster access</li>
        </ul>
      </div>
    </div>
  );
};

export default SkipListVisualization;