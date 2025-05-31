import { useState } from "react";
import { Circle, Clock, CheckCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./task-card";
import type { Task } from "@shared/schema";

interface KanbanColumnProps {
  title: string;
  status: "todo" | "in-progress" | "done";
  tasks: Task[];
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: string) => void;
  onAddTask?: () => void;
}

export function KanbanColumn({
  title,
  status,
  tasks,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onAddTask,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const getIcon = () => {
    switch (status) {
      case "todo":
        return <Circle className="w-3 h-3 text-gray-400" />;
      case "in-progress":
        return <Clock className="w-3 h-3 text-amber-500" />;
      case "done":
        return <CheckCircle className="w-3 h-3 text-emerald-500" />;
    }
  };

  const getCountColor = () => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-gray-700";
      case "in-progress":
        return "bg-amber-100 text-amber-700";
      case "done":
        return "bg-emerald-100 text-emerald-700";
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(e, status);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className={`column-header ${status}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h2 className="font-semibold text-gray-900">{title}</h2>
          </div>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getCountColor()}`}>
            {tasks.length}
          </span>
        </div>
      </div>

      {status === "todo" && onAddTask && (
        <div className="p-4 border-b border-gray-100">
          <Button
            onClick={onAddTask}
            className="w-full bg-primary hover:bg-blue-600 text-white font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New Task
          </Button>
        </div>
      )}

      <div
        className={`p-4 space-y-3 min-h-[400px] drop-zone ${isDragOver ? "drag-over" : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No tasks in {title.toLowerCase()}</p>
          </div>
        )}
      </div>
    </div>
  );
}