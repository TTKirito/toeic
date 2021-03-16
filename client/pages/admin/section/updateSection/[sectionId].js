
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../../hooks/use-request'


const section = ({sectionId})=>{
    const [section,setSection] = useState('')
    const { doRequest, errors } = useRequest({
        url: `/api/section/${sectionId}`,
        method: 'patch',
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

    return (
        <div>

            <h3>Section:</h3>
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
         <button className="btn btn-primary">Update section</button>
         </div>
         </div>
         {errors}
         </form>
         </div>
        
    )
       
}

section.getInitialProps = async (context, client) => {
   const sectionId = context.query.sectionId
   return {sectionId}
   
}


export default section