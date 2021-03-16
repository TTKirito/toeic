
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../../hooks/use-request'


const Part = ({partId})=>{
    const { doRequest } = useRequest({
        url: `/api/part/${partId}`,
        method: 'delete',
        body: {},
        onSuccess: () => Router.push('/')
    })

    useEffect(() => {
        doRequest()
    },[])

    return <div>Delete...</div>
       
}

Part.getInitialProps = async (context, client) => {
   const partId = context.query.partId
   return {partId}
   
}


export default Part