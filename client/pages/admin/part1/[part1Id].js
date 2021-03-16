
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../hooks/use-request'



const Part = ({parts})=>{

   

    const [part1,setPart1] = useState('')
    const [money,setMoney]=useState(0)
    const { doRequest, errors } = useRequest({
        url: '/api/part1',
        method: 'post',
        body:{
            
        },
        onSuccess: ()=> Router.push(`/part/${parts.id}`)
    })
  
  
   
  
  
    const onSubmit = async event => {
        event.preventDefault()
        await doRequest({
            title: part1,
            money,
            part: parts.id
        })
    }
    
  
     
    return (
        <div>
  
            <h3>Part1:</h3>
                <form onSubmit={onSubmit}>
        
        <div className="form-group">
                <label>Part1:</label>
                <input
                    value={part1}
                    className="form-control"
                    onChange={(e)=>setPart1(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Money:</label>
                <input
                    value={money}
                    className="form-control"
                    onChange={(e)=>setMoney(e.target.value)}
                />
            </div>
       
            
         <div>
         <button className="btn btn-primary">Add part1</button>
         </div>
         {errors}
         </form>
         </div>
    )
}

Part.getInitialProps = async (context,client)=>{
    const partId = context.query.part1Id
    const {data: parts} = await client.get(`/api/part/${partId}`)
    return {parts}
}

export default Part