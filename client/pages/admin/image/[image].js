
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../hooks/use-request'
import Axios from 'axios'


const Image = ({questionId, examId})=>{
    const [image,setImage] = useState(null)
    const [errors,setErrors] = useState(null)
    const onFileChange=(event)=>{
        if(event.target.files && event.target.files.length === 1){
            const pickedFile = event.target.files[0]
            setImage(pickedFile)
        }
    }

    const onSubmit=async(event)=>{
        event.preventDefault()
        const formData= new FormData()
        formData.append('questionId',questionId)
        formData.append('image',image)
        try{
            const response = await Axios.post('/api/image',formData)
            if(response.data){
                Router.push(`/exam/${examId}`)
            }
        }catch(err){
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map(err => (
                            <li key={err.message}>{err.message}</li>
                        ))}
                    </ul>
                </div>
            )
        }
    }

    return (
        <div>
            <h1>Upload Image</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Upload:</label>
                    <input
                        className="form-control"
                        onChange={onFileChange}
                        type="file" 
                        accept="image"
                    />
                    
                </div>

                {errors}
                <button className="btn btn-primary">Upload</button>
            </form>
        </div>
    )
}


export default Image