import React, {ReactNode} from 'react';
import PageLoading from "@/app/adminPanel/components/PageLoading";
import {useSelector} from "react-redux";
import {RootState} from "@/lib/store";
import {AnimatePresence} from "framer-motion";

const PageLoadingProvider = ({children}:{children:ReactNode}) => {
    const isLoading = useSelector((state:RootState) => state.pageLoaderSlice.isLoading);
    return (
        <>
            {children}
          <AnimatePresence>
                {isLoading && <PageLoading/>}
          </AnimatePresence>
        </>
    );
};

export default PageLoadingProvider;
