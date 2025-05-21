


const Services =()=>{
    return(
    <div className="w-full bg-white flex flex-col  m-3 rounded-lg">
      <div className="flex flex-col justify-center items-center border border-gray-200 shadow-lg m-2  rounded-lg  md:flex-row  gap-8 ">
            <div className="flex flex-col m-4    border border-gray-200 w-[300px] h-[300px] rounded-lg">
            <label className="text-gray-500 font-semibold mt-2">Top Banner (1090x400)</label>
               <img
                    src={ "default-banner-placeholder.jpg"}
                    alt="Top Banner"
                    className="w-[250px] h-[230px] object-cover p-1 rounded"
                />
                <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="file-input file-input-bordered m-4 text-gray-700 rounded-sm w-[80%] bg-white border border-gray-300"
                />                     
            </div>

             <div className="relative m-4 mt-8  w-[88%] ">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
                    Title Main
                </label>
                <input
                    type="text"
                    name="titleMain"
                    className="w-full border border-gray-300 rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div> 
            


        </div>
        <div className="flex flex-col justify-center  border border-gray-300 md:flex-row shadow-lg rounded-lg m-2 gap-8 ">
            <div className="flex flex-col m-4    border border-gray-200 w-[300px] h-[300px] rounded-lg">
            <label className="text-gray-500 font-semibold mt-2">Services(1090x400)</label>
               <img
                    src={ "default-banner-placeholder.jpg"}
                    alt="Top Banner"
                    className="w-[250px] h-[230px] object-cover p-1 rounded"
                />
                <input
                    type="file"
                    accept="image/jpeg,image/png"
                    className="file-input file-input-bordered m-4 text-gray-700 rounded-sm w-[80%] bg-white border border-gray-300"
                />                     
            </div>
             <div className="flex flex-col w-full">
             <div className="relative m-4 mt-8  w-[88%] ">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
                    Title Main
                </label>
                <input
                    type="text"
                    name="titleMain"
                    className="w-full border border-gray-300 rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
             <div className="relative m-4 mt-8  w-[88%] ">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
                    Title Main
                </label>
                <input
                    type="text"
                    name="titleMain"
                    className="w-full border border-gray-300 rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>


            <div className="relative w-[88%] m-4 mt-8">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
                    Vision Description
                </label>
                <textarea
                    name="visionDescription"
                    rows="4"
                    className="w-full border border-gray-300 rounded-md text-gray-800  focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                >                  
                </textarea>
         
           </div>

           <div className="flex flex-col md:flex-row text-white font-semibold justify-center items-center gap-3 p-4 ">

            <button className="w-[80%] rounded-lg md:w-[200px] bg-[#AE89FF]"
                  > Update Changes </button>
            <button className="w-[80%] rounded-lg md:w-[200px] bg-red-500"> Delete Option </button>

           </div>
            
            </div>


        </div>
        <div className="flex flex-col justify-center  border border-gray-300 md:flex-row shadow-lg rounded-lg m-2 gap-8 ">
            
             <div className="flex flex-col w-full">
                <h3 className="text-gray-400">Our Features</h3>
             <div className="relative m-4 mt-8  w-[88%] ">
                <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
                    Title Main
                </label>
                <input
                    type="text"
                    name="titleMain"
                    className="w-full border border-gray-300 rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            


            

           <div className="flex flex-col md:flex-row text-white font-semibold justify-center items-center gap-3 p-4 ">

            <button className="w-[80%] rounded-lg md:w-[200px] bg-[#AE89FF]"
                  > Update Changes </button>
            <button className="w-[80%] rounded-lg md:w-[200px] bg-red-500"> Delete Option </button>

           </div>
            
            </div>


        </div>
        

   </div>)
}

export default Services