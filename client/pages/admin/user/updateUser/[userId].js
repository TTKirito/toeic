import { useState, useEffect } from 'react'
import useRequest from '../../../../hooks/use-request'
import Router from 'next/router'
const User = ({userId}) => {
    const [email, setEmail]=useState('')
    const [role,setRole]=useState(0)
    const [money,setMoney]=useState(0)
    const { doRequest, errors } = useRequest({
        url: `/api/users/allUser/${userId}`,
        method: 'patch',
        body:{
        },
        onSuccess: ()=>Router.push('/auth/current-user')
    })

    const onSubmit = async event => {
        event.preventDefault()
        await doRequest({
            email,
            role,
            money
        })
    }
    
    return (
        <form onSubmit={onSubmit}>
            <h1>Update User</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="form-control"
                />
            </div>
        
            <div className="form-group">
                <label>Role</label>
                <input
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Money</label>
                <input
                    value={money}
                    onChange={e => setMoney(e.target.value)}
                    className="form-control"
                />
            </div>
            {errors}
            <button className="btn btn-primary">Update</button>
        </form>
    )
}


User.getInitialProps = async (context, client) =>{
    const userId = context.query.userId
    return {userId}
}


export default User