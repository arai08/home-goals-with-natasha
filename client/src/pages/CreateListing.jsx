import React, { useState } from 'react'
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

export default function CreateListing() {
    
    const {currentUser} = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [uploadError, setUploadError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 100,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });

    function handleImageSubmit() {
        setUploading(true);

        if(files.length === 0) {
            setUploadError('Please select at least one image.');
            setUploading(false);
            return;
        }

        if(files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true);
            const promises = [];

            for(let i=0; i<files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(urls) });
                setUploading(false);
            });
        }
        else {
            setUploadError('You can only upload up to 6 images per listing.');
            setUploading(false);
        }
    }

    function storeImage(file) {
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "home-goals-with-natasha");
            data.append("cloud_name", "dk5flqt17");

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "https://api.cloudinary.com/v1_1/dk5flqt17/image/upload");

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response.url);
                }
                else {
                    setUploadError(`Upload failed with status: ${xhr.status}`);
                    reject(`Upload failed with status: ${xhr.status}`);
                }
            };

            xhr.onerror = () => {
                setUploadError("An error occurred during the upload.");
                reject("An error occurred during the upload.");
            };

            xhr.send(data);
        });
    };

    function handleRemoveImage(index) {
        setFormData({...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index)
        })
    }

    const handleChange = (e) => {
        if(e.target.id === 'sale' || e.target.id === 'rent') {
            setFormData({...formData, type: e.target.id});
        }

        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({...formData, [e.target.id]: e.target.checked});
        }

        if(e.target.type === 'number' || e.target.type === 'text' || e.target.type === 'textarea') {
            setFormData({...formData, [e.target.id]: e.target.value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(formData.imageUrls.length < 1) {
                return setError('Please upload at least one image.');
            }
            if(formData.regularPrice < formData.discountPrice) {
                return setError('Discounted price cannot be greater than regular price.');
            }
            setLoading(true);
            setError(false);
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                })
            });
            const data = await res.json();
            setLoading(false);
            if(data.success === false) {
                setError(data.message);
                return;
            }
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }
  
    return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required onChange={handleChange} value={formData.name} />
                <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description' required onChange={handleChange} value={formData.description} />
                <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required onChange={handleChange} value={formData.address} />

                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5' onChange={handleChange} checked={formData.type === "sale"} />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5' onChange={handleChange} checked={formData.type === "rent"} />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5' onChange={handleChange} checked={formData.parking} />
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5' onChange={handleChange} checked={formData.furnished} />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5' onChange={handleChange} checked={formData.offer} />
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bedrooms} />
                        <p> Beds </p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bathrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.bathrooms} />
                        <p> Baths </p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='regularPrice' min='100' max='10000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.regularPrice} />
                        <div className='flex flex-col items-center'>
                            <p> Regular Price </p>
                            <span className='text-xs'>($ /month)</span>
                        </div>
                    </div>
                    {formData.offer && (
                        <div className='flex items-center gap-2'>
                            <input type='number' id='discountPrice' min='0' max='10000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handleChange} value={formData.discountPrice} />
                            <div className='flex flex-col items-center'>
                                <p> Discounted Price </p>
                                <span className='text-xs'>($ /month)</span>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'> Images:
                    <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>
                </p>
                <div className='flex gap-4'>
                    <input onClick={() => setUploadError('')} onChange={(e) => setFiles(e.target.files) } className='p-3 border border-gray-300 rounded w-full' type='file' id='images' multiple accept='image/*' required />
                    <button disabled={uploading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'> {uploading ? 'Uploading...' : 'Upload'} </button>
                </div>
                <p className='text-red-700 text-sm'>{uploadError && uploadError}</p> 
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                    <div key={url} className="flex justify-between p-3 border items-center">
                        <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                        <button type='button' disabled={uploading} onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover: opacity-75'>Delete</button>
                    </div>
                ))
                }
                <button disabled={loading || uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'> {loading ? 'Creating...' : 'Create Listing'} </button>
                {error && <p className='text-red-700 text-sm'>{error}</p>}
            </div>
            
        </form>
    </main>
  )
}
