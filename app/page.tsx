'use client';

import { useState } from 'react';

type TaskStatus = 'Pending' | 'Running' | 'Completed';

interface SubTask {
  id: string;
  title: string;
  status: TaskStatus;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  subtasks: SubTask[];
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<{ [taskId: string]: string }>({});

  // Task functions
  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: 'Pending',
        subtasks: [],
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const saveEditingTask = () => {
    if (editingTaskTitle.trim() && editingTaskId) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { ...task, title: editingTaskTitle } : task
        )
      );
      setEditingTaskId(null);
      setEditingTaskTitle('');
    }
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  // Subtask functions
  const addSubtask = (taskId: string) => {
    const subtaskTitle = newSubtaskTitle[taskId];
    if (subtaskTitle && subtaskTitle.trim()) {
      const newSubtask: SubTask = {
        id: Date.now().toString(),
        title: subtaskTitle,
        status: 'Pending',
      };
      setTasks(
        tasks.map((task) =>
          task.id === taskId
            ? { ...task, subtasks: [...task.subtasks, newSubtask] }
            : task
        )
      );
      setNewSubtaskTitle({ ...newSubtaskTitle, [taskId]: '' });
    }
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId),
            }
          : task
      )
    );
  };

  const updateSubtaskStatus = (taskId: string, subtaskId: string, status: TaskStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId ? { ...subtask, status } : subtask
              ),
            }
          : task
      )
    );
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-200 text-gray-800';
      case 'Running':
        return 'bg-blue-200 text-blue-800';
      case 'Completed':
        return 'bg-green-200 text-green-800';
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="w-full max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-black dark:text-white">
          TODO管理アプリ
        </h1>

        {/* Add new task */}
        <div className="mb-8 bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
            新しいタスクを追加
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="タスク名を入力..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              追加
            </button>
          </div>
        </div>

        {/* Task list */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md"
            >
              {/* Task header */}
              <div className="flex items-center justify-between mb-4">
                {editingTaskId === task.id ? (
                  <div className="flex-1 flex gap-2 mr-4">
                    <input
                      type="text"
                      value={editingTaskTitle}
                      onChange={(e) => setEditingTaskTitle(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEditingTask()}
                      className="flex-1 px-3 py-1 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white"
                      autoFocus
                    />
                    <button
                      onClick={saveEditingTask}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    >
                      保存
                    </button>
                    <button
                      onClick={cancelEditingTask}
                      className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                    >
                      キャンセル
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1">
                      <h3 className="text-lg font-semibold text-black dark:text-white">
                        {task.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTaskStatus(task.id, e.target.value as TaskStatus)
                        }
                        className="px-3 py-1 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Running">Running</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button
                        onClick={() => startEditingTask(task)}
                        className="px-3 py-1 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                      >
                        削除
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Subtasks */}
              {task.subtasks.length > 0 && (
                <div className="mb-4 ml-4 space-y-2">
                  {task.subtasks.map((subtask) => (
                    <div
                      key={subtask.id}
                      className="flex items-center justify-between bg-gray-50 dark:bg-zinc-800 p-3 rounded-md"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-gray-600 dark:text-gray-400">└</span>
                        <span className="text-black dark:text-white">{subtask.title}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            subtask.status
                          )}`}
                        >
                          {subtask.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <select
                          value={subtask.status}
                          onChange={(e) =>
                            updateSubtaskStatus(
                              task.id,
                              subtask.id,
                              e.target.value as TaskStatus
                            )
                          }
                          className="px-2 py-1 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white text-xs"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Running">Running</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button
                          onClick={() => deleteSubtask(task.id, subtask.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add subtask */}
              <div className="ml-4 flex gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle[task.id] || ''}
                  onChange={(e) =>
                    setNewSubtaskTitle({
                      ...newSubtaskTitle,
                      [task.id]: e.target.value,
                    })
                  }
                  onKeyPress={(e) => e.key === 'Enter' && addSubtask(task.id)}
                  placeholder="サブタスクを追加..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white text-sm"
                />
                <button
                  onClick={() => addSubtask(task.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  サブタスク追加
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              タスクがありません。新しいタスクを追加してください。
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
