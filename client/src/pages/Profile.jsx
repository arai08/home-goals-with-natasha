import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const fileRef = useRef(null)
  const [file, setFile] = useState(undefined)
  const [profileImage, setProfileImage] = useState(currentUser.avatar);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  function handleFileUpload(file) {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "home-goals-with-natasha");
    data.append("cloud_name", "dk5flqt17");
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/dk5flqt17/image/upload");
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    });
    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        setProfileImage(response.url);
        setFormData({...formData, avatar: response.url});
        setUploadError(null);
      } else {
        setUploadError("Upload failed with status: " + xhr.status);
      }
      setProgress(0);
    };
    xhr.onerror = () => {
      setUploadError("An error occurred during the upload.");
      setProgress(0);
    };
    xhr.send(data);
    
  }
  useEffect(()=>{
    if(file){
      handleFileUpload(file);
    }
  }, [file])

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if(data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }

      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input onChange={(e)=> setFile(e.target.files[0])} type="file" ref={fileRef} accept="image/*" hidden/>
        <img onClick={()=> fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="Profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
        <p className="text-sm self-center">
          {
            uploadError ? (
              <span className="text-red-700">Error Image Upload</span>
            ) : progress > 0 && progress < 100 ? (
              <span className="text-slate-700">{`Uploading ${progress}%`}</span>
            ) : progress === 100 ? (
              <span className="text-green-700">Image Successfully uploaded!</span>
            ) : ''
          }
        </p>
        <input type="text" placeholder="Username" defaultValue={currentUser.username} id="username" className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="email" placeholder="Email" id="email" defaultValue={currentUser.email} className='border p-3 rounded-lg' onChange={handleChange}/>
        <input type="password" placeholder="Password" id="password" className='border p-3 rounded-lg' onChange={handleChange}/>

        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Loading...' : 'Update'}
        </button>

        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95" to={"/create-listing"}>
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>

      <p className="text-red-700 mt-5"> {error ? error : ''} </p>
      <p className="text-green-700 mt-5"> {updateSuccess ? 'Profile updated successfully' : ''} </p>
    </div>
  )
}
