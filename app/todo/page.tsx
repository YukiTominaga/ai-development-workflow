'use client';

import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  parentId: string | null;
}

export default function TodoPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const task: Task = {
        id: crypto.randomUUID(),
        title: newTaskTitle.trim(),
        completed: false,
        parentId: null,
      };
      setTasks([...tasks, task]);
      setNewTaskTitle('');
    }
  };

  const addSubtask = (parentId: string) => {
    if (newSubtaskTitle.trim()) {
      const subtask: Task = {
        id: crypto.randomUUID(),
        title: newSubtaskTitle.trim(),
        completed: false,
        parentId,
      };
      setTasks([...tasks, subtask]);
      setNewSubtaskTitle('');
      setSelectedParentId(null);
    }
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getSubtasks = (parentId: string) => {
    return tasks.filter((task) => task.parentId === parentId);
  };

  const parentTasks = tasks.filter((task) => task.parentId === null);
  const incompleteTasks = parentTasks.filter((task) => !task.completed);
  const completedTasks = parentTasks.filter((task) => task.completed);

  const TaskItem = ({ task }: { task: Task }) => {
    const subtasks = getSubtasks(task.id);
    const incompleteSubtasks = subtasks.filter((st) => !st.completed);
    const completedSubtasks = subtasks.filter((st) => st.completed);

    return (
      <div className="border border-gray-300 rounded-lg p-4 mb-3 bg-white dark:bg-zinc-900 dark:border-zinc-700">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => toggleTask(task.id)}
            className="mt-1 w-5 h-5 cursor-pointer"
          />
          <div className="flex-1">
            <p
              className={`text-lg ${
                task.completed
                  ? 'line-through text-gray-500 dark:text-zinc-500'
                  : 'text-black dark:text-zinc-50'
              }`}
            >
              {task.title}
            </p>

            {/* Subtasks */}
            {incompleteSubtasks.length > 0 && (
              <div className="mt-3 ml-4 space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                  未完了の子タスク
                </p>
                {incompleteSubtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleTask(subtask.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-base text-black dark:text-zinc-50">
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {completedSubtasks.length > 0 && (
              <div className="mt-3 ml-4 space-y-2">
                <p className="text-sm font-medium text-gray-600 dark:text-zinc-400">
                  完了した子タスク
                </p>
                {completedSubtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleTask(subtask.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-base line-through text-gray-500 dark:text-zinc-500">
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Add subtask button */}
            {!task.completed && (
              <div className="mt-3">
                {selectedParentId === task.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSubtask(task.id);
                        }
                      }}
                      placeholder="子タスクのタイトル"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-50"
                      autoFocus
                    />
                    <button
                      onClick={() => addSubtask(task.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      追加
                    </button>
                    <button
                      onClick={() => {
                        setSelectedParentId(null);
                        setNewSubtaskTitle('');
                      }}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                    >
                      キャンセル
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedParentId(task.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    + 子タスクを追加
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black dark:text-zinc-50">
          TODOアプリ
        </h1>

        {/* Add new task */}
        <div className="mb-8 flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                addTask();
              }
            }}
            placeholder="新しいタスクを入力"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-50"
          />
          <button
            onClick={addTask}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            追加
          </button>
        </div>

        {/* Incomplete tasks */}
        {incompleteTasks.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
              未完了のタスク ({incompleteTasks.length})
            </h2>
            {incompleteTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}

        {/* Completed tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
              完了したタスク ({completedTasks.length})
            </h2>
            {completedTasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-zinc-500">
            <p className="text-lg">タスクがありません</p>
            <p className="text-sm mt-2">上の入力欄から新しいタスクを追加してください</p>
          </div>
        )}
      </div>
    </div>
  );
}
