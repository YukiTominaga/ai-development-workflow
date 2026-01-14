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
  subTasks: SubTask[];
  isExpanded: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [newSubTaskTitle, setNewSubTaskTitle] = useState<{ [taskId: string]: string }>({});

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        status: 'Pending',
        subTasks: [],
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

  const startEditingTask = (taskId: string, currentTitle: string) => {
    setEditingTaskId(taskId);
    setEditingTitle(currentTitle);
  };

  const saveTaskEdit = (taskId: string) => {
    if (editingTitle.trim()) {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, title: editingTitle } : task
      ));
    }
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const cancelTaskEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const toggleTaskExpansion = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task
    ));
  };

  const addSubTask = (taskId: string) => {
    const subTaskTitle = newSubTaskTitle[taskId]?.trim();
    if (subTaskTitle) {
      const newSubTask: SubTask = {
        id: Date.now().toString(),
        title: subTaskTitle,
        status: 'Pending',
      };
      setTasks(tasks.map(task =>
        task.id === taskId
          ? { ...task, subTasks: [...task.subTasks, newSubTask] }
          : task
      ));
      setNewSubTaskTitle({ ...newSubTaskTitle, [taskId]: '' });
    }
  };

  const deleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subTasks: task.subTasks.filter(st => st.id !== subTaskId) }
        : task
    ));
  };

  const updateSubTaskStatus = (taskId: string, subTaskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subTasks: task.subTasks.map(st =>
              st.id === subTaskId ? { ...st, status } : st
            ),
          }
        : task
    ));
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-200 text-gray-700';
      case 'Running':
        return 'bg-blue-200 text-blue-700';
      case 'Completed':
        return 'bg-green-200 text-green-700';
    }
  };

  const getStatusButtonColor = (status: TaskStatus, currentStatus: TaskStatus) => {
    if (status === currentStatus) {
      switch (status) {
        case 'Pending':
          return 'bg-gray-500 text-white';
        case 'Running':
          return 'bg-blue-500 text-white';
        case 'Completed':
          return 'bg-green-500 text-white';
      }
    }
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          TODO管理アプリ
        </h1>

        {/* Add New Task */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">新しいタスクを追加</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="タスクのタイトルを入力..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              追加
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              タスクがありません。新しいタスクを追加してください。
            </div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTaskExpansion(task.id)}
                      className="mt-1 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {task.isExpanded ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1">
                      {editingTaskId === task.id ? (
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && saveTaskEdit(task.id)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => saveTaskEdit(task.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                          >
                            保存
                          </button>
                          <button
                            onClick={cancelTaskEdit}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            キャンセル
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </div>
                      )}

                      {/* Status Buttons */}
                      <div className="flex gap-2 mb-3">
                        {(['Pending', 'Running', 'Completed'] as TaskStatus[]).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateTaskStatus(task.id, status)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${getStatusButtonColor(status, task.status)}`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      {editingTaskId !== task.id && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEditingTask(task.id, task.title)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                          >
                            編集
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                          >
                            削除
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* SubTasks */}
                  {task.isExpanded && (
                    <div className="mt-6 ml-9 border-l-2 border-gray-200 pl-6">
                      <h4 className="text-md font-semibold text-gray-700 mb-3">サブタスク</h4>

                      {/* Add SubTask */}
                      <div className="flex gap-2 mb-4">
                        <input
                          type="text"
                          value={newSubTaskTitle[task.id] || ''}
                          onChange={(e) => setNewSubTaskTitle({ ...newSubTaskTitle, [task.id]: e.target.value })}
                          onKeyPress={(e) => e.key === 'Enter' && addSubTask(task.id)}
                          placeholder="サブタスクを追加..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                          onClick={() => addSubTask(task.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          追加
                        </button>
                      </div>

                      {/* SubTasks List */}
                      <div className="space-y-3">
                        {task.subTasks.length === 0 ? (
                          <p className="text-gray-500 text-sm">サブタスクがありません</p>
                        ) : (
                          task.subTasks.map((subTask) => (
                            <div key={subTask.id} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center gap-3 mb-2">
                                <p className="flex-1 text-gray-800">{subTask.title}</p>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subTask.status)}`}>
                                  {subTask.status}
                                </span>
                              </div>

                              {/* SubTask Status Buttons */}
                              <div className="flex gap-2 mb-2">
                                {(['Pending', 'Running', 'Completed'] as TaskStatus[]).map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => updateSubTaskStatus(task.id, subTask.id, status)}
                                    className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${getStatusButtonColor(status, subTask.status)}`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>

                              {/* SubTask Delete Button */}
                              <button
                                onClick={() => deleteSubTask(task.id, subTask.id)}
                                className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs"
                              >
                                削除
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
