
import React, { useState, useCallback } from 'react';
import { processBill } from '../services/geminiService';
import { Expense } from '../types';

const PixelCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-gray-800 border-4 border-gray-600 p-4 pixel-shadow ${className}`}>
        <h2 className="text-lg text-yellow-400 mb-4 tracking-wider">{`// ${title}`}</h2>
        {children}
    </div>
);

const PixelButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className, ...props }) => (
    <button
        className={`w-full bg-cyan-500 text-black py-2 px-4 border-b-4 border-cyan-700 hover:bg-cyan-400 hover:border-b-2 active:border-b-0 active:translate-y-1 disabled:bg-gray-600 disabled:border-gray-800 disabled:cursor-not-allowed disabled:translate-y-0 transition-transform duration-75 ${className}`}
        {...props}
    >
        {children}
    </button>
);

const Spinner: React.FC<{ message: string }> = ({ message }) => {
    const [dots, setDots] = useState('');
    React.useEffect(() => {
        const interval = setInterval(() => {
            setDots(d => d.length >= 3 ? '' : d + '.');
        }, 300);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-2 p-4 text-cyan-400 text-center min-h-[170px]">
            <div className="text-lg animate-pulse">[PROCESSING]</div>
            <p className="text-xs">{message}{dots}</p>
        </div>
    );
};


interface BillProcessorProps {
    categories: string[];
    onAddExpense: (expense: Omit<Expense, 'id'>) => void;
    onAddCategory: (category: string) => void;
}

const BillProcessor: React.FC<BillProcessorProps> = ({ categories, onAddExpense, onAddCategory }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [newCategory, setNewCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            onAddCategory(newCategory.trim());
            setNewCategory('');
        }
    };
    
    const handleCategoryKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddCategory();
        }
    };

    const handleProcessBill = useCallback(async () => {
        if (!selectedFile) {
            setError('Please select a bill image first.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const expenseData = await processBill(selectedFile, categories);
            onAddExpense(expenseData);
            setSelectedFile(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedFile, categories, onAddExpense]);

    return (
        <div className="space-y-8">
            <PixelCard title="UPLOAD BILL">
                {isLoading ? (
                    <Spinner message="AI is reading your bill..." />
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="file-upload" className="cursor-pointer w-full bg-pink-600 text-black py-2 px-4 border-b-4 border-pink-800 hover:bg-pink-500 hover:border-b-2 active:border-b-0 active:translate-y-1 inline-block text-center transition-transform duration-75">
                                SELECT IMAGE
                            </label>
                            <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading} />
                        </div>
                        {selectedFile && <p className="text-sm text-green-400 break-all p-2 bg-gray-900 border border-gray-600">Selected: {selectedFile.name}</p>}
                        <PixelButton onClick={handleProcessBill} disabled={!selectedFile || isLoading}>
                            SCAN BILL
                        </PixelButton>
                        {error && <p className="text-sm text-red-500 mt-2 bg-gray-900 p-2 border border-red-500">{`> Error: ${error}`}</p>}
                    </div>
                )}
            </PixelCard>
            
            <PixelCard title="CATEGORIES">
                <div className="space-y-4">
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyPress={handleCategoryKeyPress}
                            placeholder="New category..."
                            className="flex-grow bg-gray-900 border-2 border-gray-600 focus:border-yellow-400 outline-none p-2 text-white"
                            disabled={isLoading}
                        />
                        <button onClick={handleAddCategory} disabled={isLoading} className="bg-yellow-500 text-black px-3 border-b-4 border-yellow-700 hover:bg-yellow-400 active:border-b-0 active:translate-y-1 disabled:bg-gray-600 disabled:border-gray-800 transition-transform duration-75">[+]</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <span key={cat} className="bg-gray-700 text-gray-300 text-xs px-2 py-1">
                                {cat}
                            </span>
                        ))}
                    </div>
                </div>
            </PixelCard>
        </div>
    );
};

export default BillProcessor;
