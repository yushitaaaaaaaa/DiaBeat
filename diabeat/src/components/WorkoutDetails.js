import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(workout.title);
  const [updatedLoad, setUpdatedLoad] = useState(workout.load);
  const [updatedReps, setUpdatedReps] = useState(workout.reps);

  const handleDelete = async () => {
    if (!user) {
      return;
    }

    const response = await fetch("/api/workouts/" + workout._id, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: json });
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!user) {
      return;
    }

    const updatedWorkout = {
      title: updatedTitle,
      load: updatedLoad,
      reps: updatedReps,
    };

    const response = await fetch("/api/workouts/" + workout._id, {
      method: "PATCH",
      body: JSON.stringify(updatedWorkout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "UPDATE_WORKOUT", payload: json });
      setIsEditing(false);
    }
  };

  return (
    <div className="workout-details">
      {isEditing ? (
        <form onSubmit={handleEdit}>
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
          />
          <input
            type="number"
            value={updatedLoad}
            onChange={(e) => setUpdatedLoad(e.target.value)}
          />
          <input
            type="number"
            value={updatedReps}
            onChange={(e) => setUpdatedReps(e.target.value)}
          />
          <button type="submit">Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h4>{workout.title}</h4>
          <p>
            <strong>Blood Sugar (mg/dL):</strong> {workout.load}
          </p>
          <p>
            <strong>Insulin (IU/mL):</strong> {workout.reps}
          </p>
          <p>
            {formatDistanceToNow(new Date(workout.createdAt), {
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

export default WorkoutDetails;












// import {useWorkoutsContext} from '../hooks/useWorkoutsContext'
// import {useAuthContext} from '../hooks/useAuthContext'

// import formatDistanceToNow from 'date-fns/formatDistanceToNow'

// const WorkoutDetails = ({workout})=>{
//     const {dispatch} = useWorkoutsContext()
//     const {user}=useAuthContext()

//     const handleClick = async() => {
//         if (!user){
//             return
//         }
//         const response = await fetch('/api/workouts/'+ workout._id, {
//             method: 'DELETE',
//             headers: {
//                 'Authorization': `Bearer ${user.token}`
//             }
//         })
//         const json = await response.json()

//         if (response.ok){
//             dispatch({type: 'DELETE_WORKOUT', payload: json})
//         }
//     }

//     return(
//         <div className="workout-details">
//             <h4>{workout.title}</h4>
//             <p><strong>Blood Sugar(mg/dL):</strong>{workout.load}</p>
//             <p><strong>Insulin(IU/mL):</strong>{workout.reps}</p>
//             <p>{formatDistanceToNow(new Date(workout.createdAt), {addSuffix: true})}</p>
//             <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
//         </div>
//     )
// }

// export default WorkoutDetails