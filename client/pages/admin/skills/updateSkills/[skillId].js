
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../../hooks/use-request'


const Skills = ({skillId})=>{


        const [skill,setSkill] = useState('')
        const { doRequest, errors } = useRequest({
            url: `/api/skills/${skillId}`,
            method: 'patch',
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
            
                <label>Skill:</label>
            
             <div className="col">
             <input
                value={skill}
                onChange={e => setSkill(e.target.value)}
                className="form-control"
             />
             </div>
             <div className="col">
             <button className="btn btn-primary">Update Skill:</button>
             </div>
             </div>
             {errors}
             </form>
             </div>
            
        )

}
Skills.getInitialProps = async (context, client) => {
    const skillId = context.query.skillId
    return {skillId}
    
 }
export default Skills