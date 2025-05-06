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
}) => {
  if (transactions.length === 0) {
    return <div className="text-center p-4">No transactions to visualize</div>;
  }

  // Priority colors (with transparent backgrounds)
  const priorityColors = {
    [TransactionPriority.LOW]: {
      bg: "bg-opacity-20 bg-gray-400",
      text: "text-gray-800 dark:text-gray-200",
      border: "border-gray-300 dark:border-gray-600",
      label: "Low"
    },
    [TransactionPriority.MEDIUM]: {
      bg: "bg-opacity-20 bg-yellow-400",
      text: "text-yellow-800 dark:text-yellow-200",
      border: "border-yellow-300 dark:border-yellow-600",
      label: "Medium"
    },
    [TransactionPriority.HIGH]: {
      bg: "bg-opacity-20 bg-orange-400",
      text: "text-orange-800 dark:text-orange-200",
      border: "border-orange-300 dark:border-orange-600",
      label: "High"
    },
    [TransactionPriority.CRITICAL]: {
      bg: "bg-opacity-20 bg-red-400",
      text: "text-red-800 dark:text-red-200",
      border: "border-red-300 dark:border-red-600",
      label: "Critical"
    }
  };

  // Type colors (with transparent backgrounds)
  const typeColors = {
    [TransactionType.PAYMENT]: {
      bg: "bg-opacity-20 bg-blue-400",
      text: "text-blue-800 dark:text-blue-200",
      border: "border-blue-300 dark:border-blue-600",
      label: "Payment"
    },
    [TransactionType.DEPOSIT]: {
      bg: "bg-opacity-20 bg-green-400",
      text: "text-green-800 dark:text-green-200",
      border: "border-green-300 dark:border-green-600",
      label: "Deposit"
    },
    [TransactionType.WITHDRAWAL]: {
      bg: "bg-opacity-20 bg-red-400",
      text: "text-red-800 dark:text-red-200",
      border: "border-red-300 dark:border-red-600",
      label: "Withdrawal"
    },
    [TransactionType.TRANSFER]: {
      bg: "bg-opacity-20 bg-purple-400",
      text: "text-purple-800 dark:text-purple-200",
      border: "border-purple-300 dark:border-purple-600",
      label: "Transfer"
    }
  };

  // Define priority order (highest to lowest)
  const priorityLevels = [
    TransactionPriority.CRITICAL,
    TransactionPriority.HIGH, 
    TransactionPriority.MEDIUM, 
    TransactionPriority.LOW
  ];

  // Helper function to get priority color classes
  const getPriorityClasses = (priority: TransactionPriority) => {
    const colors = priorityColors[priority];
    return `${colors.bg} ${colors.text} ${colors.border}`;
  };

  // Helper function to get type color classes
  const getTypeClasses = (type: TransactionType) => {
    const colors = typeColors[type];
    return `${colors.bg} ${colors.text} ${colors.border}`;
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">Skip List Visualization</h3>
      
      {/* Color Legend */}
      <div className="mb-6 p-4 rounded border border-gray-200 dark:border-gray-700 bg-opacity-50 bg-gray-50 dark:bg-opacity-50 dark:bg-gray-800">
        <h4 className="text-sm font-medium mb-3">Color Legend:</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Priority Legend */}
          <div>
            <h5 className="text-sm mb-2">Priority Levels:</h5>
            <div className="flex flex-col space-y-2">
              {priorityLevels.map(priority => (
                <div key={priority} className="flex items-center">
                  <div className={`w-4 h-4 mr-2 rounded border ${priorityColors[priority].bg} ${priorityColors[priority].border}`}></div>
                  <span className="text-xs">{priorityColors[priority].label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Type Legend */}
          <div>
            <h5 className="text-sm mb-2">Transaction Types:</h5>
            <div className="flex flex-col space-y-2">
              {Object.values(TransactionType).map(type => (
                <div key={type} className="flex items-center">
                  <div className={`w-4 h-4 mr-2 rounded border ${typeColors[type].bg} ${typeColors[type].border}`}></div>
                  <span className="text-xs">{typeColors[type].label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Transaction List (All transactions in order) */}
      <div className="mb-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-opacity-50 bg-gray-50 dark:bg-opacity-30 dark:bg-gray-800">
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-opacity-50 bg-gray-100 dark:bg-opacity-50 dark:bg-gray-700">
          <h4 className="font-medium text-sm">All Transactions (Timestamp Order)</h4>
        </div>
        
        <div className="p-4">
          <div className="flex items-center overflow-x-auto pb-3">
            <div className="min-w-[50px] p-2 rounded text-center text-xs border border-gray-300 dark:border-gray-600 bg-opacity-20 bg-gray-200 dark:bg-opacity-20 dark:bg-gray-700">
              HEAD
            </div>
            <div className="h-0.5 w-4 bg-gray-300 dark:bg-gray-600"></div>
            
            {transactions.map((tx, index) => (
              <React.Fragment key={tx.id}>
                <div 
                  className={`
                    min-w-[80px] p-2 rounded text-center text-xs 
                    border ${getPriorityClasses(tx.priority)}
                  `}
                >
                  {tx.id.substring(0, 4)}...
                  <div className="mt-1 text-[10px] flex justify-center">
                    <span className={`px-1 rounded border ${getTypeClasses(tx.type)}`}>
                      {tx.type.substring(0, 3)}
                    </span>
                  </div>
                </div>
                {index < transactions.length - 1 && (
                  <div className="h-0.5 w-4 bg-gray-300 dark:bg-gray-600"></div>
                )}
              </React.Fragment>
            ))}
            
            {transactions.length === 0 && (
              <div className="ml-2 text-xs text-gray-500 dark:text-gray-400 italic">No transactions</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Skip List Priority Lanes */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-opacity-50 bg-gray-50 dark:bg-opacity-30 dark:bg-gray-800">
        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-opacity-50 bg-gray-100 dark:bg-opacity-50 dark:bg-gray-700">
          <h4 className="font-medium text-sm">Priority Lanes (Skip List Structure)</h4>
        </div>
        
        <div className="p-4">
          {/* Display lanes by priority level (highest to lowest) */}
          {priorityLevels.map(priority => {
            // Filter transactions for this priority level ONLY
            const priorityTransactions = transactions.filter(tx => 
              tx.priority === priority
            );
            
            return (
              <div key={priority} className="mb-6 last:mb-0">
                <div className={`inline-block px-3 py-1 rounded mb-2 text-xs font-medium border ${getPriorityClasses(priority)}`}>
                  {priorityColors[priority].label} Priority Lane
                </div>
                
                <div className="flex items-center overflow-x-auto pb-3">
                  <div className="min-w-[50px] p-2 rounded text-center text-xs border border-gray-300 dark:border-gray-600 bg-opacity-20 bg-gray-200 dark:bg-opacity-20 dark:bg-gray-700">
                    HEAD
                  </div>
                  <div className="h-0.5 w-4 bg-gray-300 dark:bg-gray-600"></div>
                  
                  {priorityTransactions.length > 0 ? (
                    priorityTransactions.map((tx, index) => (
                      <React.Fragment key={tx.id}>
                        <div 
                          className={`
                            min-w-[80px] p-2 rounded text-center text-xs 
                            border ${getPriorityClasses(tx.priority)}
                          `}
                        >
                          {tx.id.substring(0, 4)}...
                          <div className="mt-1 text-[10px] flex justify-center">
                            <span className={`px-1 rounded border ${getTypeClasses(tx.type)}`}>
                              {tx.type.substring(0, 3)}
                            </span>
                          </div>
                        </div>
                        {index < priorityTransactions.length - 1 && (
                          <div className="h-0.5 w-4 bg-gray-300 dark:bg-gray-600"></div>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <div className="ml-2 text-xs text-gray-500 dark:text-gray-400 italic">No {priorityColors[priority].label.toLowerCase()} priority transactions</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Skip List Type Lanes (if a type is selected) */}
      {selectedType !== "all" && (
        <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-opacity-50 bg-gray-50 dark:bg-opacity-30 dark:bg-gray-800">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-opacity-50 bg-gray-100 dark:bg-opacity-50 dark:bg-gray-700">
            <h4 className="font-medium text-sm">Type Lane: {typeColors[selectedType as TransactionType].label}</h4>
          </div>
          
          <div className="p-4">
            <div className="flex items-center overflow-x-auto pb-3">
              <div className="min-w-[50px] p-2 rounded text-center text-xs border border-gray-300 dark:border-gray-600 bg-opacity-20 bg-gray-200 dark:bg-opacity-20 dark:bg-gray-700">
                HEAD
              </div>
              <div className="h-0.5 w-4 bg-gray-300 dark:bg-gray-600"></div>
              
              {transactions
                .filter(tx => tx.type === selectedType)
                .map((tx, index, filteredTxs) => (
                  <React.Fragment key={tx.id}>
                    <div 
                      className={`
                        min-w-[80px] p-2 rounded text-center text-xs 
                        border ${getTypeClasses(tx.type)}
                      `}
                    >
                      {tx.id.substring(0, 4)}...
                      <div className="mt-1 text-[10px] flex justify-center">
                        <span className={`px-1 rounded border ${getPriorityClasses(tx.priority)}`}>
                          {priorityColors[tx.priority].label.substring(0, 3)}
                        </span>
                      </div>
                    </div>
                    {index < filteredTxs.length - 1 && (
                      <div className="h-0.5 w-4 bg-gray-300 dark:bg-gray-600"></div>
                    )}
                  </React.Fragment>
                ))}
                
              {transactions.filter(tx => tx.type === selectedType).length === 0 && (
                <div className="ml-2 text-xs text-gray-500 dark:text-gray-400 italic">No {typeColors[selectedType as TransactionType].label.toLowerCase()} transactions</div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Explanation */}
      <div className="mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded text-xs bg-opacity-50 bg-gray-50 dark:bg-opacity-30 dark:bg-gray-800">
        <p className="font-medium mb-2">How Skip List Priority Lanes Work:</p>
        <ul className="list-disc pl-4 space-y-1 text-gray-600 dark:text-gray-400">
          <li>Each priority has its own dedicated lane for faster access</li>
          <li>In a real skip list, higher priority items would also have shortcuts across the list</li>
          <li>Transactions are sorted by timestamp within each priority lane</li>
          <li>The main lane at the top shows all transactions in timestamp order</li>
        </ul>
      </div>
    </div>
  );
};

export default SkipListVisualization;