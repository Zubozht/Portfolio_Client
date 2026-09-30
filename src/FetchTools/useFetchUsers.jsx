import { useState, useContext } from 'react';
import { ApiContext } from '../ApiContext';

function useFetchUsers()
{
    const baseurl = useContext(ApiContext);
    const usersurl = `${baseurl}/account`;
};

export default useFetchUsers;