import { useState, useEffect } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'
const currentuser = ({currentUser,pays}) => {
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

        </div>

        
    )
}
currentuser.getInitialProps = async (context,client) =>{
    const { data:pays } = await client.get('/api/users/pay')
   
    return { pays}
}


export default currentuser