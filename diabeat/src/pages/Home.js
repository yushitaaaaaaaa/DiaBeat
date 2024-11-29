import { useState, useEffect } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

//components
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(`/api/workouts?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_WORKOUTS", payload: json });
      }
    };

    if (user) {
      fetchWorkouts();
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
      <div className="workouts">
        {workouts &&
          workouts.map((workout) => (
            <WorkoutDetails key={workout._id} workout={workout} />
          ))}
      </div>
      <WorkoutForm />
    </div>
  );
};
export default Home;









// import {useEffect} from 'react'
// import {useWorkoutsContext} from '../hooks/useWorkoutsContext'
// import {useAuthContext} from '../hooks/useAuthContext' 

// //components
// import WorkoutDetails from '../components/WorkoutDetails'
// import WorkoutForm from '../components/WorkoutForm'

// const Home = ()=>{
//     const {workouts, dispatch} = useWorkoutsContext()
//     const {user}=useAuthContext()

//     useEffect(() =>{
//         const fetchWorkouts = async()=>{
//             const response = await fetch('/api/workouts', {
//                 headers: {
//                     'Authorization': `Bearer ${user.token}`
//                 }
//             })
//             const json = await response.json()

//             if (response.ok){
//                 dispatch({type: 'SET_WORKOUTS', payload: json})
//                 //setWorkouts(json)
//             }
//         }
//         if (user){
//             fetchWorkouts()
//         }
        

//     }, [dispatch, user])  //dependency array

//     return(
//         <div className="home">
//         <div className="workouts">
//             {workouts && workouts.map((workout)=>(
//                 <WorkoutDetails key={workout._id} workout={workout}/>
//             ))}
//         </div>
//         <WorkoutForm />
//         </div>
//     )
// }
// export default Home;
