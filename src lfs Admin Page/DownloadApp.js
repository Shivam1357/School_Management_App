import { useState } from "react";




export default function AppDownload(){
    const [downloadClicked, setDownloadClicked] = useState(false);
    const downloadApp = () =>{
        setDownloadClicked(true)
    }



    return (
        <div style={{padding:'30px 10px 30px 10px'}}>
            <button className="btn btn-dark" onClick={downloadApp}>Download App 51MB</button>
            {downloadClicked &&
            <div>
                <h2 style={{fontFamily:'inherit'}}>Downloading...</h2>
            </div>
            }
            <img src={require("./images/image (1).jpg")}/>
        </div>
    )
}