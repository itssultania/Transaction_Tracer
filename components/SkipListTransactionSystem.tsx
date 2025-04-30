"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import SkipListVisualization from "./SkipListVisualization";

// Transaction types and priorities
enum TransactionType {
  PAYMENT = "payment",
  DEPOSIT = "deposit",
  WITHDRAWAL = "withdrawal",
  TRANSFER = "transfer"
}

enum TransactionPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical"
}

// Transaction interface
interface Transaction {
  id: string;
  amount: number;
  description: string;
  timestamp: number;
  type: TransactionType;
  priority: TransactionPriority;
}

// Skip list node
class SkipNode {
  transaction: Transaction;
  forward: SkipNode[];
  // Specialized lanes for type and priority
  typeForward: Map<TransactionType, SkipNode | null>;
  priorityForward: Map<TransactionPriority, SkipNode | null>;
  
  constructor(transaction: Transaction, level: number) {
    this.transaction = transaction;
    this.forward = new Array(level + 1).fill(null);
    this.typeForward = new Map();
    this.priorityForward = new Map();
  }
}

// Skip list implementation with multiple lanes
class SkipList {
  private head: SkipNode;
  private level: number;
  private maxLevel: number;
  private size: number;
  // Type and priority lane heads
  private typeHeads: Map<TransactionType, SkipNode>;
  private priorityHeads: Map<TransactionPriority, SkipNode>;
  
  constructor(maxLevel = 16) {
    // Create a dummy head node
    this.head = new SkipNode({
      id: "",
      amount: 0,
      description: "",
      timestamp: 0,
      type: TransactionType.PAYMENT,
      priority: TransactionPriority.LOW
    }, maxLevel);
    
    this.level = 0;
    this.maxLevel = maxLevel;
    this.size = 0;
    
    // Initialize type and priority lanes
    this.typeHeads = new Map();
    this.priorityHeads = new Map();
    
    // Set up type lanes
    Object.values(TransactionType).forEach(type => {
      this.typeHeads.set(type, this.head);
    });
    
    // Set up priority lanes
    Object.values(TransactionPriority).forEach(priority => {
      this.priorityHeads.set(priority, this.head);
    });
  }
  
  // Random level generator with p=0.5
  private randomLevel(): number {
    let lvl = 0;
    while (Math.random() < 0.5 && lvl < this.maxLevel) {
      lvl++;
    }
    return lvl;
  }
  
  // Insert a transaction into the skip list
  insert(transaction: Transaction): void {
    const update: SkipNode[] = new Array(this.maxLevel + 1).fill(null);
    let current = this.head;
    
    // Find position to insert in main lane
    for (let i = this.level; i >= 0; i--) {
      while (
        current.forward[i] !== null && 
        current.forward[i].transaction.timestamp < transaction.timestamp
      ) {
        current = current.forward[i];
      }
      update[i] = current;
    }
    
    // Generate random level for new node
    const newLevel = this.randomLevel();
    
    // Update the list's level if needed
    if (newLevel > this.level) {
      for (let i = this.level + 1; i <= newLevel; i++) {
        update[i] = this.head;
      }
      this.level = newLevel;
    }
    
    // Create new node
    const newNode = new SkipNode(transaction, newLevel);
    
    // Insert node by rearranging pointers in main lane
    for (let i = 0; i <= newLevel; i++) {
      newNode.forward[i] = update[i].forward[i];
      update[i].forward[i] = newNode;
    }
    
    // Insert into type lane
    const typeHead = this.typeHeads.get(transaction.type);
    if (typeHead) {
      let lastTypeNode = typeHead;
      while (
        lastTypeNode.typeForward.get(transaction.type) !== null && 
        lastTypeNode.typeForward.get(transaction.type) !== undefined && 
        lastTypeNode.typeForward.get(transaction.type)!.transaction.timestamp < transaction.timestamp
      ) {
        lastTypeNode = lastTypeNode.typeForward.get(transaction.type)!;
      }
      
      newNode.typeForward.set(transaction.type, lastTypeNode.typeForward.get(transaction.type) || null);
      lastTypeNode.typeForward.set(transaction.type, newNode);
    }
    
    // Insert into priority lane
    const priorityHead = this.priorityHeads.get(transaction.priority);
    if (priorityHead) {
      let lastPriorityNode = priorityHead;
      while (
        lastPriorityNode.priorityForward.get(transaction.priority) !== null && 
        lastPriorityNode.priorityForward.get(transaction.priority) !== undefined && 
        lastPriorityNode.priorityForward.get(transaction.priority)!.transaction.timestamp < transaction.timestamp
      ) {
        lastPriorityNode = lastPriorityNode.priorityForward.get(transaction.priority)!;
      }
      
      newNode.priorityForward.set(transaction.priority, lastPriorityNode.priorityForward.get(transaction.priority) || null);
      lastPriorityNode.priorityForward.set(transaction.priority, newNode);
    }
    
    this.size++;
  }
  
  // Delete a transaction by ID
  delete(id: string): boolean {
    const update: SkipNode[] = new Array(this.maxLevel + 1).fill(null);
    let current = this.head;
    
    // Find node to delete in main lane
    for (let i = this.level; i >= 0; i--) {
      while (
        current.forward[i] !== null && 
        current.forward[i].transaction.id !== id
      ) {
        current = current.forward[i];
      }
      update[i] = current;
    }
    
    current = current.forward[0];
    
    // If node exists and ID matches
    if (current !== null && current.transaction.id === id) {
      const transactionType = current.transaction.type;
      const transactionPriority = current.transaction.priority;
      
      // Remove node by updating pointers in main lane
      for (let i = 0; i <= this.level; i++) {
        if (update[i].forward[i] !== current) break;
        update[i].forward[i] = current.forward[i];
      }
      
      // Remove from type lane
      let typeNode = this.typeHeads.get(transactionType);
      while (typeNode && typeNode.typeForward.get(transactionType) !== current) {
        typeNode = typeNode.typeForward.get(transactionType)!;
      }
      
      if (typeNode) {
        typeNode.typeForward.set(
          transactionType, 
          current.typeForward.get(transactionType) || null
        );
      }
      
      // Remove from priority lane
      let priorityNode = this.priorityHeads.get(transactionPriority);
      while (priorityNode && priorityNode.priorityForward.get(transactionPriority) !== current) {
        priorityNode = priorityNode.priorityForward.get(transactionPriority)!;
      }
      
      if (priorityNode) {
        priorityNode.priorityForward.set(
          transactionPriority, 
          current.priorityForward.get(transactionPriority) || null
        );
      }
      
      // Update level if needed
      while (this.level > 0 && this.head.forward[this.level] === null) {
        this.level--;
      }
      
      this.size--;
      return true;
    }
    
    return false;
  }
  
  // Get all transactions in order
  getAll(): Transaction[] {
    const transactions: Transaction[] = [];
    let current = this.head.forward[0];
    
    while (current !== null) {
      transactions.push(current.transaction);
      current = current.forward[0];
    }
    
    return transactions;
  }
  
  // Get transactions by type
  getByType(type: TransactionType): Transaction[] {
    const transactions: Transaction[] = [];
    const typeHead = this.typeHeads.get(type);
    
    if (!typeHead) return transactions;
    
    let current = typeHead.typeForward.get(type);
    
    while (current !== null && current !== undefined) {
      transactions.push(current.transaction);
      current = current.typeForward.get(type);
    }
    
    return transactions;
  }
  
  // Get transactions by priority
  getByPriority(priority: TransactionPriority): Transaction[] {
    const transactions: Transaction[] = [];
    const priorityHead = this.priorityHeads.get(priority);
    
    if (!priorityHead) return transactions;
    
    let current = priorityHead.priorityForward.get(priority);
    
    while (current !== null && current !== undefined) {
      transactions.push(current.transaction);
      current = current.priorityForward.get(priority);
    }
    
    return transactions;
  }
  
  // Search for a transaction by ID
  search(id: string): Transaction | null {
    let current = this.head;
    
    for (let i = this.level; i >= 0; i--) {
      while (
        current.forward[i] !== null && 
        current.forward[i].transaction.id !== id
      ) {
        current = current.forward[i];
      }
    }
    
    current = current.forward[0];
    
    if (current !== null && current.transaction.id === id) {
      return current.transaction;
    }
    
    return null;
  }
  
  // Get size of the skip list
  getSize(): number {
    return this.size;
  }
}

// Export these types for the visualization component
export { TransactionType, TransactionPriority };

interface VisualizationProps {
  transactions: Transaction[];
  selectedType: TransactionType | "all";
  selectedPriority: TransactionPriority | "all";
}

export default function SkipListTransactionSystem() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [skipList] = useState<SkipList>(new SkipList());
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<TransactionType>(TransactionType.PAYMENT);
  const [priority, setPriority] = useState<TransactionPriority>(TransactionPriority.MEDIUM);
  const [searchId, setSearchId] = useState<string>("");
  const [searchResult, setSearchResult] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");
  const [filterPriority, setFilterPriority] = useState<TransactionPriority | "all">("all");
  
  // Add a new transaction
  const addTransaction = () => {
    if (!amount || !description) return;
    
    const newTransaction: Transaction = {
      id: uuidv4(),
      amount: parseFloat(amount),
      description,
      timestamp: Date.now(),
      type,
      priority
    };
    
    skipList.insert(newTransaction);
    updateTransactionsList();
    setAmount("");
    setDescription("");
  };
  
  // Delete a transaction
  const deleteTransaction = (id: string) => {
    if (skipList.delete(id)) {
      updateTransactionsList();
      if (searchResult && searchResult.id === id) {
        setSearchResult(null);
      }
    }
  };
  
  // Search for a transaction
  const searchTransaction = () => {
    if (!searchId) return;
    
    const result = skipList.search(searchId);
    setSearchResult(result);
  };
  
  // Update transactions list based on filters
  const updateTransactionsList = () => {
    let filteredTransactions: Transaction[] = [];
    
    if (filterType !== "all" && filterPriority !== "all") {
      // Get transactions by type first, then filter by priority
      filteredTransactions = skipList.getByType(filterType as TransactionType)
        .filter(tx => tx.priority === filterPriority);
    } else if (filterType !== "all") {
      filteredTransactions = skipList.getByType(filterType as TransactionType);
    } else if (filterPriority !== "all") {
      filteredTransactions = skipList.getByPriority(filterPriority as TransactionPriority);
    } else {
      filteredTransactions = skipList.getAll();
    }
    
    setTransactions(filteredTransactions);
  };
  
  // Update transactions when filters change
  useEffect(() => {
    updateTransactionsList();
  }, [filterType, filterPriority, updateTransactionsList]);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Transaction</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TransactionType)}
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            {Object.values(TransactionType).map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
          
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TransactionPriority)}
            className="p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            {Object.values(TransactionPriority).map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>
        <button
          onClick={addTransaction}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full"
        >
          Add Transaction
        </button>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Search Transaction</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Transaction ID"
            className="p-2 border rounded flex-1 dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            onClick={searchTransaction}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Search
          </button>
        </div>
        
        {searchResult && (
          <div className="mt-4 p-4 border rounded dark:border-gray-600">
            <h3 className="font-bold">Search Result:</h3>
            <p>ID: {searchResult.id}</p>
            <p>Amount: ${searchResult.amount.toFixed(2)}</p>
            <p>Description: {searchResult.description}</p>
            <p>Type: {searchResult.type}</p>
            <p>Priority: {searchResult.priority}</p>
            <p>Date: {new Date(searchResult.timestamp).toLocaleString()}</p>
          </div>
        )}
      </div>
      
      {/* Add visualization component */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Skip List Structure</h2>
        <SkipListVisualization 
          transactions={transactions} 
          selectedType={filterType} 
          selectedPriority={filterPriority}
        />
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transactions ({skipList.getSize()})</h2>
          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as TransactionType | "all")}
              className="p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">All Types</option>
              {Object.values(TransactionType).map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as TransactionPriority | "all")}
              className="p-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="all">All Priorities</option>
              {Object.values(TransactionPriority).map(p => (
                <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Description</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Priority</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b dark:border-gray-700">
                    <td className="p-2 font-mono text-xs">{tx.id.substring(0, 8)}...</td>
                    <td className="p-2">${tx.amount.toFixed(2)}</td>
                    <td className="p-2">{tx.description}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        tx.type === TransactionType.PAYMENT ? 'bg-blue-100 text-blue-800' :
                        tx.type === TransactionType.DEPOSIT ? 'bg-green-100 text-green-800' :
                        tx.type === TransactionType.WITHDRAWAL ? 'bg-red-100 text-red-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        tx.priority === TransactionPriority.LOW ? 'bg-gray-100 text-gray-800' :
                        tx.priority === TransactionPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                        tx.priority === TransactionPriority.HIGH ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {tx.priority}
                      </span>
                    </td>
                    <td className="p-2">{new Date(tx.timestamp).toLocaleString()}</td>
                    <td className="p-2">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}