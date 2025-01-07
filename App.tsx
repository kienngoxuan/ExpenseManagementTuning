import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

// Location: Around line 30-50
interface Transaction {
  id: number;
  type: "income" | "expense";
  category: string;
  amount: number;
  date: string;
  currency: string;
  // New additions
  description?: string;
  tags?: string[];
  recurring?: boolean;
  recurringFrequency?: "daily" | "weekly" | "monthly" | "yearly";
}

// New validation utility
const validateTransaction = (transaction: Partial<Transaction>): string[] => {
  const errors: string[] = [];

  // Validate amount
  if (!transaction.amount || transaction.amount <= 0) {
    errors.push("Amount must be a positive number");
  }

  // Validate date
  const transactionDate = new Date(transaction.date || "");
  if (isNaN(transactionDate.getTime())) {
    errors.push("Invalid date format");
  }

  // Prevent future dates for expenses
  if (transaction.type === "expense" && transactionDate > new Date()) {
    errors.push("Expense date cannot be in the future");
  }

  // Validate category
  if (!transaction.category) {
    errors.push("Category is required");
  }

  return errors;
};

// Location: Authentication logic
interface User {
  id: string;
  username: string;
  email?: string;
  role: "user" | "admin" | "guest";
  lastLogin?: Date;
}

// Enhanced authentication
const authenticateUser = (username: string, password: string) => {
  // Simulated user store (replace with actual backend authentication)
  const users = [
    {
      id: "1",
      username: "admin",
      password: hashPassword("password"),
      role: "admin",
      email: "admin@example.com",
    },
  ];

  const user = users.find(
    (u) => u.username === username && u.password === hashPassword(password)
  );

  if (user) {
    const authenticatedUser: User = {
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      lastLogin: new Date(),
    };

    setCurrentUser(authenticatedUser);
    return true;
  }
  return false;
};

// Password hashing utility
const hashPassword = (password: string): string => {
  // WARNING: This is a simple example. Use a proper hashing library in production
  return btoa(password + "security-salt");
};

// New file or add to existing utils
interface FilterOptions {
  type?: "income" | "expense";
  dateRange?: { start: Date; end: Date };
  minAmount?: number;
  maxAmount?: number;
  categories?: string[];
}

export const advancedFilter = (
  transactions: Transaction[],
  options: FilterOptions
) => {
  return transactions.filter((transaction) => {
    // Type filter
    if (options.type && transaction.type !== options.type) return false;

    // Date range filter
    const transactionDate = new Date(transaction.date);
    if (options.dateRange) {
      if (
        transactionDate < options.dateRange.start ||
        transactionDate > options.dateRange.end
      )
        return false;
    }

    // Amount range filter
    if (options.minAmount && transaction.amount < options.minAmount)
      return false;
    if (options.maxAmount && transaction.amount > options.maxAmount)
      return false;

    // Categories filter
    if (
      options.categories &&
      !options.categories.includes(transaction.category)
    )
      return false;

    return true;
  });
};

interface Category {
  id: number;
  type: "income" | "expense";
  name: string;
}

const defaultCategories: Category[] = [
  { id: 1, type: "income", name: "Salary" },
  { id: 2, type: "income", name: "Freelance" },
  { id: 3, type: "income", name: "Investment" },
  { id: 4, type: "income", name: "Rental" },
  { id: 5, type: "income", name: "Gift" },
  { id: 6, type: "income", name: "Bonus" },
  { id: 7, type: "income", name: "Pension" },
  { id: 8, type: "income", name: "Sale" },
  { id: 9, type: "income", name: "Interest" },
  { id: 10, type: "income", name: "Other Income" },
  { id: 11, type: "expense", name: "Food" },
  { id: 12, type: "expense", name: "Rent" },
  { id: 13, type: "expense", name: "Utilities" },
  { id: 14, type: "expense", name: "Transportation" },
  { id: 15, type: "expense", name: "Entertainment" },
  { id: 16, type: "expense", name: "Shopping" },
  { id: 17, type: "expense", name: "Healthcare" },
  { id: 18, type: "expense", name: "Education" },
  { id: 19, type: "expense", name: "Loan" },
  { id: 20, type: "expense", name: "Other Expenses" },
];

const initialTransactions: Transaction[] = [
  {
    id: 1,
    type: "income",
    category: "Salary",
    amount: 5000,
    date: "2024-07-01",
    currency: "USD",
  },
  {
    id: 2,
    type: "expense",
    category: "Rent",
    amount: 1500,
    date: "2024-07-03",
    currency: "USD",
  },
  {
    id: 3,
    type: "expense",
    category: "Food",
    amount: 500,
    date: "2024-07-05",
    currency: "USD",
  },
  {
    id: 4,
    type: "income",
    category: "Freelance",
    amount: 1000,
    date: "2024-07-08",
    currency: "USD",
  },
  {
    id: 5,
    type: "expense",
    category: "Transportation",
    amount: 200,
    date: "2024-07-10",
    currency: "USD",
  },
  {
    id: 6,
    type: "expense",
    category: "Entertainment",
    amount: 150,
    date: "2024-07-12",
    currency: "USD",
  },
  {
    id: 7,
    type: "income",
    category: "Investment",
    amount: 2000,
    date: "2024-07-15",
    currency: "USD",
  },
  {
    id: 8,
    type: "expense",
    category: "Shopping",
    amount: 300,
    date: "2024-07-18",
    currency: "USD",
  },
  {
    id: 9,
    type: "expense",
    category: "Healthcare",
    amount: 100,
    date: "2024-07-20",
    currency: "USD",
  },
  {
    id: 10,
    type: "income",
    category: "Gift",
    amount: 500,
    date: "2024-07-22",
    currency: "USD",
  },
  {
    id: 11,
    type: "expense",
    category: "Education",
    amount: 400,
    date: "2024-07-25",
    currency: "USD",
  },
  {
    id: 12,
    type: "expense",
    category: "Loan",
    amount: 700,
    date: "2024-07-28",
    currency: "USD",
  },
  {
    id: 13,
    type: "income",
    category: "Salary",
    amount: 5200,
    date: "2024-08-01",
    currency: "USD",
  },
  {
    id: 14,
    type: "expense",
    category: "Rent",
    amount: 1550,
    date: "2024-08-03",
    currency: "USD",
  },
  {
    id: 15,
    type: "expense",
    category: "Food",
    amount: 550,
    date: "2024-08-05",
    currency: "USD",
  },
  {
    id: 16,
    type: "income",
    category: "Freelance",
    amount: 1100,
    date: "2024-08-08",
    currency: "USD",
  },
  {
    id: 17,
    type: "expense",
    category: "Transportation",
    amount: 220,
    date: "2024-08-10",
    currency: "USD",
  },
  {
    id: 18,
    type: "expense",
    category: "Entertainment",
    amount: 170,
    date: "2024-08-12",
    currency: "USD",
  },
  {
    id: 19,
    type: "income",
    category: "Investment",
    amount: 2200,
    date: "2024-08-15",
    currency: "USD",
  },
  {
    id: 20,
    type: "expense",
    category: "Shopping",
    amount: 330,
    date: "2024-08-18",
    currency: "USD",
  },
  {
    id: 21,
    type: "expense",
    category: "Healthcare",
    amount: 110,
    date: "2024-08-20",
    currency: "USD",
  },
  {
    id: 22,
    type: "income",
    category: "Gift",
    amount: 550,
    date: "2024-08-22",
    currency: "USD",
  },
  {
    id: 23,
    type: "expense",
    category: "Education",
    amount: 440,
    date: "2024-08-25",
    currency: "USD",
  },
  {
    id: 24,
    type: "expense",
    category: "Loan",
    amount: 770,
    date: "2024-08-28",
    currency: "USD",
  },
];

const ExpenseManagement = () => {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [budget, setBudget] = useState<Record<string, number>>({});
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"login" | "signup">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChartModal, setShowChartModal] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = () => {
    if (username === "user" && password === "password") {
      setIsLoggedIn(true);
      setShowModal(false);
      setError(null);
    } else {
      setError("Invalid username or password");
    }
  };

  const handleSignup = () => {
    if (username.length < 5) {
      setError("Username must be at least 5 characters long.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setIsLoggedIn(true);
    setShowModal(false);
    setError(null);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setPassword("");
    setError(null);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleTransactionTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const type = e.target.value as "income" | "expense";
    setTransactionType(type);
    const filteredCategories = defaultCategories.filter(
      (cat) => cat.type === type
    );
    setCategories(filteredCategories);
    setSelectedCategory(filteredCategories[0]?.name || "");
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory || !amount || !date || !currency) {
      setError("Please fill in all fields.");
      return;
    }

    const newTransaction: Transaction = {
      id: transactions.length + 1,
      type: transactionType,
      category: selectedCategory,
      amount: parseFloat(amount),
      date: date,
      currency: currency,
    };

    setTransactions([...transactions, newTransaction]);
    setAmount("");
    setDate("");
    setError(null);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const searchString = searchQuery.toLowerCase();
      return (
        transaction.category.toLowerCase().includes(searchString) ||
        transaction.type.toLowerCase().includes(searchString) ||
        transaction.amount.toString().includes(searchString) ||
        transaction.date.includes(searchString) ||
        transaction.currency.includes(searchString)
      );
    });
  }, [transactions, searchQuery]);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage, pageSize]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredTransactions.length / pageSize);
  }, [filteredTransactions, pageSize]);

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleBudgetChange = useCallback(
    (category: string, newBudget: number) => {
      setBudget((prevBudget) => ({
        ...prevBudget,
        [category]: newBudget,
      }));
    },
    []
  );

  const handleSetBudget = (category: string) => {
    const newBudget = prompt(
      `Set budget for ${category}`,
      budget[category]?.toString() || "0"
    );
    if (newBudget !== null) {
      const parsedBudget = parseFloat(newBudget);
      if (!isNaN(parsedBudget)) {
        handleBudgetChange(category, parsedBudget);
      } else {
        alert("Invalid budget value");
      }
    }
  };

  const exportToCSV = useCallback(() => {
    const csvRows = [];
    const headers = ["Type", "Category", "Amount", "Date", "Currency"];
    csvRows.push(headers.join(","));

    filteredTransactions.forEach((transaction) => {
      const values = [
        transaction.type,
        transaction.category,
        transaction.amount,
        transaction.date,
        transaction.currency,
      ];
      csvRows.push(values.join(","));
    });

    const csvData = csvRows.join("\n");
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [filteredTransactions]);

  const getLatestMonthData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const filteredData = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() + 1 === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    return filteredData;
  }, [transactions]);

  const transformDataForLineChart = useMemo(() => {
    const monthlyData = getLatestMonthData.reduce((acc, transaction) => {
      const day = new Date(transaction.date).getDate();
      if (!acc[day]) {
        acc[day] = { date: String(day), income: 0, expense: 0 };
      }
      if (transaction.type === "income") {
        acc[day].income += transaction.amount;
      } else {
        acc[day].expense += transaction.amount;
      }
      return acc;
    }, {} as Record<string, { date: string; income: number; expense: number }>);

    return Object.values(monthlyData).sort(
      (a, b) => parseInt(a.date) - parseInt(b.date)
    );
  }, [getLatestMonthData]);

  const transformDataForPieChart = useMemo(() => {
    const incomeTotal = getLatestMonthData
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenseTotal = getLatestMonthData
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return [
      { name: "Income", value: incomeTotal },
      { name: "Expense", value: expenseTotal },
    ];
  }, [getLatestMonthData]);

  const COLORS = ["#0088FE", "#FF8042"];

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } min-h-screen transition-colors duration-300`}
    >
      {!isLoggedIn ? (
        <div className="flex items-center justify-center h-screen">
          <div className="bg-white rounded-lg shadow-xl p-8 m-4 w-96">
            <h2 className="text-2xl font-bold mb-6 text-center">
              {modalType === "login" ? "Login" : "Sign Up"}
            </h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <input
              type="text"
              placeholder="Username"
              className="border rounded px-4 py-2 mb-4 w-full text-gray-800"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="border rounded px-4 py-2 mb-4 w-full text-gray-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex justify-between">
              {modalType === "login" ? (
                <>
                  <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setModalType("signup");
                      setError(null);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSignup}
                    className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-700 transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      setModalType("login");
                      setError(null);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Expense Management</h1>
            <div className="flex gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md focus:outline-none"
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-4">
            <select
              value={transactionType}
              onChange={handleTransactionTypeChange}
              className="p-2 border rounded text-gray-800"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="p-2 border rounded text-gray-800"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              className="p-2 border rounded text-gray-800"
              value={amount}
              onChange={handleAmountChange}
            />
            <input
              type="date"
              className="p-2 border rounded text-gray-800"
              value={date}
              onChange={handleDateChange}
            />
            <select
              value={currency}
              onChange={handleCurrencyChange}
              className="p-2 border rounded text-gray-800"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="JPY">JPY</option>
            </select>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-700 transition-colors duration-200"
            >
              Add
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Transactions"
              className="p-2 border rounded text-gray-800"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Type</th>
                  <th className="py-2 px-4 border-b">Category</th>
                  <th className="py-2 px-4 border-b">Amount</th>
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Currency</th>
                  <th className="py-2 px-4 border-b">Budget</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{transaction.type}</td>
                    <td className="py-2 px-4 border-b">
                      {transaction.category}
                    </td>
                    <td className="py-2 px-4 border-b">{transaction.amount}</td>
                    <td className="py-2 px-4 border-b">{transaction.date}</td>
                    <td className="py-2 px-4 border-b">
                      {transaction.currency}
                    </td>
                    <td className="py-2 px-4 border-b">
                      <button
                        onClick={() => handleSetBudget(transaction.category)}
                        className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded-md transition-colors duration-200"
                      >
                        Set Budget
                      </button>
                      {budget[transaction.category] && (
                        <span
                          className={`ml-2 ${
                            transaction.amount > budget[transaction.category]
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {transaction.amount} / {budget[transaction.category]}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-200 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded transition-colors duration-200 ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors duration-200 ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Next
            </button>
          </div>

          <div className="mt-4 flex gap-4">
            <button
              onClick={exportToCSV}
              className="bg-green-500 text-white rounded px-4 py-2 hover:bg-green-700 transition-colors duration-200"
            >
              Export to CSV
            </button>
            <button
              onClick={() => setShowChartModal(true)}
              className="bg-purple-500 text-white rounded px-4 py-2 hover:bg-purple-700 transition-colors duration-200"
            >
              Show Chart
            </button>
          </div>
          {showChartModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white rounded-lg p-6 w-[90%] md:w-4/5 lg:w-3/5">
                <h2 className="text-xl font-bold mb-4 text-center">
                  Monthly Overview
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-2/3">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={transformDataForLineChart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="income"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="expense"
                          stroke="#82ca9d"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/3">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={transformDataForPieChart}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {transformDataForPieChart.map((_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setShowChartModal(false)}
                    className="bg-gray-500 text-white rounded px-4 py-2 hover:bg-gray-700 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpenseManagement;
