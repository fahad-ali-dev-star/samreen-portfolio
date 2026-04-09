import React from 'react';

export function ProjectFilters({ activeFilter, onChange }) {
  const filters = [
    { label: 'All', value: 'all' },
    { label: 'UI/UX', value: 'UI/UX Design' },
    { label: 'Graphic', value: 'Graphic Design' },
    { label: 'Branding', value: 'Branding' },
  ];

  return (
    <div className="filter-bar">
      {filters.map(filter => (
        <button
          key={filter.value}
          className={`filter-btn ${activeFilter === filter.value ? 'active' : ''}`}
          onClick={() => onChange(filter.value)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
