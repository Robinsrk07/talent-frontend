import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React from 'react';
import LoginPage from './Components/AdminDashboard/LoginPage';
import Dashboard from './Components/AdminDashboard/Dashboard';
import Scroll from './Components/Home/Scroll';
import Banner from './Components/Home/Banner';
import Faculties from './Components/Home/Faculities';
import Teachers from './Components/Home/Teachers';
import SubjectTeams from './Components/Home/SubjectTeams';
import About from './Components/About/About';
import OurFocus from './Components/OurFocus/ourFocus';
import OurCourses from './Components/OurCourses/OurCourses';
import Services from './Components/Services/Services';
import Gallery from './Components/Gallery/Gallery';
import Results from './Components/Results/Results';
import Body from './Components/mainBody/Body';
import AboutClient from './Components/ClientPages/AboutClient';
import Focus from './Components/ClientPages/Focus';
import Courses from './Components/ClientPages/Courses';
import ServicesClient from './Components/ClientPages/ServicesClient';
import  GalleryClient  from './Components/ClientPages/GalleryClient';
import Result from './Components/ClientPages/Result';
import ConnectUs from './Components/ClientPages/ConnectUs';
import StudentLogin from './Components/ClientPages/StudentLogin';
import HomePage from './Components/ClientPages/homePage';
import Students from './Components/Students/Students';
function App() {

  return (
    <>
    <div className='w-full h-full '>
     <BrowserRouter>
          <Routes>
          <Route path='/' element={<Body/>} >
             <Route path='/' element={<HomePage/>} />
             <Route path='about' element={<AboutClient/>} />
             <Route path='focus' element={<Focus/>} />
             <Route path='courses' element={<Courses/>} />
             <Route path='services' element={<ServicesClient/>} />
             <Route path='gallery' element={<GalleryClient/>} />
             <Route path='result' element={<Result/>} />
             <Route path='contact' element={<ConnectUs/>} />
             <Route path='online-class' element={<StudentLogin/>} />

          </Route>
          <Route path='/admin/login' element={<LoginPage/>}/>

          <Route path='/admin/dashboard' element={<Dashboard/>} >
              <Route path='scroll' element ={<Scroll/>}/>
              <Route path='banner' element ={<Banner/>}/>
              <Route path='faculties-main' element ={<Faculties/>}/>
              <Route path='teachers' element ={<Teachers/>}/>
              <Route path='teams' element ={<SubjectTeams/>}/>   
              <Route path='aboutus' element={<About/>} />
              <Route path='ourfocus' element={<OurFocus/>} />
              <Route path='ourcourses' element={<OurCourses/>} />
              <Route path='services' element={<Services/>} />
              <Route path='gallery' element={<Gallery/>} />
              <Route path='results' element={<Results/>} />
              <Route path='students' element={<Students/>} />
        
          </Route>

          
          
         </Routes>
     </BrowserRouter>

    </div>
    
    </>
  )
}

export default App
