import React, {useState, useEffect} from 'react'
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'

import '../../App.css'

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (url) {
            // posting to database
            fetch("/create", {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    title,
                    body,
                    image: url
                })
            }).then(res => res.json())
                .then(data => {

                    if (data.error) {
                        M.toast({ html: data.error})
                    }
                    else {
                        M.toast({ html: "Created post Successfully"})
                        history.push('/')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [url])

    const previewImage = () => {

        const file = res.json()
        setImage(file.secure_url)
        setLoading(false)

    }


    const postDetails = async () => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'nonogram')
        data.append('cloud_name', 'nonoumasy')
        setLoading(true)
        // posting to cloudinary 
        const res = await fetch('https://api.cloudinary.com/v1_1/nonoumasy/image/upload',
            {
                method: "post",
                body: data
            })
            .then(res => {
                console.log('asdf', res)
                res.json()
            })
            .then(data => setUrl(data.url))
            .catch(err => console.log(err))
        }

    
        
    return (
        <div className='card input-file'>
            <input 
            type="text" 
            placeholder='title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
            <input 
            type="text" 
            placeholder='body' 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            />

            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload Image</span>
                    <input 
                    type="file"
                    onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" placeholder='Add image.' />
                </div>
            </div>

            {loading ? (
                <h3>Loading...</h3>
            ) : (
                    <img src={image} style={{ width: '300px' }} />
                )}

            <button 
            className="btn waves-effect waves-light"
            onClick={()=> postDetails()}
            >
                Submit Post
            </button>

            
        </div>
        )
    
}

export default CreatePost
