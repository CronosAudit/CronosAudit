"use client";

import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = "",
}) => {
  return (
    <nav
      className={`flex items-center gap-2 text-sm text-text-400 ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="mx-1 text-text-500">/</span>}

          {item.href || item.onClick ? (
            <button
              onClick={item.onClick}
              className={`
                transition-colors
                hover:text-accent-amber
                ${!item.href && !item.onClick ? "text-text-300" : "text-text-400"}
              `}
            >
              {item.label}
            </button>
          ) : (
            <span className="text-text-100 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
