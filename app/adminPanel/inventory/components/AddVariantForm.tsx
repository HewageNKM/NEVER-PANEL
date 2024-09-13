import React from 'react';
import DropShadow from "@/components/DropShadow";
import {IoAdd, IoClose, IoCloudUpload} from "react-icons/io5";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/lib/store";
import {showToast} from "@/lib/toastSlice/toastSlice";
import Image from "next/image";

const AddVariantForm = ({setVariantId, setImages, variantId, setAddVariantForm, colorCode, setColorCode, images}: {
    variantId: string,
    colorCode: string,
    setVariantId: React.Dispatch<React.SetStateAction<string>>,
    setColorCode: React.Dispatch<React.SetStateAction<string>>,
    setAddVariantForm: React.Dispatch<React.SetStateAction<boolean>>,
    images: object[],
    setImages: React.Dispatch<React.SetStateAction<object[]>>,
    selectedThumbnail: string,
    setSelectedThumbnail: React.Dispatch<React.SetStateAction<string>>
}) => {
    const [file, setFile] = React.useState<string | undefined>(null);

    const dispatch: AppDispatch = useDispatch();
    const handleFileSelect = (evt: any) => {
        if (evt.target.files[0].size >= 10000000) {
            dispatch(showToast({
                message: "File size is larger than 10MB",
                type: "Error",
                showToast: true
            }))
            setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 3000);
            return;
        }

        if (images.length >= 5) {
            dispatch(showToast({
                message: "You can only upload 5 images",
                type: "Error",
                showToast: true
            }))
            setTimeout(() => dispatch(showToast({message: "", type: "", showToast: false})), 3000);
            return;
        }
        setImages(prevState => [...prevState, {file:evt.target.files[0],url:URL.createObjectURL(evt.target.files[0])}])
        setFile("")
        console.log(images)
    }
    return (
        <DropShadow>
            <div className="bg-white z-50 max-w-[90vw] flex h-fit rounded p-4 relative">
                <form className="flex-col flex gap-5">
                    <legend className="text-2xl font-bold">
                        Add Variant
                    </legend>
                    <div className="mt-2 flex flex-col justify-center items-start flex-wrap gap-5">
                        {images.length > 0 && <h2 className="text-lg font-bold">Select Thumbnail</h2>}
                     <div className="gap-5 flex-row w-full flex justify-center items-center flex-wrap">
                         {images.map((image, index) => (
                             <div key={index} className="relative">
                                 <Image width={20} height={20} src={image.url} alt="variant"
                                        className="w-20 h-20 rounded object-cover"/>
                                 <button className="absolute top-0 right-0" onClick={() => {

                                 }}>
                                     <IoClose size={20} onClick={() => {
                                         setImages(prevState => prevState.filter((img, i) => i !== index))
                                     }}/>
                                 </button>
                             </div>
                         ))}
                     </div>
                    </div>
                    <div className="mt-5 flex flex-row justify-center items-center flex-wrap gap-5">
                        <label className="flex-col hidden gap-1">
                            <span className="font-medium">Variant ID</span>
                            <input onChange={(txt) => setVariantId(txt.target.value)} value={variantId} type="text"
                                   placeholder="XXXXXXXXXX"
                                   className={`p-1 border-2 border-slate-300 rounded bg-primary-200`}/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium">Color Code </span>
                            <input onChange={(txt) => setColorCode(txt.target.value)} value={colorCode} required
                                   type="text"
                                   placeholder="#FFFFF"
                                   className="p-1 text-center border-2 border-slate-300 rounded"/>
                            <div className="h-8 mt-3 border-2"
                                 style={{backgroundColor: colorCode.length == 0 ? "" : "#ffff" + colorCode}}></div>
                        </label>
                        <label className="flex-col flex justify-center items-center gap-1">
                            <div className="flex  relative justify-center items-center flex-col">
                                <IoCloudUpload size={30}/>
                                <input value={file} onChange={(file) => handleFileSelect(file)} type="file" multiple
                                       accept="image/*"
                                       className="absolute w-[5rem] opacity-0 bg-black"/>
                            </div>
                            <span className="font-medium"> Upload Images(5 Max)</span>
                        </label>
                    </div>
                    <div className='w-full flex justify-center'>
                        <button
                            className="bg-primary-100 text-white flex flex-row justify-center items-center h-[2.8rem] px-3 py-1 rounded hover:bg-primary-200">
                            <IoAdd size={30}/>
                            Add Variant
                        </button>
                    </div>
                </form>
                <div className="absolute top-1 right-1">
                    <button onClick={() => {
                        setAddVariantForm(false)
                        setColorCode('')
                        setVariantId('')
                        setImages([])
                        setFile("")
                    }}>
                        <IoClose size={30}/>
                    </button>
                </div>
            </div>
        </DropShadow>
    );
};

export default AddVariantForm;
