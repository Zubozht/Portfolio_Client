import { useEffect, useState, useRef, useContext } from 'react';
import { ApiContext } from '../ApiContext';

function useFetchData(endpoint)
{
    const baseurl = useContext(ApiContext);
    const[data, setData] = useState(null);
    const[isLoading, setIsLoading] = useState(true);
    const[error, setError] = useState(null);
    const[notFetched, setNotFetched] = useState(false);

    const abortControllerRef = useRef(null);

    useEffect(function(){
        const fetchData = async function(){
            abortControllerRef.current?.abort();
            abortControllerRef.current = new AbortController();
            setData(null);
            setIsLoading(true);
            setError(null);
            let aborted = false;
            
            try
            {   
                let response;
                if (endpoint.includes("/search, "))
                    {
                        response = await fetch(`${baseurl}/${endpoint.split(', ')[0]}`,
                            {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: endpoint.split('/search, ')[1],
                                credentials: 'include',
                                signal: abortControllerRef.current?.signal
                            });
                    }
                else if (endpoint.includes("/search"))
                {
                    response = await fetch(`${baseurl}/${endpoint}`,
                        {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({"pagesize": 10}),
                            credentials: 'include',
                            signal: abortControllerRef.current?.signal
                        });
                }
                else if (endpoint.includes("/"))
                {
                    response = await fetch(`${baseurl}/${endpoint}`,
                        {
                            //method: 'GET',
                            //headers: {'Content-Type': 'application/json'},
                            //body: JSON.stringify({"id": endpoint.split('/')[1]}),
                            credentials: 'include',
                            signal: abortControllerRef.current?.signal
                        });
                }
                else
                {
                    response = await fetch(`${baseurl}/${endpoint}`,
                        {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({}),
                            credentials: 'include',
                            signal: abortControllerRef.current?.signal
                        });
                };
                
                if (!response.ok)
                {
                    setNotFetched(true);
                    console.error(`HTTP Error! Status ${response.status}.`);
                };

                if (response.status==401)
                {
                    navigate(`/login`);
                };

                const dataforcheck = await response.json();

                if (dataforcheck == null)
                {
                    console.error("Something went wrong (data is null).");
                };

                setData(dataforcheck);
            }
            catch(e)
            {
                if (e.name === 'AbortError')
                {
                    //console.log('Aborted.')
                    aborted = true;
                    return;
                }
                setError(e instanceof Error ? e : "Unknown Error.");
            }
            finally
            {
                if (!aborted)
                {
                    setIsLoading(false);
                };
            };
        };

        fetchData();

        return(function()
    {
        abortControllerRef.current?.abort();
    });

    }, []);

    return {data, setData, isLoading, error, notFetched};
}

export default useFetchData;