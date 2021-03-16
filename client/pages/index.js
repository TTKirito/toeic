import Link from 'next/link'
import useRequest from '../hooks/use-request'
import {useState} from 'react'
import Router from 'next/router'
import Section from './admin/section/index'
import Skill from './admin/skills'

const LandingPage = ({currentUser, sections,  skills}) =>{
    const skillsList = skills.map((skill)=>{
        return(
            <div>
                <li key={skill.id}>
                {skill.title}
                &nbsp;
                <button onClick={()=>Router.push('/admin/skills/updateSkills/[skillId]', `/admin/skills/updateSkills/${skill.id}`)} className="btn btn-primary">update</button>
                &nbsp;
                <button onClick={()=>Router.push('/admin/skills/deleteSkills/[skillId]', `/admin/skills/deleteSkills/${skill.id}`)} className="btn btn-danger">Delete</button>

                </li>
                <hr/>
            </div>
        )
    })
    
    const sectionsList = sections.map((section) => {
        return (
            <div key={section.title}>

                <h3>{section.title}
                {currentUser && currentUser.role === 1 &&(
                    <>
                    &nbsp;
                    <button onClick={()=>Router.push('/admin/section/updateSection/[sectionId]', `/admin/section/updateSection/${section.id}`)} className="btn btn-primary">update</button>
                    &nbsp;
                    <button onClick={()=>Router.push('/admin/section/deleteSection/[sectionId]', `/admin/section/deleteSection/${section.id}`)} className="btn btn-danger">Delete</button>
                    
                    </>
                )}
                </h3>
                
                <table  className="table">
                        <tbody>
                            {
                                section.part.map((part) => {
                                    return (
                                      <tr key={part.id}>
                                        <td>{part.title}</td>
                                        <td>{part.description}</td>
                                        <td>
                                            <Link href="/part/[partId]" as={`/part/${part.id}`}>
                                                <a>View</a>
                                            </Link>
                                        </td>
                                       {currentUser && currentUser.role === 1 && (
                                           <>
                                                 <td>
                                       <button onClick={()=>Router.push('/admin/part/updatePart/[partId]', `/admin/part/updatePart/${part.id}`)} className="btn btn-primary">update</button>
                                        <button onClick={()=>Router.push('/admin/part/deletePart/[partId]', `/admin/part/deletePart/${part.id}`)} className="btn btn-danger">delete</button>
                                        </td>
                                           </>
                                       )}
                                      </tr>
                                    );
                                  })

                            }  
                        </tbody>
                        {currentUser && currentUser.role ===1 &&(
                            <>
                                <hr/>
                        <button className="btn btn-primary" onClick={()=>Router.push("/admin/part/[partId]", `/admin/part/${section.id}`)}>Add Part</button>

                            </>
                        )}
                </table>
                <hr />
            </div>
        );
      });

    
    return  (
        <div>
            <div>
            {sectionsList}
            {currentUser && currentUser.role === 1 && (
                  <div>
                      <h3>Section</h3>
                  <Section />
                  <hr/>
                  <h3>Skill:</h3>
                  <ul>
                  {skillsList}
                  </ul>
                  <Skill />
                  </div>
            )}
            </div>
        </div>
    )
}

LandingPage.getInitialProps = async (context,client) =>{
    const { data:sections } = await client.get('/api/section')
    const {data: skills} = await client.get('/api/skills')
    return { sections,skills }
}

export default LandingPage