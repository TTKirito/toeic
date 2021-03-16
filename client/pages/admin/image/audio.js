
import {useState, useEffect} from 'react'
import Router from 'next/router'
import useRequest from '../../../hooks/use-request'
import Axios from 'axios'


const Audio = ({questionId, examId})=>{
    const [audio,setAudio] = useState(null)
    const [errors,setErrors] = useState(null)
    const [loading, setLoading] = useState()
    const onFileChange=(event)=>{
        if(event.target.files && event.target.files.length === 1){
            const pickedFile = event.target.files[0]
            setAudio(pickedFile)
        }
    }

    const onSubmit=async(event)=>{
        event.preventDefault()
        const formData= new FormData()
        formData.append('questionId',questionId)
        formData.append('audio',audio)

        

        try{
            const response = await (await Axios.post('/api/audio',formData, {
                onUploadProgress: (ProgressEvent) => {
                    setLoading((ProgressEvent.loaded/ProgressEvent.total)*100)
                }
            }))
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
            <h1>Upload Audio</h1>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Upload:</label>
                    <input
                        className="form-control"
                        onChange={onFileChange}
                        type="file" 
                        accept="audio"
                    />
                    <span>
                        {loading ? loading + '%' : 'hi'}
                    </span>
                </div>

                {errors}
                <button className="btn btn-primary">Upload</button>
            </form>
        </div>
    )
}


export default Audio