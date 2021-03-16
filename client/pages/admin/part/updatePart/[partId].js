
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../../hooks/use-request'


const section = ({skills,parts})=>{
    if(skills.length < 1){
        return(
            <div>please add skills</div>
        )
    }
  const [part,setPart] = useState('')
  const [skill,setSkill] = useState(skills[0].id)
  const [description, setDescription]=useState('')
  const [expiresAt,setEpiresAt]=useState(0)
  const { doRequest, errors } = useRequest({
      url: `/api/part/${parts.id}`,
      method: 'patch',
      body:{
          
      },
      onSuccess: ()=> Router.push('/')
  })



  const onSubmit = async event => {
      event.preventDefault()
      await doRequest({
          title: part,
          description,
          section: parts.section.id,
          skills: skill,
          expiresAt,
      })
  }
  


    const handleChangeSkill = (e) => {
      e.preventDefault()

      
      setSkill(e.target.value)
      
    }
    

 

  return (
      <div>

          <h3>Part:</h3>
              <form onSubmit={onSubmit}>
      
      <div className="form-group">
              <label>Part:</label>
              <input
                  value={part}
                  className="form-control"
                  onChange={(e)=>setPart(e.target.value)}
              />
          </div>
          <div className="form-group">
              <label>Description:</label>
              <input
                  value={description}
                  className="form-control"
                  onChange={(e)=>setDescription(e.target.value)}
              />
          </div>
          <div className="form-group">
              <label>expiresAt:</label>
              <input
                  value={expiresAt}
                  className="form-control"
                  onChange={(e)=>setEpiresAt(e.target.value)}
              />
          </div>

               
          
              
            
          <div className="form-group">
                <label>Skills: </label>
              
              {skills.length > 1  ?(
              <div>
                <select 
                name='skills'
              value={skill}
              onChange={handleChangeSkill} 
              >
               {skills.map(skill => (
                   <option key={skill.id} value={skill.id}>{skill.title}</option>
               ))}
              </select>
                
              </div>
              ):(<ul>
                  {skills[0].title}
              </ul>)}
          </div>
              
            
          
             
  
            
          
       <div>
       <button className="btn btn-primary">Update part</button>
       </div>
       {errors}
       </form>
       </div>
  )
}
section.getInitialProps = async (context,client) =>{
  const partId = context.query.partId
  const {data: parts} = await client.get(`/api/part/${partId}`)
  const {data:skills} = await client.get('/api/skills')
  return {skills,parts}

}

export default section


