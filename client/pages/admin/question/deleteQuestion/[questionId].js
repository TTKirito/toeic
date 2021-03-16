
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../../hooks/use-request'


const Question = ({questions})=>{
    const { doRequest } = useRequest({
        url: `/api/question/${questions.id}`,
        method: 'delete',
        body: {},
        onSuccess: () => Router.push(`/exam/${questions.part1.examId}`)
    })

    useEffect(() => {
        doRequest()
    },[])

    return <div>Delete...</div>
       
}


Question.getInitialProps = async(context,client)=>{
    const questionId = context.query.questionId
    const {data: questions} = await client.get(`/api/question/${questionId}`)
    console.log(questions)
    return {questions}
 }
 
 
 
 
 export default Question