
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../../hooks/use-request'



const Part1 = ({part1})=>{
    const [part1s,setPart1s] = useState('')
    const [money,setMoney]=useState(0)
    const { doRequest, errors } = useRequest({
        url: `/api/part1/${part1.id}`,
        method: 'patch',
        body:{
            
        },
        onSuccess: ()=> Router.push(`/part/${part1.part.id}`)
    })
  
  
   
  
  
    const onSubmit = async event => {
        event.preventDefault()
        await doRequest({
            title: part1s,
            money,
            part: part1.part.id,
        })
    }
    
  
  
     
    return (
        <div>
  
            <h3>Part1:</h3>
                <form onSubmit={onSubmit}>
        
        <div className="form-group">
                <label>Part1:</label>
                <input
                    value={part1s}
                    className="form-control"
                    onChange={(e)=>setPart1s(e.target.value)}
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
         <button className="btn btn-primary">Update part1</button>
         </div>
         {errors}
         </form>
         </div>
    )
}

Part1.getInitialProps = async (context,client)=>{
    const part1Id = context.query.part1Id
  const {data:part1} = await client.get(`/api/part1/${part1Id}`)
  return {part1}
}

export default Part1