import React from 'react';

const TrackingForm = () => {
    const onSubmit = (evt:any) => {
    evt.preventDefault();
    }
    return (
        <div className="w-full">
            <form onSubmit={onSubmit}>
                <div className="flex flex-col space-y-4">
                    <legend className="text-xl font-semibold text-gray-800">Tracking Details</legend>
                    <div className="bg-gray-50 p-4 rounded-md w-full flex-col flex gap-5 shadow-inner">
                        <label className="flex items-start flex-col gap-2">
                            <p className="text-sm font-medium rounded text-gray-600">Tracking Number:</p>
                            <input type="text" className="text-sm h-7 px-2 py-1 text-gray-800" placeholder="LK-XXXXXX-XXXX"/>
                        </label>
                        <label className="flex items-start flex-col gap-2">
                            <p className="text-sm font-medium text-gray-600">Courier:</p>
                            <input type="text" className="text-sm rounded px-2 py-1 h-7 text-gray-800" placeholder="Domex"/>
                        </label>
                        <label className="flex items-start flex-col gap-2">
                            <p className="text-sm font-medium text-gray-600">Tracking URl:</p>
                            <input type="text" className="text-sm h-7 px-2 py-1 rounded text-gray-800" placeholder="https://www.domex.lk/"/>
                        </label>
                    </div>
                    <div className="w-full flex justify-center items-center">
                        <button
                            className="bg-primary-100 hover:bg-primary-200 transition px-6 py-2 rounded-md text-white font-semibold tracking-wide text-lg mt-4">
                            Ship
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default TrackingForm;