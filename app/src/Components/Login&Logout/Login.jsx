import React, { useRef, useEffect, useState, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styles from './login&logout.module.css';
import { ApiContext } from '../../ApiContext';

function Login(props)
{
    const baseurl = useContext(ApiContext);
    const {proplogout=false}=props;
    const [logout, setLogout] = useState(proplogout);
    const navigate = useNavigate();
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const checkUsername = function()
    {

    };

    const checkPassword = function()
    {

    };

    const handlelogin = async function(e)
    {
        e.preventDefault();
        if (usernameRef.current?.value && passwordRef.current?.value)
        {
            const logindata =
            {
                username: usernameRef.current.value,
                password: passwordRef.current.value
            }
            //console.log(logindata);
            
            const response = await fetch(`${baseurl}/account/login`,
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(logindata),
                credentials: 'include'
            });

            const contentType = await response.headers.get('content-type');

            if (contentType && contentType.includes('application/json'))
            {
                const responsejson = await response.json();
                //console.log(responsejson);
                if (responsejson.token)
                {
                    localStorage.setItem('authToken', responsejson.token);
                    localStorage.setItem('currentUserRoles', responsejson.roles);
                    localStorage.setItem('expires', new Date((Date.now() + 7 * 24 * 60 * 60 * 1000)).getTime());

                    document.cookie=`authToken=${responsejson.token}`;
                    document.cookie=`currentUserRoles=${responsejson.roles}`;
                    document.cookie=(`expires=` + new Date((Date.now() + 7 * 24 * 60 * 60 * 1000)).getTime());
                    
                    navigate(`/`);
                }
            }
            else if (contentType)
            {
                const responsetext = await response.text();
                alert(responsetext);
            };
        };
    };

    const handlelogout = async function(e)
    {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUserRoles");
        navigate(`/`);
    };

    //console.log(localStorage.getItem('currentUserRoles'));

    useEffect(function()
    {
        async function redirector()
        {
            if (logout && (!localStorage.getItem('currentUserRoles') || localStorage.getItem('currentUserRoles') == null))
            {
                setLogout(false);
                navigate(`/login`);
            };
            if (!logout && (localStorage.getItem('currentUserRoles') || localStorage.getItem('currentUserRoles') != null))
            {
                const ifAuthorized = await fetch (`${baseurl}/account/confirm-user`,
                {
                    method: 'GET',
                    headers: {'Authorization': 'Bearer ' + localStorage.getItem('authToken')},
                    credentials: 'include'
                });
                if (ifAuthorized.status == 401)
                {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem('currentUserRoles')
                }
                else
                {
                    navigate(`/`)
                }
            };
        };

        redirector();

    }, []);

    return(
            <>
                <div className={styles.Logincard}>
                    {!logout && (
                    <>
                        <h2 className={styles.Logintext}>Log in</h2>
                        <form onSubmit={handlelogin}>
                            <input id="username-input" className={styles.Logininput} type="text" placeholder="Enter yout Username." ref={usernameRef} autoComplete="username" onBlur={checkUsername}/>
                            <input id="password-input" className={styles.Logininput} type="password" placeholder="Enter yout Password." ref={passwordRef} autoComplete="current-password" onBlur={checkPassword}/>
                            <button type="submit" className={styles.Loginbutton} onClick={handlelogin}>Log in</button>
                        </form>
                    </>
                    )}
                
                    {logout && (
                    <>
                        <h2 className={styles.Logintext}>Log out</h2>
                        <form onSubmit={handlelogout}>
                            <button type="submit" className={styles.Loginbutton} onClick={handlelogout}>Log out</button>
                        </form>
                    </>
                    )}
                </div>
            </>
        );
};

export default Login;