
import React, { useState } from 'react';
import { Expense } from './types';
import BillProcessor from './components/BillProcessor';
import ExpenseTable from './components/ExpenseTable';

const Header: React.FC = () => (
  <header className="w-full text-center p-4 bg-gray-900 border-b-4 border-cyan-400">
    <h1 className="text-2xl md:text-4xl text-cyan-400 tracking-widest">
      PIXEL BUDGET
    </h1>
    <p className="text-xs text-gray-400 mt-1">SCAN BILLS. TRACK SPENDING.</p>
  </header>
);

const App: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<string[]>([
    'Groceries', 'Utilities', 'Entertainment', 'Dining Out', 'Transport', 'Uncategorized'
  ]);

  const addExpense = (newExpense: Omit<Expense, 'id'>) => {
    setExpenses(prevExpenses => [
      { ...newExpense, id: new Date().toISOString() + Math.random() },
      ...prevExpenses
    ]);
  };

  const addCategory = (newCategory: string) => {
    if (newCategory && !categories.find(c => c.toLowerCase() === newCategory.toLowerCase())) {
      setCategories(prev => [...prev, newCategory]);
    }
  };

  return (
    <div className="bg-[#1e1e1e] min-h-screen text-gray-100 antialiased" style={{ fontFamily: "'Press Start 2P', cursive" }}>
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <BillProcessor categories={categories} onAddExpense={addExpense} onAddCategory={addCategory} />
          </div>
          <div className="lg:col-span-2">
            <ExpenseTable expenses={expenses} />
          </div>
        </div>
      </main>
       <footer className="text-center p-4 text-gray-600 text-xs">
            <p>BUILT WITH REACT, TAILWIND & GEMINI AI</p>
        </footer>
    </div>
  );
};

export default App;
