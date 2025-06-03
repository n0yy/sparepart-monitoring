import React from "react";

export default function KanbanCard({
  title,
  icon,
  value,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  value: number;
  onClick?: () => void;
}) {
  return (
    <div
      className="card bg-base-100 w-96 shadow-sm hover:cursor-pointer"
      onClick={onClick}
    >
      <div className="card-body">
        <h2 className="card-title text-2xl">
          {title}
          <div>{icon}</div>
        </h2>
        <div className="card-actions justify-end text-6xl font-bold flex items-end">
          {value}
          <span className="text-sm">Item</span>
        </div>
      </div>
    </div>
  );
}
