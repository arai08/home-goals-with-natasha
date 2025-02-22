import React, { useState } from 'react'

export default function CreateListing() {
    
    const [files, setFiles] = useState([]);
    const [uploadError, setUploadError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        imageUrls: [],
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

    console.log(formData.imageUrls);
  
    return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

        <form className='flex flex-col sm:flex-row gap-4'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' maxLength='62' minLength='10' required />
                <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                <input type='text' placeholder='Address' className='border p-3 rounded-lg' id='address' required />

                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5' />
                        <span>Sell</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5' />
                        <span>Parking Spot</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5' />
                        <span>Furnished</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>

                <div className='flex flex-wrap gap-6'>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bedrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg'/>
                        <p> Beds </p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='bathrooms' min='1' max='10' required className='p-3 border border-gray-300 rounded-lg'/>
                        <p> Baths </p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='regularPrice' min='100' max='10000000' required className='p-3 border border-gray-300 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p> Regular Price </p>
                            <span className='text-xs'>($ /month)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input type='number' id='discountPrice' min='100' max='10000000' required className='p-3 border border-gray-300 rounded-lg'/>
                        <div className='flex flex-col items-center'>
                            <p> Discounted Price </p>
                            <span className='text-xs'>($ /month)</span>
                        </div>
                    </div>
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
                <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Create Listing</button>
            </div>
            
        </form>
    </main>
  )
}
