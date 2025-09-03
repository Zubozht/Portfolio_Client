import { useContext } from "react";
import { ApiContext } from "../ApiContext";

const photoPOST = async function(uploadbody, baseurl)
{
    //const baseurl = useContext(ApiContext);
    const photoposturl = `${baseurl}/photo`
    const response = await fetch(`${photoposturl}`,
    {
        method: 'POST',
        headers: {'Authorization': 'Bearer ' + localStorage.getItem('authToken')//,
                  /*'Content-Type': 'application/json'*/},
        body: uploadbody,
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

export default photoPOST;