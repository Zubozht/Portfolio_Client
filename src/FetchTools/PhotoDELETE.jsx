import { useContext } from "react";
import { ApiContext } from "../ApiContext";

const photoDELETE = async function(photoID, baseurl)
{
    //const baseurl = useContext(ApiContext);
    const photodeleteurl = `${baseurl}/photo`;
    const response = await fetch(`${photodeleteurl}/${photoID}`,
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

export default photoDELETE;