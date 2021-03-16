
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../../hooks/use-request'


const User = ({userId})=>{
    const { doRequest } = useRequest({
        url: `/api/users/allUser/${userId}`,
        method: 'delete',
        body: {},
        onSuccess: () => Router.push(`/auth/current-user`)
    })

    useEffect(() => {
        doRequest()
    },[])

    return <div>Delete...</div>
       
}




User.getInitialProps = async (context, client) =>{
    const userId = context.query.userId
    return {userId}
}


export default User