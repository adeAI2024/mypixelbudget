
import React from 'react';
import { Expense } from '../types';

const ExpenseTable: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
    return (
        <div className="bg-gray-800 border-4 border-gray-600 p-1 md:p-4 pixel-shadow h-full">
            <h2 className="text-lg text-yellow-400 mb-4 tracking-wider p-3 md:p-0">{`// EXPENSE LOG`}</h2>
            <div className="overflow-auto max-h-[600px]">
                {expenses.length > 0 ? (
                     <table className="w-full text-xs md:text-sm border-collapse">
                        <thead className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
                            <tr>
                                <th className="p-3 border-2 border-gray-600 text-left text-cyan-400">DATE</th>
                                <th className="p-3 border-2 border-gray-600 text-left text-cyan-400">VENDOR</th>
                                <th className="p-3 border-2 border-gray-600 text-left text-cyan-400">CATEGORY</th>
                                <th className="p-3 border-2 border-gray-600 text-right text-cyan-400">AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((exp) => (
                                <tr key={exp.id} className="odd:bg-gray-800 even:bg-gray-700/50 hover:bg-yellow-400/20">
                                    <td className="p-3 border-2 border-gray-600 whitespace-nowrap">{exp.date}</td>
                                    <td className="p-3 border-2 border-gray-600 break-words">{exp.vendor}</td>
                                    <td className="p-3 border-2 border-gray-600 whitespace-nowrap">{exp.category}</td>
                                    <td className="p-3 border-2 border-gray-600 text-right text-green-400 whitespace-nowrap">
                                        ${exp.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex items-center justify-center h-64 text-center">
                        <p className="text-gray-500">AWAITING MISSION DATA...<br/>SCAN A BILL TO BEGIN.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExpenseTable;
