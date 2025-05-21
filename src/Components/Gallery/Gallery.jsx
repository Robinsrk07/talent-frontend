


const Gallery =()=>{
    return(
    <div className="w-full bg-white flex flex-col  m-3 rounded-lg">
      
        <div className="flex flex-col justify-center  border border-gray-300 md:flex-row shadow-lg rounded-lg m-2 gap-8 ">
            <div className="flex flex-col m-4 justify-center items-center gap-2   border border-gray-200 w-[300px] h-[300px] rounded-lg">
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
                    <button className="w-[80%] rounded-lg md:w-[200px] bg-[#AE89FF]"
                    > Update Image </button>
                <button className="w-[80%] rounded-lg md:w-[200px] m-2 bg-red-500"> Delete Image </button>             
            </div>

            <div className=" border flex justify-center items-center text-[50px] bg-gray-50 border-dashed border-gray-400 m-4 rounded-lg w-[300px] h-[300px]">
              +
            </div>
             


        </div>
        

   </div>)
}

export default Gallery