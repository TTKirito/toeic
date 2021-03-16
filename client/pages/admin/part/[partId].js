
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../hooks/use-request'
import Section from '../section/index'
import Skills from '../skills/index'

const section = ({sections,skills})=>{
  
  if(skills.length <1){
    return (
      <div>Please add skill</div>
    )
  }
 
  const [part,setPart] = useState('')
  const [skill,setSkill] = useState(skills[0].id)
  const [description, setDescription]=useState('')
  const [expiresAt,setEpiresAt]=useState(0)
  const { doRequest, errors } = useRequest({
      url: '/api/part',
      method: 'post',
      body:{
          
      },
      onSuccess: ()=> Router.push('/')
  })


  
  

  const onSubmit = async event => {
      event.preventDefault()
      await doRequest({
          title: part,
          description,
          section: sections.id,
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
              
              {skills.length > 1 ? (
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
              ):(
                <li>{skills[0].title}</li>
              )}
          </div>


          
          
       <div>
       <button className="btn btn-primary">Add part</button>
       </div>
       {errors}
       </form>
       </div>
  )
}
section.getInitialProps = async (context,client) =>{
  const sectionId = context.query.partId
  console.log(sectionId)
  const {data: sections} = await client.get(`/api/section/${sectionId}`)
  const {data:skills} = await client.get('/api/skills')
  return {sections,skills}

}

export default section


