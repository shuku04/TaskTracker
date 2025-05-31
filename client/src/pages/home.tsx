import { useState } from "react";
import { CheckSquare, BarChart3, Clock, CheckCircle, Circle } from "lucide-react";
import { KanbanColumn } from "@/components/kanban-column";
import { AddTaskModal } from "@/components/add-task-modal";
import { useTasks, useUpdateTask } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import type { Task } from "@shared/schema";

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const { data: tasks = [], isLoading } = useTasks();
  const updateTask = useUpdateTask();
  const { toast } = useToast();

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.currentTarget.classList.add("dragging");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTask(null);
    e.currentTarget.classList.remove("dragging");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask.status === newStatus) {
      return;
    }

    updateTask.mutate(
      {
        id: draggedTask.id,
        updates: { status: newStatus as "todo" | "in-progress" | "done" },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: `Task moved to ${newStatus.replace("-", " ")}`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to move task",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">TaskFlow</h1>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{tasks.length}</span>
              <span>tasks total</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">My Task Board</h2>
          <p className="text-gray-600">Drag tasks between columns or click to move them</p>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <KanbanColumn
            title="Todo"
            status="todo"
            tasks={todoTasks}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onAddTask={() => setIsAddModalOpen(true)}
          />
          
          <KanbanColumn
            title="In Progress"
            status="in-progress"
            tasks={inProgressTasks}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
          
          <KanbanColumn
            title="Done"
            status="done"
            tasks={doneTasks}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 rounded-full p-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-xl font-bold text-gray-900">{tasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 rounded-full p-2">
                  <Circle className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Todo</p>
                  <p className="text-xl font-bold text-gray-900">{todoTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 rounded-full p-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-xl font-bold text-gray-900">{inProgressTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-100 rounded-full p-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-xl font-bold text-gray-900">{doneTasks.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}