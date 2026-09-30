import { useContext } from "react";
import { ApiContext } from "../ApiContext";

const tagPOST = async function(tag, baseurl)
{
    //const baseurl = useContext(ApiContext);
    const tagposturl = `${baseurl}/tag`;
    const response = await fetch(`${tagposturl}`,
    {
        method: 'POST',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('authToken'),
                  'Content-Type': 'application/json'},
        body: JSON.stringify(tag),
        credentials: 'include'
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

export default tagPOST;