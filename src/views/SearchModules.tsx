import { useState } from 'react';

interface Modules {
  moduleCode: string;
  title: string;
}

function SearchModules({ data }: any) {
  const [searchField, setSearchField] = useState('');

  const filteredPersons =
    data &&
    data.filter((module: any) => {
      return (
        module.moduleCode.toLowerCase().includes(searchField.toLowerCase()) ||
        module.title.toLowerCase().includes(searchField.toLowerCase())
      );
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };

  function searchList() {
    return (
      <ul>
        {filteredPersons &&
          filteredPersons.map((module: Modules) => (
            <li key={module.moduleCode}>
              <h3>
                {module.moduleCode}: {module.title}
              </h3>
            </li>
          ))}
      </ul>
    );
  }

  return (
    <section>
      <div>
        <h2>Search your course</h2>
      </div>
      <div>
        <input
          type="search"
          placeholder="Search Modules"
          onChange={handleChange}
        />
      </div>
      {searchList()}
    </section>
  );
}

export default SearchModules;
