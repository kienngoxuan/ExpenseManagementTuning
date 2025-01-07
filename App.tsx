import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";


type Transaction = {
    id: number;
    date: string;
    category: string;
    amount: number;
    type: 'income' | 'expense';
};

const initialTransactions: Transaction[] = [
    { id: 1, date: '2024-01-20', category: 'Food', amount: 50, type: 'expense' },
    { id: 2, date: '2024-01-20', category: 'Transportation', amount: 30, type: 'expense' },
    { id: 3, date: '2024-01-22', category: 'Salary', amount: 2000, type: 'income' },
    { id: 4, date: '2024-01-23', category: 'Rent', amount: 1200, type: 'expense' },
    { id: 5, date: '2024-01-24', category: 'Entertainment', amount: 80, type: 'expense' },
    { id: 6, date: '2024-01-26', category: 'Food', amount: 60, type: 'expense' },
    { id: 7, date: '2024-01-27', category: 'Transportation', amount: 40, type: 'expense' },
    { id: 8, date: '2024-01-28', category: 'Salary', amount: 2200, type: 'income' },
    { id: 9, date: '2024-01-29', category: 'Rent', amount: 1200, type: 'expense' },
    { id: 10, date: '2024-01-30', category: 'Entertainment', amount: 90, type: 'expense' },
    { id: 11, date: '2024-01-31', category: 'Groceries', amount: 100, type: 'expense' },
    { id: 12, date: '2024-02-01', category: 'Utilities', amount: 150, type: 'expense' },
];

type User = {
    username: string;
    loggedIn: boolean;
}

const initialUser: User = {
    username: 'user123',
    loggedIn: true
};


const ExpenseManagement: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'> & { dateType: 'today' | 'anotherday', anotherDate: string | null }>({
        dateType: 'today',
        date: new Date().toISOString().split('T')[0],
        anotherDate: null,
        category: 'Food',
        amount: 0,
        type: 'expense',
    });
    const [user, setUser] = useState<User>(initialUser)
    const [error, setError] = useState<string | null>(null);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTransaction(prev => ({ ...prev, [name]: value }));
    };

    const handleDateTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;

        setNewTransaction(prev => ({
            ...prev,
            dateType: value as 'today' | 'anotherday',
            date: value === 'today' ? new Date().toISOString().split('T')[0] : (prev.anotherDate || new Date().toISOString().split('T')[0]),
        }));
    };

    const handleAnotherDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setNewTransaction(prev => ({
            ...prev,
            anotherDate: value,
            date: value
        }));
    };



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
         if (newTransaction.amount <= 0) {
           setError("Amount must be greater than 0");
           return;
         }
       
        const newId = transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1;
        const transactionToAdd: Transaction = {
            id: newId,
            date: newTransaction.date,
            category: newTransaction.category,
            amount: parseFloat(newTransaction.amount.toString()),
            type: newTransaction.type
        };
        setTransactions(prev => [...prev, transactionToAdd]);
        setNewTransaction({
              dateType: 'today',
              date: new Date().toISOString().split('T')[0],
              anotherDate: null,
              category: 'Food',
              amount: 0,
              type: 'expense',
        })
         setError(null);
    };

    const handleLogout = () => {
        setUser(prev => ({ ...prev, loggedIn: false }))
    }

    const handleLogin = () => {
        setUser(prev => ({ ...prev, loggedIn: true }))
    }

    const categorySpending = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {} as { [key: string]: number });

    const pieChartData = Object.keys(categorySpending).map(key => ({
        name: key,
        value: categorySpending[key]
    }));

    const lineChartData = transactions.filter(t => t.type === 'expense').map(t => ({
        name: t.date,
        amount: t.amount
    }));

      const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF7B32', '#E3449B', '#5699ED'];



    if (!user.loggedIn) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md w-96">
                     <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Login</h2>
                     <div className="mb-4 text-center">
                        <p className="text-gray-600">Welcome back, {user.username}!</p>
                     </div>
                     <button onClick={handleLogin} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                         Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <header className="bg-gray-800 p-4 text-white flex justify-between items-center">
                <h1 className="text-2xl font-bold">Expense Tracker</h1>
                <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                   Logout
                </button>
            </header>
             <main className="flex flex-col md:flex-row p-6 w-full">
                <section className="md:w-1/2 p-4">
                   <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Transaction</h2>
                      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dateType">
                              Date Type
                            </label>
                             <select
                                name="dateType"
                                value={newTransaction.dateType}
                                onChange={handleDateTypeChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                             >
                                <option value="today">Today</option>
                                <option value="anotherday">Another Day</option>
                            </select>
                        </div>
                          {newTransaction.dateType === 'anotherday' && (
                                  <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="anotherDate">
                                          Date
                                    </label>
                                         <input
                                               type="date"
                                               name="anotherDate"
                                               value={newTransaction.anotherDate || ''}
                                              onChange={handleAnotherDateChange}
                                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                       />
                                    </div>
                           )}
                           <div className="mb-4">
                               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                                 Category
                                </label>
                                <select
                                     name="category"
                                    value={newTransaction.category}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                     <option value="Food">Food</option>
                                     <option value="Transportation">Transportation</option>
                                     <option value="Rent">Rent</option>
                                     <option value="Entertainment">Entertainment</option>
                                      <option value="Groceries">Groceries</option>
                                      <option value="Utilities">Utilities</option>
                                     <option value="Salary">Salary</option>
                                </select>
                             </div>
                            <div className="mb-4">
                                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                                     Amount
                                 </label>
                                 <input
                                      type="number"
                                      name="amount"
                                     value={newTransaction.amount}
                                      onChange={handleInputChange}
                                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                 />
                             </div>
                               <div className="mb-4">
                               <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                                    Type
                                </label>
                                 <select
                                       name="type"
                                        value={newTransaction.type}
                                     onChange={handleInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                     <option value="expense">Expense</option>
                                      <option value="income">Income</option>
                                 </select>
                            </div>
                             {error && (
                                <p className="text-red-500 text-xs italic">{error}</p>
                              )}
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                  Add Transaction
                                </button>
                     </form>
                </section>

            <section className="md:w-1/2 p-4 space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Spending Analysis</h2>
                <div className="bg-white shadow-md rounded p-4">
                     <h3 className="text-lg font-semibold mb-2 text-gray-700">Spending by Category</h3>
                        <ResponsiveContainer width="100%" height={300}>
                              <PieChart>
                                   <Pie
                                       data={pieChartData}
                                       cx="50%"
                                        cy="50%"
                                       outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                       label
                                   >
                                        {
                                            pieChartData.map((entry, index) => (
                                               <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))
                                        }
                                  </Pie>
                                 <Tooltip />
                                <Legend />
                              </PieChart>
                          </ResponsiveContainer>
                </div>

                <div className="bg-white shadow-md rounded p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">Expenses Over Time</h3>
                         <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lineChartData}>
                                 <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                    <YAxis />
                                     <Tooltip />
                                     <Legend />
                                    <Line type="monotone" dataKey="amount" stroke="#8884d8" />
                            </LineChart>
                         </ResponsiveContainer>
                  </div>
            </section>
        </main>
    </div>
    );
};

export default ExpenseManagement;