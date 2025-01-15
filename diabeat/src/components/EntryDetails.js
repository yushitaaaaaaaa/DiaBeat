import { useState } from "react";
import { useEntriesContext } from "../hooks/useEntriesContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const EntryDetails = ({ entry }) => {
  const { dispatch } = useEntriesContext();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTimeWhen, setUpdatedTimeWhen] = useState(entry.timewhen);
  const [updatedBloodSugar, setUpdatedBloodSugar] = useState(entry.bloodsugar);
  const [updatedInsulin, setUpdatedInsulin] = useState(entry.insulin);

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch("/api/entries/" + entry._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_ENTRY", payload: json });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    const updatedEntry = {
      timewhen: updatedTimeWhen,
      bloodsugar: updatedBloodSugar,
      insulin: updatedInsulin,
    };

    const response = await fetch("/api/entries/" + entry._id, {
      method: "PATCH",
      body: JSON.stringify(updatedEntry),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_ENTRY", payload: json });
      setIsEditing(false);
    }
  };

  return (
    <div className="entry-details">
      {isEditing ? (
        <form onSubmit={handleEdit}>
          <input
            type="text"
            value={updatedTimeWhen}
            onChange={(e) => setUpdatedTimeWhen(e.target.value)}
          />
          <input
            type="number"
            value={updatedBloodSugar}
            onChange={(e) => setUpdatedBloodSugar(e.target.value)}
          />
          <input
            type="number"
            value={updatedInsulin}
            onChange={(e) => setUpdatedInsulin(e.target.value)}
          />
          <button type="submit">Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h4>{entry.timewhen}</h4>
          <p>
            <strong>Blood Sugar (mg/dL):</strong> {entry.bloodsugar}
          </p>
          <p>
            <strong>Insulin (IU/mL):</strong> {entry.insulin}
          </p>
          <p>
            {formatDistanceToNow(new Date(entry.createdAt), {
              addSuffix: true,
            })}
          </p>
          <span
            className="material-symbols-outlined"
            onClick={handleDelete}
          >
            delete
          </span>
          <span
            className="material-symbols-outlined"
            onClick={() => setIsEditing(true)}
          >
            edit
          </span>
        </>
      )}
    </div>
  );
};

export default EntryDetails;


