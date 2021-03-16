
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../hooks/use-request'


const section = ()=>{
    

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

        return (
            <div>

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
             </div>
            
        )

}




export default section