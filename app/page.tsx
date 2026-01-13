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
  isExpanded: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState<{ [taskId: string]: string }>({});

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: 'Pending',
        subtasks: [],
        isExpanded: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
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
    setEditingTitle(task.title);
  };

  const saveTaskEdit = (taskId: string) => {
    if (editingTitle.trim()) {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, title: editingTitle } : task
      ));
      setEditingTaskId(null);
      setEditingTitle('');
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const toggleTaskExpansion = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task
    ));
  };

  const addSubtask = (taskId: string) => {
    const subtaskTitle = newSubtaskTitle[taskId]?.trim();
    if (subtaskTitle) {
      const newSubtask: SubTask = {
        id: `${taskId}-${Date.now()}`,
        title: subtaskTitle,
        status: 'Pending',
      };
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, subtasks: [...task.subtasks, newSubtask] }
          : task
      ));
      setNewSubtaskTitle({ ...newSubtaskTitle, [taskId]: '' });
    }
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

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Pending': return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'Running': return 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Completed': return 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-900 dark:to-black py-8 px-4">
      <main className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            TODO管理アプリ
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            タスクとサブタスクを管理し、ステータスを追跡できます
          </p>

          {/* タスク追加フォーム */}
          <div className="flex gap-3 mb-8">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="新しいタスクを入力..."
              className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <button
              onClick={addTask}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              追加
            </button>
          </div>

          {/* タスクリスト */}
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                タスクがありません。新しいタスクを追加してください。
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="border border-slate-200 dark:border-zinc-700 rounded-xl bg-slate-50 dark:bg-zinc-900 overflow-hidden"
                >
                  {/* タスクヘッダー */}
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTaskExpansion(task.id)}
                        className="mt-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      >
                        <svg
                          className={`w-5 h-5 transition-transform ${task.isExpanded ? 'rotate-90' : ''}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>

                      <div className="flex-1 min-w-0">
                        {editingTaskId === task.id ? (
                          <div className="flex gap-2 mb-2">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && saveTaskEdit(task.id)}
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={() => saveTaskEdit(task.id)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              保存
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              キャンセル
                            </button>
                          </div>
                        ) : (
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                            {task.title}
                          </h3>
                        )}

                        <div className="flex flex-wrap items-center gap-2">
                          {/* ステータスボタン */}
                          <div className="flex gap-1">
                            {(['Pending', 'Running', 'Completed'] as TaskStatus[]).map((status) => (
                              <button
                                key={status}
                                onClick={() => updateTaskStatus(task.id, status)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                                  task.status === status
                                    ? getStatusColor(status) + ' ring-2 ring-offset-1 ring-blue-500 dark:ring-blue-400'
                                    : 'bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-zinc-600'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>

                          {task.subtasks.length > 0 && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              サブタスク: {task.subtasks.filter(st => st.status === 'Completed').length}/{task.subtasks.length}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* タスクアクション */}
                      <div className="flex gap-2">
                        {editingTaskId !== task.id && (
                          <button
                            onClick={() => startEditingTask(task)}
                            className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            title="編集"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="削除"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* サブタスク */}
                  {task.isExpanded && (
                    <div className="border-t border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4">
                      {/* サブタスク追加フォーム */}
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={newSubtaskTitle[task.id] || ''}
                          onChange={(e) => setNewSubtaskTitle({ ...newSubtaskTitle, [task.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && addSubtask(task.id)}
                          placeholder="サブタスクを追加..."
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => addSubtask(task.id)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          追加
                        </button>
                      </div>

                      {/* サブタスクリスト */}
                      <div className="space-y-2">
                        {task.subtasks.length === 0 ? (
                          <div className="text-center py-4 text-slate-400 dark:text-slate-500 text-sm">
                            サブタスクがありません
                          </div>
                        ) : (
                          task.subtasks.map((subtask) => (
                            <div
                              key={subtask.id}
                              className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-zinc-900 rounded-lg"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-slate-900 dark:text-white mb-2">
                                  {subtask.title}
                                </p>
                                <div className="flex gap-1">
                                  {(['Pending', 'Running', 'Completed'] as TaskStatus[]).map((status) => (
                                    <button
                                      key={status}
                                      onClick={() => updateSubtaskStatus(task.id, subtask.id, status)}
                                      className={`px-2 py-1 rounded-full text-xs font-medium transition-all ${
                                        subtask.status === status
                                          ? getStatusColor(status) + ' ring-2 ring-offset-1 ring-blue-500 dark:ring-blue-400'
                                          : 'bg-slate-200 text-slate-600 dark:bg-zinc-700 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-zinc-600'
                                      }`}
                                    >
                                      {status}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => deleteSubtask(task.id, subtask.id)}
                                className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                title="削除"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* 統計情報 */}
        {tasks.length > 0 && (
          <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">統計</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-100 dark:bg-zinc-900 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tasks.filter(t => t.status === 'Pending').length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Pending</div>
              </div>
              <div className="text-center p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tasks.filter(t => t.status === 'Running').length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Running</div>
              </div>
              <div className="text-center p-4 bg-green-100 dark:bg-green-900 rounded-lg">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {tasks.filter(t => t.status === 'Completed').length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
