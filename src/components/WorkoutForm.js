import {useState} from 'react'
import {useWorkoutsContext} from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

const WorkoutForm = ()=>{
    const {dispatch} = useWorkoutsContext()
    const {user} = useAuthContext()

    const[title, setTitle] = useState('')
    const[load, setLoad] = useState('')
    const[reps, setReps] = useState('')
    const[error, setError] = useState('')
    const[emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) =>{
        e.preventDefault()

        if (!user){
            setError('You must be logged in')
            return
        }

        const workout={title, load, reps}

        const response= await fetch('/api/workouts', {
            method: 'POST',
            body: JSON.stringify(workout),
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        
        const json = await response.json()

        if(!response.ok){
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }

        if(response.ok){
            setEmptyFields([])
            setError(null)
            setTitle('')
            setLoad('')
            setReps('')

            dispatch({type: 'CREATE_WORKOUT', payload:json})
        }
    }

    return(
        <form className="create" onSubmit={handleSubmit}>
            <h3>Log an Entry</h3>


            <input 
            type="text" 
            onChange={(e)=>setTitle(e.target.value)} 
            value={title}
            className={emptyFields.includes('title')?'error':''}
            />



            <label>Blood Sugar(mg/dL):</label>
            <input 
            type="number" 
            onChange={(e)=>setLoad(e.target.value)} 
            value={load}
            className={emptyFields.includes('load')?'error':''}
            />

            <label>Insulin(IU/mL):</label>
            <input 
            type="number" 
            onChange={(e)=>setReps(e.target.value)} 
            value={reps}
            className={emptyFields.includes('reps')?'error':''}
            />

            <button>Add Entry</button>

            {error && <div className="error">{error}</div>}
        </form>
    )


}

export default WorkoutForm;