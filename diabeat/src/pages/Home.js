import { useState, useEffect } from "react";
import { useEntriesContext } from "../hooks/useEntriesContext";
import { useAuthContext } from "../hooks/useAuthContext";

//components
import EntryDetails from "../components/EntryDetails";
import EntryForm from "../components/EntryForm";

const Home = () => {
  const { entries, dispatch } = useEntriesContext();
  const { user } = useAuthContext();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      const response = await fetch(`/api/entries?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_ENTRIES", payload: json });
      }
    };

    if (user) {
      fetchEntries();
    }
  }, [dispatch, user, search]); // dependency array

  return (
    <div className="home">
      <div className="search">
        <input
          type="text"
          placeholder="Search Entries"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="entries">
        {entries &&
          entries.map((entry) => (
            <EntryDetails key={entry._id} entry={entry} />
          ))}
      </div>
      <EntryForm />
    </div>
  );
};
export default Home;





