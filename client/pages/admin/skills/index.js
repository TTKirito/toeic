
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../hooks/use-request'


const Skills = ()=>{


        const [skill,setSkill] = useState('')
        const { doRequest, errors } = useRequest({
            url: '/api/skills',
            method: 'post',
            body:{
                
            },
            onSuccess: ()=> Router.push(`/`)
        })
    
    
        const onSubmit = async event => {
            event.preventDefault()
            await doRequest({
                title: skill
            })
        }

        return (
            <div>

                
                    <form onSubmit={onSubmit}>
            
            <div className="form-row">
             <div className="col">
             <input
                value={skill}
                onChange={e => setSkill(e.target.value)}
                className="form-control"
             />
             </div>
             <div className="col">
             <button className="btn btn-primary">Add Skill:</button>
             </div>
             </div>
             {errors}
             </form>
             </div>
            
        )

}


  

export default Skills