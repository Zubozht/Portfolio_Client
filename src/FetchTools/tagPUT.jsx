import { useContext } from "react";
import { ApiContext } from "../ApiContext";

const tagPUT = async function(id, updatebody, baseurl)
{
    //const baseurl = useContext(ApiContext);
    const tagputurl = `${baseurl}/tag`;
        const response = await fetch(`${tagputurl}/${id}`,
        {
            method: 'PUT',
            headers: {'Authorization': 'bearer ' + localStorage.getItem('authToken'),
                    'Content-Type': 'application/json'},
            body: JSON.stringify(updatebody),
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

export default tagPUT;