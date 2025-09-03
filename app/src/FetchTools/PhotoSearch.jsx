import { useContext } from "react";
import { ApiContext } from "../ApiContext";

const photoSearch = async function(searchbody, baseurl)
{
    //const baseurl = useContext(ApiContext);
    const photosearchurl = `${baseurl}/photo`
    const response = await fetch(`${photosearchurl}`,
    {
        method:'POST',
        headers:{'Authorization' : 'Bearer ' + localStorage.getItem('authToken'),
                 'Content-Type':'application/json'},
        body:JSON.stringify(searchbody),
        credentials:'include'
    });
    if (!response.ok)
    {
        console.error("An error occured: ", response.status);
    };
    if (response.status==401)
    {
        navigate(`/login`);
    };

    return response;

};

export default photoSearch;