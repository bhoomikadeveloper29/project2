import React, { useState } from 'react';

interface Column {
  key: string;
  title: string;
}

interface DataItem {
  [key: string]: any;
}

interface ConfigurableTableProps {
  columns: Column[];
  data: DataItem[];
}

const ConfigurableTable: React.FC<ConfigurableTableProps> = ({ columns, data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => new Set(columns.map(column => column.key)));
  
  const handleToggleColumn = (key: string) => {
    setVisibleColumns(prev => {
      const updatedVisibleColumns = new Set(prev);
      if (updatedVisibleColumns.has(key)) {
        updatedVisibleColumns.delete(key);
      } else {
        updatedVisibleColumns.add(key);
      }
      return updatedVisibleColumns;
    });
  };

  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder('asc');
    }
  };

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (value) => typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (sortBy) {
    filteredData.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
      }
    });
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                <label>
                  <input
                    type="checkbox"
                    checked={visibleColumns.has(column.key)}
                    onChange={() => handleToggleColumn(column.key)}
                  />
                  {column.title}
                </label>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              {columns.map((column) => (
                visibleColumns.has(column.key) &&
                <td key={column.key}>{item[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ConfigurableTable;
