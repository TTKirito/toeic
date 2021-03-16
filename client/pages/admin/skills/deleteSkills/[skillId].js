
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../../hooks/use-request'


const Skills = ({skillId})=>{
    const { doRequest } = useRequest({
        url: `/api/skills/${skillId}`,
        method: 'delete',
        body: {},
        onSuccess: () => Router.push('/')
    })

    useEffect(() => {
        doRequest()
    },[])

    return <div>Delete...</div>
       
}

Skills.getInitialProps = async (context, client) => {
   const skillId = context.query.skillId
   return {skillId}
   
}


export default Skills