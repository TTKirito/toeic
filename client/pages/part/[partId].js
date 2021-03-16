import Router from 'next/router'
import { useState } from 'react'
import useRequest from '../../hooks/use-request'
import Link from 'next/link'
const PartShow = ({currentUser,parts}) =>{
    const { doRequest, errors } = useRequest({
        url: '/api/exams',
        method: 'post',
        body:{
            
        },
        onSuccess: (exam) => Router.push('/exam/[examId]', `/exam/${exam.id}`)
    })


    
    const part1List = parts.part1.map((part1) => {
        return (
            <tr key={part1.id}>
              <td>{part1.title}</td>
              <td>
                <button onClick={()=>doRequest({part1Id: part1.id})} className='btn btn-primary'>work</button>
              </td>
              <td>
              {currentUser && currentUser.role === 1 && (<button onClick={()=>Router.push('/admin/part1/updatePart1/[part1Id]', `/admin/part1/updatePart1/${part1.id}`)} className="btn btn-primary">update</button>)} 
              {currentUser && currentUser.role === 1 && (<button onClick={()=>Router.push('/admin/part1/deletePart1/[part1Id]', `/admin/part1/deletePart1/${part1.id}`)} className="btn btn-danger">delete</button>)} 

              </td>
            </tr>
            
          );
        });
        return (
            <div>
              <h2>{parts.title}</h2>
              <table className="table">
                <tbody>{part1List}</tbody>
              </table>
            {currentUser && currentUser.role===1 &&( <button className="btn btn-primary" onClick={()=>Router.push('/admin/part1/[part1Id]',`/admin/part1/${parts.id}`)}>Add Part1</button>)}
              {errors}
              
            </div>
          );

}

PartShow.getInitialProps = async (context,client) => {
    const {partId} =context.query
    const {data: parts} = await client.get(`/api/part/${partId}`)

    return { parts }
}


export default PartShow