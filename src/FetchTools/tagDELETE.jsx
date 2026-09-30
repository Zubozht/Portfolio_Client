import { useContext } from "react";
import { ApiContext } from "../ApiContext";

const tagDELETE = async function(tagID, baseurl)
{
    //const baseurl = useContext(ApiContext);
    const tagdeleteurl = `${baseurl}/tag`
    const response = await fetch(`${tagdeleteurl}/${tagID}`,
    {
        method: 'DELETE',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('authToken')},
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

export default tagDELETE;