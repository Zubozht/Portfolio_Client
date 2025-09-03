import { useState, useEffect } from 'react';
import useFetchData from './useFetchData';

function useFetchTags(param){

    const { data:tags, setData:setTags, isLoading, error:fetchError, notFetched } = useFetchData(`tag/${param}`);
    return{tags, setTags, isLoading, fetchError, notFetched};
    /*if (photos != null)
    {
        return(photos)
    }*/
};

export default useFetchTags;