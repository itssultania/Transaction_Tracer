import { useState } from "react";
import SkipListTransactionSystem from "@/components/SkipListTransactionSystem";

export default function Home() {
  return (
    <div className="min-h-screen p-8 font-[family-name:var(--font-geist-sans)]">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Skip List Transaction System</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          A high-performance transaction management system using skip lists
        </p>
      </header>
      
      <main>
        <SkipListTransactionSystem />
      </main>
      
      <footer className="mt-16 text-center text-sm text-gray-500">
        <p>Skip List Transaction System © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
