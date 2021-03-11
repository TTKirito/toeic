import Link from 'next/link'
import useRequest from '../hooks/use-request'
import {useState} from 'react'
import Router from 'next/router'

const LandingPage = ({currentUser, sections,skills}) =>{
    const [section,setSection] = useState('')
    const { doRequest, errors } = useRequest({
        url: '/api/section',
        method: 'post',
        body:{
            
        },
        onSuccess: ()=> Router.push('/')
    })


    const onSubmit = async event => {
        event.preventDefault()
        await doRequest({
            title: section
        })
    }

    const addSkills = (skills)=>{
        const [skill,setSkill] = useState('')
        const { doRequest, errors } = useRequest({
            url: '/api/skills',
            method: 'post',
            body:{
                
            },
            onSuccess: ()=> Router.push('/')
        })
    
    
        const onSubmit = async event => {
            event.preventDefault()
            await doRequest({
                title: skill
            })
        }

        return (
            <div>

                <h3>Skills:</h3>
                <ul>
                    {skillsList}
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
             <button className="btn btn-primary">Add skills</button>
             </div>
             </div>
             {errors}
             </form>
                </ul>

             </div>
            
        )
    }
    const addPath = (sections,skills)=>{
        const [parts,setParts] = useState('')
        const [expiresAt,setExpiresAt]=useState(0)
        const [skill1,setSkill1] = useState('')
        const [section1,setSection1] = useState('')
        const [description,setDescription]=useState('')
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
                title: parts,
                section: section1,
                skills: skill1,
                expiresAt: expiresAt,
                description: description
            })
        }

        const sectionChange = (e)=>{
            e.preventDefault()
            setSection1(e.target.value)
        }

        const skillChange = (e)=>{
            e.preventDefault()
            setSkill1(e.target.value)
        }
        
        return (
            <div>

                <h3>Part:</h3>
             
                  
                    <form onSubmit={onSubmit}>
            
                    <div className="form-group">
            <label>Title:</label>
             <input
                value={parts}
                onChange={e => setParts(e.target.value)}
                className="form-control"
             />
            </div>
            <div className="form-group">
                <label>expiresAt:</label>
             <input
                value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)}
                className="form-control"
             />
             </div>
             <div className="form-group">
                <label>description:</label>
             <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="form-control"
             />
             </div>
             <div className="form-group">
            <label>Section:</label>
             <select
                value={section1}
                onChange={sectionChange}
                className="form-control"
             >
                {
                    sections.map((section)=>{
                        return(
                            <option key={section.id} value={section.id}>{section.title}</option>
                        )
                    })
                }
             </select>
             </div>
             <div className="form-group">
            <label>Skills:</label>
             <select
                value={skill1}
                onChange={skillChange}
                className="form-control"
             >
                {
                    skills.map((skill)=>{
                        return(
                            <option key={skill.id} value={skill.id}>{skill.title}</option>
                        )
                    })
                }
             </select>
                </div>
             
            
             <button className="btn btn-primary">Add Path</button>
           
             {errors}
             </form>
             

             </div>
            
        )
    }



    const skillsList=skills.map((skill)=>{
       return(
        <li key={skill.title}>{skill.title}</li>
       )
    })
    
    const sectionsList = sections.map((section) => {
        return (
            <div key={section.title}>
                <h3>{section.title}</h3>
                <table  className="table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Link</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                section.part.map((part) => {
                                    return (
                                      <tr key={part.id}>
                                        <td>{part.title}</td>
                                        <td>
                                            <Link href="/part/[partId]" as={`/part/${part.id}`}>
                                                <a>View</a>
                                            </Link>
                                        </td>
                                      </tr>
                                    );
                                  })

                            }  
                        </tbody>
                        
                </table>

            </div>
        );
      });

    
    return  (
        <div>
            {sectionsList}
           {currentUser&& ( 
           
          
              currentUser.role === 1 &&( <div>

              <form onSubmit={onSubmit}>
          
          <div className="form-row">
           <div className="col">
           <input
              value={section}
              onChange={e => setSection(e.target.value)}
              className="form-control"
           />
           </div>
           <div className="col">
           <button className="btn btn-primary">Add section</button>
           </div>
           </div>
           {errors}
           </form>
           
          {addSkills(skills)}
           {addPath(sections,skills)}
         




        </div>)
          

             )}
             
        </div>
    )
}

LandingPage.getInitialProps = async (context,client) =>{
    const { data:sections } = await client.get('/api/section')
    const { data:skills } = await client.get('/api/skills')
    return { sections,skills }
}

export default LandingPage