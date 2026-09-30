import { useState, useEffect } from 'react';
import useFetchData from './useFetchData';

function useFetchPhotos(param)
{   
    const {data:photos, setData:setPhotos, isLoading, error:fetchError, notFetched} = useFetchData(`photo/${param}`);
    return{photos, setPhotos, isLoading, fetchError, notFetched};
};

export default useFetchPhotos;