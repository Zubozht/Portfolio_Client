import React, {useState, useEffect} from 'react';

function Footer()
{
    const [currentyear, setCurrentyear] = useState(new Date().getFullYear());
    useEffect
    (
        function UpdateYear()
        {
            const interval = setInterval(
                function()
                {
                    setCurrentyear(new Date().getFullYear());
                },
                1000*60*60*24
            );

            return function cleanup()
            {
                clearInterval(interval);
            };

        },[]);

    return(
        <footer>
            <div className="Technical">Left side</div>
            <p id="footerText">&copy; Viktor Marchenko 2024–{currentyear}</p>
        </footer>
    );
}

export default Footer