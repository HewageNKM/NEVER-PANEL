import React from 'react';
import DropShadow from "@/components/DropShadow";
import {IoClose} from "react-icons/io5";

const ViewVariantsForm = ({setForm}:{
    setForm:React.Dispatch<React.SetStateAction<boolean>>
}
) => {
    return (
        <DropShadow>
            <div className="flex bg-white p-2 rounded relative flex-col gap-1 justify-center items-center">
                <h2 className="text-2xl font-bold">
                    Mange Variants
                </h2>
                <div>

                </div>
                <div>

                </div>
                <div className="absolute top-1 right-1">
                    <button onClick={() => {
                        setForm(false)
                    }}>
                        <IoClose size={30}/>
                    </button>
                </div>
            </div>
        </DropShadow>
    );
};

export default ViewVariantsForm;
