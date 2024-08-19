import React, { useEffect, useState } from 'react';
import { CiCircleRemove } from "react-icons/ci";
type FileProps = {
    file : any | null;
}

const PreviewImage: React.FC<FileProps> = ({ file }) => {
    console.log(typeof file , file)
    const [preview, setPreviewImage] = useState<string | null>(null);
    useEffect(() => {
    if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setPreviewImage(reader.result);
            }
        };
    }
},[file]);

    return (
        <div >
            {preview &&
            <>
            <img className='w-[300px]' src={preview} alt="" />
            </>
             }
        </div>
    );
}

export default PreviewImage;
