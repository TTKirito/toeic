
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../../hooks/use-request'


const Part1 = ({part1})=>{
    const { doRequest } = useRequest({
        url: `/api/part1/${part1.id}`,
        method: 'delete',
        body: {},
        onSuccess: () => Router.push(`/part/${part1.part.id}`)
    })

    useEffect(() => {
        doRequest()
    },[])

    return <div>Delete...</div>
       
}

Part1.getInitialProps = async (context, client) => {
    const part1Id = context.query.part1Id
    const {data:part1} = await client.get(`/api/part1/${part1Id}`)
    return {part1}
   
}


export default Part1