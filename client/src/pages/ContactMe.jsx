import { useSelector } from "react-redux"
import { useRef, useState, useEffect } from "react"
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutUserStart, signOutUserSuccess, signOutUserFailure } from "../redux/user/userSlice"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"

export default function ContactMe() {

  return (
    <div>
        <div className="p-3 max-w-lg mx-auto">
            <h1 className='text-3xl font-semibold text-center my-7'>Get In Touch</h1>
        </div>
        <div className="flex justify-center">
            <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSeN-VGP6haoJwxdKPiNZJN7KZaMhfifBgts1BEqHawvov7m6Q/viewform?embedded=true" 
            width="640" height="800" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
        </div>
    </div>
    
  )
}
