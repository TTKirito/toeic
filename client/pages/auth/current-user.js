import { useState, useEffect } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'
const currentuser = ({currentUser,pays,submit,users}) => {
    const [money,setMoney] = useState(0)
    const { doRequest, errors } = useRequest({
        url: '/api/users/pay',
        method: 'post',
        body:{
            amout:money
        },
        onSuccess: (money)=> Router.push(money)
    })

    const onSubmit = async event => {
        event.preventDefault()
        await doRequest()
    }
    return (
        <div>
            <h1>CurrentUser:</h1>
             <p>Email: {currentUser.email}</p>
             <p>Money: {currentUser.money}</p>
             <form onSubmit={onSubmit}>
             <h3>Nap Tien: $</h3>
             <div className="form-row">
             <div className="col">
             <input
                value={money}
                onChange={e => setMoney(e.target.value)}
                className="form-control"
             />
             </div>
             <div className="col">
             <button className="btn btn-primary">Nap Tien</button>
             </div>
             </div>
             {errors}
             </form>
             <h3>History:</h3>
            <ul>
                {
                    pays.map(pay =>(
                        <li key={pay}>paypalId: {pay.paypalId} - amout: {pay.amout}</li>
                    ))
                }
            </ul>
            <h3>Exam history:</h3>
            <ul>
                {submit.map(submit =>(
                    <li key={submit.id}>Correct: {submit.correct} - inCorrect: {submit.incorrect} - noAnswer: {submit.noanswer}</li>
                ))}
            </ul>

            {currentUser && currentUser.role===1 &&(
                <div>
                    <h3>All User:</h3>
                <ul>
                    {users.map(user=>(
                        <li key={user.id}>Email:{user.email} - Password:{user.password} - Role:{user.role} - Money{user.money} &nbsp; 
                            <button className="btn btn-primary" onClick={()=> Router.push('/admin/user/updateUser/[userId]',`/admin/user/updateUser/${user.id}`)}>Update</button>
                        &nbsp;
                        <button className="btn btn-danger" onClick={()=> Router.push('/admin/user/deleteUser/[userId]',`/admin/user/deleteUser/${user.id}`)}>Delete</button>
                        </li>
                    ))}
                </ul>
                </div>
            )}
        </div>

        
    )
}
currentuser.getInitialProps = async (context,client) =>{
    console.log('ha')
    const { data:pays } = await client.get('/api/users/pay')
   const {data: submit} = await client.get('/api/submit')
   const {data: users} = await client.get('/api/users/allUser')

    return { pays,submit, users}
}


export default currentuser