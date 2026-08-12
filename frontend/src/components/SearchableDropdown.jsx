import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

function SearchableDropdown({ label, value, onChange, options, placeholder = "Select option" }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedOptions = useMemo(
    () => options.map((option) => (typeof option === "string" ? { label: option, value: option } : option)),
    [options]
  );

  const filteredOptions = normalizedOptions.filter((option) =>
    option.label.toLowerCase().includes(query.toLowerCase())
  );
  const selected = normalizedOptions.find((option) => option.value === value);

  return (
    <div className="form-field searchable-dropdown">
      {label && <span className="form-label">{label}</span>}
      <button className="form-control searchable-dropdown-trigger" type="button" onClick={() => setOpen((current) => !current)}>
        <span className={selected || value ? "" : "dropdown-placeholder"}>{selected?.label || value || placeholder}</span>
        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="searchable-dropdown-menu">
          <div className="searchable-dropdown-search">
            <Search size={15} />
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search..." />
          </div>
          <div className="searchable-dropdown-options">
            {filteredOptions.length ? (
              filteredOptions.map((option) => (
                <button
                  className="searchable-dropdown-option"
                  type="button"
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setQuery("");
                    setOpen(false);
                  }}
                >
                  <span>{option.label}</span>
                  {option.value === value && <Check size={15} />}
                </button>
              ))
            ) : (
              <div className="searchable-dropdown-empty">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableDropdown;
