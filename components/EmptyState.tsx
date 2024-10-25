import React from 'react';

const EmptyState = ({
                        title,
                        subtitle,
    containerStyles
                    }: {
    title: string,
    subtitle: string,
    containerStyles?: string
}) => {
    return (
        <div className={`w-full flex flex-col items-center justify-center text-center py-8 px-4 ${containerStyles}`}>
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800">
                {title}
            </h2>
            <p className="mt-2 text-base md:text-lg text-gray-600">
                {subtitle}
            </p>
        </div>
    );
};

export default EmptyState;
