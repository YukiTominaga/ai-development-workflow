'use client';

import { useState } from 'react';

type Status = 'Pending' | 'Running' | 'Completed';

interface Subtask {
  id: string;
  title: string;
  status: Status;
}

interface Task {
  id: string;
  title: string;
  status: Status;
  subtasks: Subtask[];
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<{ [key: string]: string }>({});

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addTask = () => {
    if (newTaskTitle.trim() === '') return;
    const newTask: Task = {
      id: generateId(),
      title: newTaskTitle,
      status: 'Pending',
      subtasks: [],
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const updateTaskStatus = (taskId: string, status: Status) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status } : task
      )
    );
  };

  const startEditingTask = (taskId: string, currentTitle: string) => {
    setEditingTaskId(taskId);
    setEditingTitle(currentTitle);
  };

  const saveTaskTitle = (taskId: string) => {
    if (editingTitle.trim() === '') return;
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, title: editingTitle } : task
      )
    );
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const addSubtask = (taskId: string) => {
    const subtaskTitle = newSubtaskTitle[taskId] || '';
    if (subtaskTitle.trim() === '') return;

    const newSubtask: Subtask = {
      id: generateId(),
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
  };

  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.filter((st) => st.id !== subtaskId),
            }
          : task
      )
    );
  };

  const updateSubtaskStatus = (taskId: string, subtaskId: string, status: Status) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, status } : st
              ),
            }
          : task
      )
    );
  };

  const startEditingSubtask = (subtaskId: string, currentTitle: string) => {
    setEditingSubtaskId(subtaskId);
    setEditingSubtaskTitle(currentTitle);
  };

  const saveSubtaskTitle = (taskId: string, subtaskId: string) => {
    if (editingSubtaskTitle.trim() === '') return;
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((st) =>
                st.id === subtaskId ? { ...st, title: editingSubtaskTitle } : st
              ),
            }
          : task
      )
    );
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  };

  const cancelEditingSubtask = () => {
    setEditingSubtaskId(null);
    setEditingSubtaskTitle('');
  };

  const getStatusColor = (status: Status) => {
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
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Add New Task */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            新しいタスクを追加
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="タスク名を入力..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              追加
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                タスクがありません。上のフォームから新しいタスクを追加してください。
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
              >
                {/* Task Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {editingTaskId === task.id ? (
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveTaskTitle(task.id)}
                          className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => saveTaskTitle(task.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        >
                          保存
                        </button>
                        <button
                          onClick={cancelEditingTask}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                        >
                          キャンセル
                        </button>
                      </div>
                    ) : (
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                        {task.title}
                      </h3>
                    )}
                    <div className="flex gap-2 items-center flex-wrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as Status)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Running">Running</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    {editingTaskId !== task.id && (
                      <button
                        onClick={() => startEditingTask(task.id, task.title)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                      >
                        編集
                      </button>
                    )}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                      削除
                    </button>
                  </div>
                </div>

                {/* Subtasks */}
                <div className="ml-4 border-l-2 border-gray-300 dark:border-gray-600 pl-4">
                  <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    サブタスク ({task.subtasks.length})
                  </h4>

                  {/* Add Subtask */}
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newSubtaskTitle[task.id] || ''}
                      onChange={(e) =>
                        setNewSubtaskTitle({ ...newSubtaskTitle, [task.id]: e.target.value })
                      }
                      onKeyPress={(e) => e.key === 'Enter' && addSubtask(task.id)}
                      placeholder="サブタスク名を入力..."
                      className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <button
                      onClick={() => addSubtask(task.id)}
                      className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      追加
                    </button>
                  </div>

                  {/* Subtask List */}
                  <div className="space-y-2">
                    {task.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        className="bg-gray-50 dark:bg-gray-700 rounded p-3 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          {editingSubtaskId === subtask.id ? (
                            <div className="flex gap-2 mb-1">
                              <input
                                type="text"
                                value={editingSubtaskTitle}
                                onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                                onKeyPress={(e) =>
                                  e.key === 'Enter' && saveSubtaskTitle(task.id, subtask.id)
                                }
                                className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                                autoFocus
                              />
                              <button
                                onClick={() => saveSubtaskTitle(task.id, subtask.id)}
                                className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                              >
                                保存
                              </button>
                              <button
                                onClick={cancelEditingSubtask}
                                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs"
                              >
                                キャンセル
                              </button>
                            </div>
                          ) : (
                            <p className="text-sm text-gray-700 dark:text-gray-200 mb-1">
                              {subtask.title}
                            </p>
                          )}
                          <div className="flex gap-2 items-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subtask.status)}`}>
                              {subtask.status}
                            </span>
                            <select
                              value={subtask.status}
                              onChange={(e) =>
                                updateSubtaskStatus(task.id, subtask.id, e.target.value as Status)
                              }
                              className="px-2 py-0.5 border border-gray-300 dark:border-gray-600 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Running">Running</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-2">
                          {editingSubtaskId !== subtask.id && (
                            <button
                              onClick={() => startEditingSubtask(subtask.id, subtask.title)}
                              className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                            >
                              編集
                            </button>
                          )}
                          <button
                            onClick={() => deleteSubtask(task.id, subtask.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                          >
                            削除
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
