import { Search } from "lucide-react";

function DataTable({
  title,
  showSearch = true,
  search,
  searchPlaceholder = "Search...",
  onSearchChange,
  columns,
  data,
  getRowKey,
  emptyMessage = "No records found",
}) {
  return (
    <section className="data-table-card">
      <div className="data-table-toolbar">
        <div>
          <h3>{title}</h3>
          <p>{data.length} records</p>
        </div>

        {showSearch && (
          <label className="data-table-search">
            <Search size={17} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </label>
        )}
      </div>

      <div className="data-table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((row, index) => (
                <tr key={getRowKey ? getRowKey(row, index) : index}>
                  {columns.map((column) => (
                    <td key={column.key} data-label={column.header}>
                      {column.render ? column.render(row, index) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="data-table-empty" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DataTable;
