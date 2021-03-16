
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../hooks/use-request'


const Question = ({part1})=>{
   



    const [question,setQuestion] = useState('')
    const [description, setDescription]=useState('')
  const [dich,setDich] = useState('')
  const [giaithich,setGiaithich] =useState('')
  const [answer,setAnswer] = useState('')
  const [A,setA] = useState('') 
  const [B,setB] = useState('') 
  const [C,setC] = useState('') 
  const [D,setD] = useState('') 
 
  const { doRequest, errors } = useRequest({
      url: '/api/question',
      method: 'post',
      body:{
          
      },
      onSuccess: ()=> Router.push(`/exam/${part1.examId}`)
  })


  


  const onSubmit = async event => {
      event.preventDefault()
      await doRequest({
          title: question,
          description,
          dich,
          part1:part1.id,
          giaithich,
          answer,
          A,
          B,
          C,
          D,
          section: part1.part.section,
          skills:part1.part.skills,
          part: part1.part.id
      })
  }
  



   

  return (
      <div>

          <h3>Question:</h3>
              <form onSubmit={onSubmit}>
      
      <div className="form-group">
              <label>Question:</label>
              <input
                  value={question}
                  className="form-control"
                  onChange={(e)=>setQuestion(e.target.value)}
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
              <label>Dich:</label>
              <input
                  value={dich}
                  className="form-control"
                  onChange={(e)=>setDich(e.target.value)}
              />
          </div>
          <div className="form-group">
              <label>Giai Thich:</label>
              <input
                  value={giaithich}
                  className="form-control"
                  onChange={(e)=>setGiaithich(e.target.value)}
              />
          </div>
          <div className="form-group">
              <label>Answer:</label>
              <input
                  value={answer}
                  className="form-control"
                  onChange={(e)=>setAnswer(e.target.value)}
              />
          </div>
          <div className="form-group">
              <label>A:</label>
              <input
                  value={A}
                  className="form-control"
                  onChange={(e)=>setA(e.target.value)}
              />
          </div>
          <div className="form-group">
              <label>B:</label>
              <input
                  value={B}
                  className="form-control"
                  onChange={(e)=>setB(e.target.value)}
              />
          </div>
          <div className="form-group">
              <label>C:</label>
              <input
                  value={C}
                  className="form-control"
                  onChange={(e)=>setC(e.target.value)}
              />
          </div>
          <div className="form-group">
              <label>D:</label>
              <input
                  value={D}
                  className="form-control"
                  onChange={(e)=>setD(e.target.value)}
              />
          </div>        
       <div>
       <button className="btn btn-primary">Add Question</button>
       </div>
       {errors}
       </form>
       </div>
  )
}


Question.getInitialProps = async(context,client)=>{
   const part1Id = context.query.questionId
   const {data: part1}=await client.get(`/api/part1/${part1Id}`)
   console.log(part1)
   return {part1}
}




export default Question