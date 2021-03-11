import Router from 'next/router'
import { useState } from 'react'
import useRequest from '../../hooks/use-request'


const PartShow = ({currentUser,parts}) =>{
    const { doRequest, errors } = useRequest({
        url: '/api/exams',
        method: 'post',
        body:{
            
        },
        onSuccess: (exam) => Router.push('/exam/[examId]', `/exam/${exam.id}`)
    })


    const addPart1 = (part)=>{
      const [part1,setPart1] = useState('')
      const [money,setMoney] = useState(0)
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
              part: part.id
          })
      }

      return (
          <div>

          
                  <form onSubmit={onSubmit}>
          <div className="form-row">
           <div className="col">
             <label>Title</label>
           <input
              value={part1}
              onChange={e => setPart1(e.target.value)}
              className="form-control"
           />
           </div>
           <div className="col">
          <label>money:</label>
           <input
              value={money}
              onChange={e => setMoney(e.target.value)}
              className="form-control"
           />
           </div>
           <div className="col">
           <button className="btn btn-primary">Add Part1</button>
           </div>
           </div>
           {errors}
           </form>

           </div>
          
      )
  }

    const part1List = parts.part1.map((part1) => {
        return (
            <tr key={part1.id}>
              <td>{part1.title}</td>
              <td>
                <button onClick={()=>doRequest({part1Id: part1.id})} className='btn btn-primary'>work</button>
              </td>
            </tr>
            
          );
        });
        return (
            <div>
              <h2>{parts.title}</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Link</th>
                  </tr>
                </thead>
                <tbody>{part1List}</tbody>
              </table>
              {errors}
              {currentUser && (
                currentUser.role === 1 && addPart1(parts)
              )}
            </div>
          );

}

PartShow.getInitialProps = async (context,client) => {
    const {partId} =context.query
    const {data: parts} = await client.get(`/api/part/${partId}`)

    return { parts }
}


export default PartShow