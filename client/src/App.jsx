import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import SignUp from "./pages/SignUp"
import SignIn from "./pages/SignIn"
import About from "./pages/About"
import Testimonial from "./pages/Testimonial"
import ContactMe from "./pages/ContactMe"
import CreateListing from "./pages/CreateListing"
import Header from "./components/Header"
import PrivateRoute from "./components/PrivateRoute"
import AdminRoute from "./components/AdminRoute"
import UpdateListing from "./pages/UpdateListing"
import Listing from "./pages/Listing"
import Search from "./pages/Search"

export default function App() {
  return <BrowserRouter>
    <Header />
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/about" element={<About />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/contact-me" element={<ContactMe />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<Listing />} />

        <Route element={<PrivateRoute />} >
          <Route path="/profile" element={<Profile />} />
          <Route element={<AdminRoute />} >
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/update-listing/:listingId" element={<UpdateListing />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
}
