import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'
import axios from 'axios'
import Image from '../admin/image/[image]'
import Audio from '../admin/image/audio'

const ExamShow = ({exams,part1,currentUser})=>{
    const [timeLeft, setTimeLeft] = useState(0)
    const [dung,setdung]=useState('')
    const [giaithich,setgiaithich]=useState('')
    const [dich,setdich]=useState('')
    const [next,setnext]=useState('block')
    const [showdiv,setshowdiv]=useState('none')
    const [secondsLeft, setSecondsLeft] = useState(0)
    const [value,setvalue]=useState(0)
    const [traloi,settraloi]=useState([])
    const [checked,setChecked]=useState("")




   
  
    const { doRequest, errors } = useRequest({
        url: '/api/submit',
        method: 'post',
        body:{},
        onSuccess: (submit)=>Router.push('/result/[resultId]',`/result/${submit.id}` )
    })

    if(part1.question.length === 0){
        return (
            <div>
                <h1>No question</h1>
                {currentUser && currentUser.role === 1 &&(<button onClick={()=>Router.push('/admin/question/[questionId]',`/admin/question/${part1.id}`)} className="btn btn-primary">Add Question</button>)}
            </div>
        )   
    }

    if(!exams.expiresAt){
        function dapan(x){
            if(value<part1.question.length){
               
                if(x===part1.question[value].answer){
        
                    setdung('dung')
                    setgiaithich(part1.question[value].giaithich)
                    setdich(part1.question[value].dich)
                    setshowdiv('block')
                    setnext('block')
                    
                
                }else{
                    setdung('sai')
                    setgiaithich(part1.question[value].giaithich)
                    setdich(part1.question[value].dich)
                    setnext('block')
                    setshowdiv('block')
        
                }
               
            } 
            
        }
        
        
        
        
            async function newa (x){
                
        
                  
                    var z=x+1
                    var a=traloi
                    if(x === part1.question.length -1){
                        a.push({dung,skills: part1.question[value].skills, question: part1.question[value].id})
                        settraloi(a)
                        const corrects = []
                        const noanswers = []
                        const incorrects = []
                        for(let i=0;i<traloi.length;i++){
                           if(traloi[i].dung === ''){
                               noanswers.push(traloi[i])
                           }else if(traloi[i].dung === 'dung'){
                               corrects.push(traloi[i])
                           }else {
                               incorrects.push(traloi[i])
                           }
                        }
                        await doRequest({
                         correct:corrects.length,
                         incorrect:incorrects.length,
                         noanswer:noanswers.length,
                         examId: exams.id
                     }) 
                    } else if(x < part1.question.length - 1){
                        if(checked){
                            setChecked("")
                        }
                        setvalue(z)
                         setnext('block')
                         setgiaithich('')
                         setdich('')
                         setshowdiv('none')
                         setdung('')
                         Router.push(`/exam/${exams.id}`)
                         
                        a.push({dung,skills: part1.question[value].skills, question: part1.question[value].id})
                        settraloi(a)
                        console.log(traloi)
                    
                      
                       
                    }
        
                    
                    
            }
            return(
                <div>
                   {part1.question[value].imageUrl && ( 
                   <div>
                       <img src={part1.question[value].imageUrl} alt={part1.question[value].imageUrl} style={{width:350,height:350}} />
                    <button className="btn btn-danger" onClick={()=>Router.push(`/admin/image/deleteImage/[imageId]`,`/admin/image/deleteImage/${part}`)}>Delete</button>
                   </div>
                   )}
                   {currentUser && currentUser.role ===1  &&(<div>
                        <Image  questionId={part1.question[value].id} examId={exams.id} />
                   </div>)}

                    <div style={{color: 'red'}}>{dung}</div>
                    <div>{part1.question[value].title}:{part1.question[value].description}&nbsp;
                    {currentUser&&currentUser.role===1&&(
                        <>
                            &nbsp;
                             <button className="btn btn-primary" onClick={()=> Router.push(`/admin/question/updateQuestion/[questionId]`, `/admin/question/updateQuestion/${part1.question[value].id}`)}>Update</button>
                            &nbsp;
                                <button className="btn btn-danger" onClick={()=> Router.push(`/admin/question/deleteQuestion/[questionId]`, `/admin/question/deleteQuestion/${part1.question[value].id}`)}>Delete</button>
                        </>
                    )}
                     
                     </div>
                    <form>
                <label className="container">{part1.question[value].A}
                  <input checked={checked === part1.question[value].A} onClick={(x)=>{setChecked(x.target.value)}} onChange={()=>{dapan(part1.question[value].A)}} value={part1.question[value].A} type="radio" name="radio"/>
                 
                </label>
                
                <label className="container">{part1.question[value].B}
                  <input checked={checked === part1.question[value].B} onClick={(x)=>{setChecked(x.target.value)}} onChange={()=>{dapan(part1.question[value].B)}} value={part1.question[value].B} type="radio" name="radio"/>
                  
                </label>
                <label className="container">{part1.question[value].C}
                  <input checked={checked === part1.question[value].C} onClick={(x)=>{setChecked(x.target.value)}} onChange={()=>{dapan(part1.question[value].C)}} value={part1.question[value].C} type="radio" name="radio"/>
                 
                </label>
                <label className="container">{part1.question[value].D}
                  <input checked={checked === part1.question[value].D}  onClick={(x)=>{setChecked(x.target.value)}} onChange={()=>{dapan(part1.question[value].D)}} value={part1.question[value].D} type="radio" name="radio"/>
                  
                </label>
                {part1.question[value].audioUrl && (
                       <audio controls>
                           <source 
                                src={part1.question[value].audioUrl}
                                type="audio/mpeg"
                           />
                       </audio>
                   )}

              </form>

              {currentUser && currentUser.role ===1 &&(<div>
                        <Audio  questionId={part1.question[value].id} examId={exams.id} />
                   </div>)}
             
            <div style={{display:`${showdiv}`}}>
               {part1.question[value].giaithich&& (<p>gai tich: {giaithich}</p>)}
                {part1.question[value].dich&&(<p>dich:{dich}</p>)}
              </div>
              <button className='btn btn-primary' onClick={()=>{newa(value)}}style={{display:`${next}`}}>next</button>
               {errors}
              <div>
              {currentUser && currentUser.role === 1 && (<button onClick={()=>Router.push('/admin/question/[questionId]',`/admin/question/${part1.id}`)} className="btn btn-primary">Add Question</button>)}
              </div>
                </div>
               
            )
    }


        useEffect(()=>{
            const findTimeLeft =()=>{
                const msLeft= new Date(exams.expiresAt) - new Date()
                
                
                setTimeLeft(Math.floor((msLeft % (1000*60*60))/(1000*60)))
                setSecondsLeft(Math.floor((msLeft % (1000*60))/(1000)))
            }
            findTimeLeft()
            const timeId = setInterval(findTimeLeft,1000)
            return ()=>{
                clearInterval(timeId)
            }
        },[exams])
        if(timeLeft < 0 && secondsLeft <0){
            return (
                <div>
                    <button className="btn btn-primary" onClick={()=>{submit(value)}}style={{display:`${next}`}}>submit</button>
                    {errors}
                </div>
            )
        }
    

   
    
   
       
async function submit (x){
    console.log(traloi)
    const corrects = []
    const noanswers = []
    const incorrects = []
    for(let i=0;i<traloi.length;i++){
        if(traloi[i].dung === ''){
            noanswers.push(traloi[i])
        }else if(traloi[i].dung === 'dung'){
            corrects.push(traloi[i])
        }else {
            incorrects.push(traloi[i])
        }
    }
    const questLength = part1.question.length
    if(traloi.length <questLength){
        for(let i=0; i< questLength;i++){
           if(traloi[i] === undefined){
               noanswers.push({dung: "",skills: part1.question[x].skills,question: part1.question[x].id})
           }

        }
    }

    
    await doRequest({
        correct:corrects.length,
        incorrect:incorrects.length,
        noanswer:noanswers.length,
        examId: exams.id
    })
}


function dapan(x){
       
        if(x===part1.question[value].answer){

            setdung('dung')
            setgiaithich(part1.question[value].giaithich)
            setdich(part1.question[value].dich)
            setshowdiv('block')
            setnext('block')
            
        
        }else{
            setdung('sai')
            setgiaithich(part1.question[value].giaithich)
            setdich(part1.question[value].dich)
            setnext('block')
            setshowdiv('block')

        }
       
    
    
}




    async function newa (x){
         var z=x+1
        var a=traloi
        if(x === part1.question.length -1){
            a.push({dung,skills: part1.question[value].skills, question: part1.question[value].id})
            settraloi(a)
            const corrects = []
            const noanswers = []
            const incorrects = []
            for(let i=0;i<traloi.length;i++){
               if(traloi[i].dung === ''){
                   noanswers.push(traloi[i])
               }else if(traloi[i].dung === 'dung'){
                   corrects.push(traloi[i])
               }else {
                   incorrects.push(traloi[i])
               }
            }
            await doRequest({
             correct:corrects.length,
             incorrect:incorrects.length,
             noanswer:noanswers.length,
             examId: exams.id
         }) 
        } else if(x < part1.question.length - 1){
            if(checked){
                setChecked("")
            }
            setvalue(z)
             setnext('block')
             setgiaithich('')
             setdich('')
             setshowdiv('none')
             setdung('')
             Router.push(`/exam/${exams.id}`)
             
            a.push({dung,skills: part1.question[value].skills, question: part1.question[value].id})
            settraloi(a)
            console.log(traloi)
        
          
           
        }
            
    }
    

    return(
        <div>
         <div>Time left to exam: {timeLeft}:{secondsLeft} seconds</div>
           {part1.question[value].imageUrl && ( <img src={part1.question[value].imageUrl} alt={part1.question[value].imageUrl} style={{width:350,height:350}} />)}
           {currentUser && currentUser.role ===1  &&(<div>
                        <Image  questionId={part1.question[value].id} examId={exams.id} />
                   </div>)}
            <div style={{color: 'red'}}>{dung}</div>
            <div>{part1.question[value].title}:{part1.question[value].description}
            {currentUser&&currentUser.role===1&&(
                        <>
                            &nbsp;
                             <button className="btn btn-primary" onClick={()=> Router.push(`/admin/question/updateQuestion/[questionId]`, `/admin/question/updateQuestion/${part1.question[value].id}`)}>Update</button>
                            &nbsp;
                                <button className="btn btn-danger" onClick={()=> Router.push(`/admin/question/deleteQuestion/[questionId]`, `/admin/question/deleteQuestion/${part1.question[value].id}`)}>Delete</button>
                        </>
                    )}
                     
            
            </div>
            <form>
        <label className="container">{part1.question[value].A}
          <input checked={checked === part1.question[value].A} onClick={(x)=>{setChecked(x.target.value)}} onChange={()=>{dapan(part1.question[value].A)}} value={part1.question[value].A} type="radio" name="radio"/>
         
        </label>
        
        <label className="container">{part1.question[value].B}
          <input checked={checked === part1.question[value].B} onClick={(x)=>{setChecked(x.target.value)}} onChange={()=>{dapan(part1.question[value].B)}} value={part1.question[value].B} type="radio" name="radio"/>
          
        </label>
        <label className="container">{part1.question[value].C}
          <input checked={checked === part1.question[value].C} onClick={(x)=>{setChecked(x.target.value)}} onChange={()=>{dapan(part1.question[value].C)}} value={part1.question[value].C} type="radio" name="radio"/>
         
        </label>
        <label className="container">{part1.question[value].D}
          <input checked={checked === part1.question[value].D}  onClick={(x)=>{setChecked(x.target.value)}} onChange={()=>{dapan(part1.question[value].D)}} value={part1.question[value].D} type="radio" name="radio"/>
          
        </label>
        {part1.question[value].audioUrl && (
               <audio controls>
                   <source 
                        src={part1.question[value].audioUrl}
                        type="audio/mpeg"
                   />
               </audio>
           )}
          
      </form>
     
      <div style={{display:`${showdiv}`}}>
        <p>y nghia: {giaithich}</p>
<p>dich:{dich}</p>
      </div>
      <button className='btn btn-primary' onClick={()=>{newa(value)}}style={{display:`${next}`}}>next</button>
      { currentUser && currentUser.role ===1 &&(<div>
                        <Audio  questionId={part1.question[value].id} examId={exams.id} />
                   </div>)}
       {errors}
       <div>
       {currentUser && currentUser.role === 1&&(<button onClick={()=>Router.push('/admin/question/[questionId]',`/admin/question/${part1.id}`)} className="btn btn-primary">Add Question</button>)}

       </div>

        </div>
       
    )
}

ExamShow.getInitialProps = async (context,client) =>{
    const {examId} = context.query
    const {data:exams} = await client.get(`/api/exams/${examId}`)
    const part1Id = exams.part1.id
    const {data:part1} = await client.get(`/api/part1/${part1Id}`)
 
    return {exams,part1}
}


export default ExamShow