import React from 'react'


import Header from './components/header/Header';
import Leftsidebar from './components/left/Leftsidebar';
import RightSideBar from "./components/right/RightSideBar"
const App = () => {
  return (
    <div>
      <div>
        <Header />
      </div>
      <div className='flex justify-between gap-3'>
        <div className='w-[250px]'>
          <Leftsidebar />
        </div>
        <div>
          <div className="flex-1">
            {/* <Categories /> */}
            {/* <Post /> */}
          </div>
        </div>
        <div>
          <RightSideBar/>
        </div>
      </div>
    </div>
  );
}

export default App
