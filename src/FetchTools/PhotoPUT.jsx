import { useContext } from "react";
import { ApiContext } from "../ApiContext";

const photoPUT = async function(id, updatebody, baseurl)
{
    //const baseurl = useContext(ApiContext);
    const photoputurl = `${baseurl}/photo`
    const response = await fetch(`${photoputurl}/${id}`,
    {
        method: 'PUT',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('authToken')//,
                  /*'Content-Type': 'application/json'*/},
        body: updatebody,
        credentials: 'include'
    });
    if (!response.ok)
    {
        console.error("An error occured: ", response.status);
    }
    if (response.status==401)
    {
        navigate(`/login`);
    };

    return response;
};

export default photoPUT;