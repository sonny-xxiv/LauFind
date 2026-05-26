import React from "react";

const StatCard = ({
  title,
  value,
  subtitle,
  Icon,
  iconClass = "text-rouge",
}) => {
  return (
    <div className="flex-1 min-w-56 rounded-2xl bg-white p-6 shadow-md border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">
          {title}
        </p>
        {Icon ? <Icon className={`h-6 w-6 ${iconClass}`} /> : null}
      </div>
      <div className="mb-4 text-4xl font-semibold text-gray-900">{value}</div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

export default StatCard;
