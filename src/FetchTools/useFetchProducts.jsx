import { useState, useEffect } from 'react';
import useFetchData from './useFetchData';

function useFetchProducts(param){

    const { data:products, setData:setProducts, isLoading, error:fetchError, notFetched } = useFetchData(`product/${param}`);
    return{products, setProducts, isLoading, fetchError, notFetched};
    /*if (photos != null)
    {
        return(photos)
    }*/
};

export default useFetchProducts;