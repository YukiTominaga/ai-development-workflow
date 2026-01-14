'use client';

import { useState, useEffect } from 'react';

type TaskStatus = 'Pending' | 'Running' | 'Completed';

interface Subtask {
  id: string;
  title: string;
  status: TaskStatus;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  subtasks: Subtask[];
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<{ [taskId: string]: string }>({});

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    if (tasks.length > 0 || localStorage.getItem('tasks')) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  const addTask = () => {
    if (newTaskTitle.trim() === '') return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'Pending',
      subtasks: [],
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const saveTaskEdit = (taskId: string) => {
    if (editingTaskTitle.trim() === '') return;

    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: editingTaskTitle } : task
    ));
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };

  const cancelTaskEdit = () => {
    setEditingTaskId(null);
    setEditingTaskTitle('');
  };

  const addSubtask = (taskId: string) => {
    const subtaskTitle = newSubtaskTitle[taskId] || '';
    if (subtaskTitle.trim() === '') return;

    const newSubtask: Subtask = {
      id: Date.now().toString(),
      title: subtaskTitle,
      status: 'Pending',
    };

    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subtasks: [...task.subtasks, newSubtask] }
        : task
    ));

    setNewSubtaskTitle({ ...newSubtaskTitle, [taskId]: '' });
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subtasks: task.subtasks.filter(st => st.id !== subtaskId) }
        : task
    ));
  };

  const updateSubtaskStatus = (taskId: string, subtaskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, status } : st
            )
          }
        : task
    ));
  };

  const startEditingSubtask = (subtask: Subtask) => {
    setEditingSubtaskId(subtask.id);
    setEditingSubtaskTitle(subtask.title);
  };

  const saveSubtaskEdit = (taskId: string, subtaskId: string) => {
    if (editingSubtaskTitle.trim() === '') return;

    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subtasks: task.subtasks.map(st =>
              st.id === subtaskId ? { ...st, title: editingSubtaskTitle } : st
            )
          }
        : task
    ));
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  };

  const cancelSubtaskEdit = () => {
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Pending': return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'Running': return 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Completed': return 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-8">
          TODO管理アプリ
        </h1>

        {/* Add new task */}
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            追加
          </button>
        </div>

        {/* Tasks list */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6">
              {/* Task header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1">
                  {editingTaskId === task.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingTaskTitle}
                        onChange={(e) => setEditingTaskTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveTaskEdit(task.id)}
                        className="flex-1 px-3 py-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => saveTaskEdit(task.id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        保存
                      </button>
                      <button
                        onClick={cancelTaskEdit}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                      >
                        キャンセル
                      </button>
                    </div>
                  ) : (
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                      {task.title}
                    </h2>
                  )}
                </div>

                {editingTaskId !== task.id && (
                  <div className="flex gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Running">Running</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      onClick={() => startEditingTask(task)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      削除
                    </button>
                  </div>
                )}
              </div>

              {/* Subtasks */}
              <div className="ml-6 space-y-2">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-700 p-3 rounded">
                    {editingSubtaskId === subtask.id ? (
                      <>
                        <input
                          type="text"
                          value={editingSubtaskTitle}
                          onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveSubtaskEdit(task.id, subtask.id)}
                          className="flex-1 px-2 py-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-600 text-zinc-900 dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => saveSubtaskEdit(task.id, subtask.id)}
                          className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                        >
                          保存
                        </button>
                        <button
                          onClick={cancelSubtaskEdit}
                          className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs"
                        >
                          キャンセル
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-zinc-900 dark:text-zinc-50">{subtask.title}</span>
                        <select
                          value={subtask.status}
                          onChange={(e) => updateSubtaskStatus(task.id, subtask.id, e.target.value as TaskStatus)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subtask.status)}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Running">Running</option>
                          <option value="Completed">Completed</option>
                        </select>
                        <button
                          onClick={() => startEditingSubtask(subtask)}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => deleteSubtask(task.id, subtask.id)}
                          className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        >
                          削除
                        </button>
                      </>
                    )}
                  </div>
                ))}

                {/* Add subtask */}
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newSubtaskTitle[task.id] || ''}
                    onChange={(e) => setNewSubtaskTitle({ ...newSubtaskTitle, [task.id]: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addSubtask(task.id)}
                    placeholder="サブタスクを追加..."
                    className="flex-1 px-3 py-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={() => addSubtask(task.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    追加
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
            タスクがありません。新しいタスクを追加してください。
          </div>
        )}
      </div>
    </div>
  );
}
