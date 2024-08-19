import React, { useEffect, useState } from 'react';

type FileProps = {
    files: any | null;
}

const SecondaryImages: React.FC<FileProps> = ({ files }) => {
    const [previews, setPreviews] = useState<string | null>(null);
    useEffect(() => {
        if (files) {
            const reader = new FileReader();
            reader.readAsDataURL(files);
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    setPreviews(reader.result);
                }
            };
        }
    },[files]);
            
     ;
    
    return (
        <div>
          
          {previews &&
            <>
            <img className='w-[300px]' src={previews} alt="" />
            </>
             }
        </div>
    );
}

export default SecondaryImages;
