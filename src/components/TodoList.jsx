import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, TrashIcon, CheckIcon, PencilIcon, XMarkIcon, MoonIcon, SunIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function TodoList() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: newTodo.trim(),
        description: newDescription.trim(),
        dueDate: newDueDate,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewTodo('');
    setNewDescription('');
    setNewDueDate('');
    setIsFormExpanded(false);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.dueDate || '');
  };

  const saveEdit = () => {
    if (!editText.trim()) {
      deleteTodo(editId);
    } else {
      setTodos(
        todos.map((todo) =>
          todo.id === editId ? { 
            ...todo, 
            text: editText.trim(),
            description: editDescription.trim(),
            dueDate: editDueDate
          } : todo
        )
      );
    }
    setEditId(null);
    setEditText('');
    setEditDescription('');
    setEditDueDate('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
    setEditDescription('');
    setEditDueDate('');
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  // Format the date to display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if a date is in the past
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    return dueDate < today;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { 
      x: -100, 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
          Task Master
        </h1>
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
        >
          {darkMode ? (
            <SunIcon className="w-6 h-6 text-yellow-500" />
          ) : (
            <MoonIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>
      
      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="mb-8">
          <div className="flex justify-between mb-2 text-sm font-medium">
            <span>Progress</span>
            <span>{completedCount}/{totalCount} completed</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / totalCount) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}
      
      <form onSubmit={addTodo} className="mb-8 card">
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Task title..."
            className="input flex-1"
            onFocus={() => setIsFormExpanded(true)}
          />
          <button type="submit" className="btn btn-primary flex items-center gap-2">
            <PlusIcon className="w-5 h-5" />
            Add
          </button>
        </div>
        
        {isFormExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 mt-3"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Add details about your task..."
                className="input min-h-[80px]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Due Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
          </motion.div>
        )}
      </form>

      {/* Filter buttons */}
      <div className="flex justify-center mb-6 space-x-2">
        <button 
          onClick={() => setFilter('all')}
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-ghost'}`}
        >
          Active
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-ghost'}`}
        >
          Completed
        </button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence mode="popLayout">
          {filteredTodos.length > 0 ? (
            filteredTodos.map((todo) => (
              <motion.div
                key={todo.id}
                variants={itemVariants}
                exit="exit"
                layout
                className={`card ${todo.completed ? 'todo-completed bg-gray-50/80' : ''}`}
              >
                {editId === todo.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="input"
                      autoFocus
                    />
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description..."
                      className="input min-h-[80px]"
                    />
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="input pl-10"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={cancelEdit}
                        className="btn btn-ghost"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="btn btn-primary"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`checkbox ${todo.completed ? 'checkbox-checked' : ''}`}
                      >
                        {todo.completed && <CheckIcon className="w-3 h-3" />}
                      </button>
                      
                      <span className="todo-text font-medium">
                        {todo.text}
                      </span>
                      
                      <div className="flex items-center">
                        <button
                          onClick={() => startEdit(todo)}
                          className="icon-btn text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                        >
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="icon-btn text-gray-400 hover:text-red-500 hover:bg-red-50"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {(todo.description || todo.dueDate) && (
                      <div className="mt-3 pl-10">
                        {todo.description && (
                          <p className="text-gray-600 mb-2">{todo.description}</p>
                        )}
                        
                        {todo.dueDate && (
                          <div className={`flex items-center text-sm mt-2 ${
                            isOverdue(todo.dueDate) && !todo.completed 
                              ? 'text-red-500' 
                              : 'text-gray-500'
                          }`}>
                            <ClockIcon className="w-4 h-4 mr-1" />
                            <span>Due: {formatDate(todo.dueDate)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card text-center py-12"
            >
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center animate-pulse-slow">
                  <CheckIcon className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">All Clear!</h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? "You don't have any tasks yet. Add one above!" 
                  : filter === 'active'
                    ? "No active tasks. Great job!"
                    : "No completed tasks yet. Complete some tasks!"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
} 