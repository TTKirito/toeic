
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../../hooks/use-request'


const section = ({sectionId})=>{
    const { doRequest } = useRequest({
        url: `/api/section/${sectionId}`,
        method: 'delete',
        body: {},
        onSuccess: () => Router.push('/')
    })

    useEffect(() => {
        doRequest()
    },[])

    return <div>Delete...</div>
       
}

section.getInitialProps = async (context, client) => {
   const sectionId = context.query.sectionId
   return {sectionId}
   
}


export default section