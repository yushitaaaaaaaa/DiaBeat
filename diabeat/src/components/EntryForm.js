import {useState} from 'react'
import {useEntriesContext} from '../hooks/useEntriesContext'
import { useAuthContext } from '../hooks/useAuthContext'

const EntryForm = ()=>{
    const {dispatch} = useEntriesContext()
    const {user} = useAuthContext()

    const[timewhen, setTimeWhen] = useState('')
    const[bloodsugar, setBloodSugar] = useState('')
    const[insulin, setInsulin] = useState('')
    const[error, setError] = useState('')
    const[emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) =>{
        e.preventDefault()

        if (!user){
            setError('You must be logged in')
            return
        }

        const entry={timewhen, bloodsugar, insulin}

        const response= await fetch('/api/entries', {
            method: 'POST',
            body: JSON.stringify(entry),
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
            setTimeWhen('')
            setBloodSugar('')
            setInsulin('')

            dispatch({type: 'CREATE_ENTRY', payload:json})
        }
    }

    return(
        <form className="create" onSubmit={handleSubmit}>
            <h3>Log an Entry</h3>


            <input 
            type="text" 
            onChange={(e)=>setTimeWhen(e.target.value)} 
            value={timewhen}
            className={emptyFields.includes('timewhen')?'error':''}
            />



            <label>Blood Sugar(mg/dL):</label>
            <input 
            type="number" 
            onChange={(e)=>setBloodSugar(e.target.value)} 
            value={bloodsugar}
            className={emptyFields.includes('bloodsugar')?'error':''}
            />

            <label>Insulin(IU/mL):</label>
            <input 
            type="number" 
            onChange={(e)=>setInsulin(e.target.value)} 
            value={insulin}
            className={emptyFields.includes('insulin')?'error':''}
            />

            <button>Add Entry</button>

            {error && <div className="error">{error}</div>}
        </form>
    )


}

export default EntryForm;
