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

function App() {

  return (
    <>
    <div className='w-full h-full '>
     <BrowserRouter>
          <Routes>
          <Route path='/admin/login' element={<LoginPage/>}/>
              
          <Route path='/admin/dashboard' element={<Dashboard/>} >
              <Route path='scroll' element ={<Scroll/>}/>
              <Route path='banner' element ={<Banner/>}/>
              <Route path='faculties-main' element ={<Faculties/>}/>
              <Route path='teachers' element ={<Teachers/>}/>
              <Route path='teams' element ={<SubjectTeams/>}/>   
              <Route path='aboutus' element={<About/>} />
        
          </Route>

          
          
         </Routes>
     </BrowserRouter>

    </div>
    
    </>
  )
}

export default App
