import React, {useRef} from 'react';
import {useNavigate, Link} from 'react-router-dom';

function Header()
{
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const handleSearch = function()
    {
        if(inputRef.current?.value && inputRef.current?.value >=1 && inputRef.current?.value < 14 && inputRef.current?.value.trim!="")
        {
            navigate(`/photo/${inputRef.current?.value}`);
            inputRef.current.value = '';
        }
        else
        {
            undefined;
        }
    };
    const handleKeyDown = function(e){if (e.key === "Enter"){handleSearch()}};
    
    if (false)
    {
        return(
        <>
            <header className="header">
                    <div className="left-header-section">
                        <div id="mynameContainer">
                            <div id="myname">
                                <Link to="/" className="gotomain">
                                    Viktor Marchenko
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="middle-header-section">
                        <input id="photo-search-bar" className="search-bar" ref={inputRef}
                        type="text" placeholder="Search photos" onKeyDown={handleKeyDown}/>
                        <img className="search-icon"
                        src="/src/assets/Logos/search_56dp_4E4E4E_FILL0_wght400_GRAD0_opsz48.svg"
                        alt="Search icon" onClick={handleSearch}/>
                    </div>
                    <div className="right-header-section">
                        <div className="icons">
                            <a className="instagram-link" href="https://www.instagram.com/zubozht_photo/">
                                <img className="instagram-logo"
                                src="/src/assets/Logos/Instagram_logo_2022bw.svg"
                                alt="Instagram logo"/>
                            </a>
                            <a className="threads-link" href="https://www.threads.net/@zubozht_photo">
                                <img className="threads-logo"
                                src="/src/assets/Logos/Threads_(app)_logo.svg"
                                alt="Threads logo"/>
                            </a>
                            <a className="twitter-link" href="https://twitter.com/zubozht">
                                <img className="twitter-logo"
                                src="/src/assets/Logos/Logo_of_Twitterbw.svg"
                                alt="Twitter logo"/>
                            </a>
                        </div>
                    </div>
                </header>
        </>
    );
    }
    else
    {
        return(
            <>
            <header className="headerwithnameonly">
                    <div className="middle-header-section">
                        <div id="mynameContainer">
                            <div id="myname">
                                <Link to="/" className="gotomain">
                                    Viktor Marchenko
                                </Link>
                            </div>
                        </div>
                        <div className="headerbottom">
                            <Link to="/photos" className="gotophotos">
                                Photos
                            </Link>
                            <div className="headerdivider">|</div>
                            <Link to="/tags" className="gototags">
                                Categories
                            </Link>
                            <div className="headerdivider">|</div>
                            <Link to="/store" className="gotostore">
                                Store
                            </Link>
                            <div className="headerdivider">|</div>
                            <Link to="/about" className="gotobio">
                                About
                            </Link>
                        </div>
                    </div>
                </header>
        </>
        );
    }
};

export default Header