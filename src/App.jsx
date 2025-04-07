import TodoList from './components/TodoList'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-900 flex items-center justify-center py-12 px-4 transition-colors duration-300">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8">
          <TodoList />
        </div>
      </div>
    </div>
  )
}

export default App
