import styles from './grid.module.css';
import Masonry from 'masonry-layout';
import imagesloaded from 'imagesloaded';
import useFetchPhotos from '../../FetchTools/useFetchPhotos';
import React, {useState, useRef, useEffect, useCallback, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {isSession, Link} from 'react-router-dom';
import Loading from '../Loading/Loading';
import { ApiContext } from '../../ApiContext';


function Grid(props)
{
    const baseurl = useContext(ApiContext);
    const { tagPreviews, requestbody="" } = props;
    const [thisTagPreviews, setThisTagPreviews] = useState(tagPreviews);
    const [thisRequstBody, setThisRequestBody] = useState(requestbody);
    const {photos, setPhotos, isLoading, fetchError} = useFetchPhotos(thisRequstBody ?? "");
    const navigate = useNavigate();
    const [thisPageNum, setThisPageNum] = useState(1);
    const [ifMorePhotos, setIfMorePhotos] = useState(true);

    const [imagesAreLoaded, setImagesAreLoaded] = useState(false);

    const gridRef = useRef(null)
    const moreRef = useRef(null)
    const abortControllerRef = useRef(null)

    useEffect(function()
    {
        if (sessionStorage.getItem('photos') || sessionStorage.getItem('tagPreviews'))
        {
            if((!tagPreviews && requestbody=="" && sessionStorage.getItem('entity').trim()=='undefined') || (tagPreviews && sessionStorage.getItem('entity').includes('[object Object]')) || (requestbody.includes('search') && sessionStorage.getItem('entity').includes('search')))
            {
                if (sessionStorage.getItem('photos'))
                {
                    setPhotos(JSON.parse(sessionStorage.getItem('photos')));
                }
                else if (sessionStorage.getItem('tagPreviews'))
                {
                    setThisTagPreviews(JSON.parse(sessionStorage.getItem('tagPreviews')));
                };
                
                if (((!tagPreviews && (JSON.stringify(photos)==sessionStorage.getItem('photos'))) || (tagPreviews && (JSON.stringify(thisTagPreviews)==sessionStorage.getItem('tagPreviews')))) && ((Number(window.innerHeight)+Number(sessionStorage.getItem('scrollposition'))<=Number(document.body.scrollHeight))))
                {
                    if (sessionStorage.getItem('scrollposition'))
                    {
                        document.body.scrollTo({top:Number(sessionStorage.getItem('scrollposition')), behavior:"auto"});
                    }
                    sessionStorage.removeItem('photos');
                    sessionStorage.removeItem('tagPreviews');
                    sessionStorage.removeItem('scrollposition');
                    sessionStorage.removeItem('entity');
                };
            };

            /*return(function()
            {
                sessionStorage.removeItem('photos');
                sessionStorage.removeItem('scrollposition');
                sessionStorage.removeItem('entity');
            });*/
        }
    }, [isLoading, document.body.scrollHeight, thisTagPreviews || photos]);

    useEffect(function()
    {
        if (!isLoading && !fetchError && photos)
        {
            if (Number(photos.length) % 10 != 0)
            {
                setThisPageNum((Number(photos.length)-Number(photos.length) % 10)/10);
            }
            else
            {
                setThisPageNum(Number(photos.length)/10);
            };
        };
    }, [isLoading, fetchError, photos])

    const generatephotos = function()
    {
        if (!isLoading && !fetchError && !tagPreviews && imagesAreLoaded)
        {
            return(photos.map(x => <div className={styles.GridCard} key={x.id}><Link to={`/photo/${x.id}`} className = {styles.PhotoLink} key={x.id} onClick={function(){sessionStorage.setItem('scrollposition',document.body.scrollTop);sessionStorage.setItem('photos',JSON.stringify(photos));sessionStorage.setItem('entity',`${requestbody} ${tagPreviews}`);}}><img key={x.id} className = {styles.GridPhotoCard} src={`${baseurl}/photo/previewimage/${x.id}?${0/*Date.now()*/}`} alt ={`Photo ${x.id}`}/></Link></div>));
        }
        else if (tagPreviews && tagPreviews.length>0 && imagesAreLoaded)
        {
            return(thisTagPreviews.map(x => <div className={styles.GridCard} key={x.id}><Link to={`/tag/${x.id}`} className = {styles.PhotoLink} key={x.id} onClick={function(){sessionStorage.setItem('scrollposition',document.body.scrollTop);sessionStorage.setItem('tagPreviews',JSON.stringify(thisTagPreviews));;sessionStorage.setItem('entity',`${requestbody} ${thisTagPreviews}`);}}><img key={x.id} className = {styles.GridPhotoCard} src={`${baseurl}/tag/previewimage/${x.id}?${0/*Date.now()*/}`} alt ={`Tag ${x.id}`}/><div className={styles.TagName}><h2 className={styles.TagText}>{x.tag}</h2></div></Link></div>)); 
        }
        else
        {
            return(<Loading></Loading>);
        };
    };

    const handleShowMore = useCallback(async function()
    {
        if (gridRef.current && !isLoading && !fetchError && imagesAreLoaded)
        {
            if (Math.ceil(window.innerHeight + window.scrollY + 200) >= document.documentElement.scrollHeight)
            {
                let entity;
                if (!requestbody.includes("tagIDs"))
                {
                    entity = 'photo';

                    const requestbody =
                    {
                        "orderBy":"id",
                        "descending":true,
                        "pagenum":Number(thisPageNum)+1,
                        "pagesize":10
                    };
                    //setThisPageNum(function(prev){return(prev+1);});
                    abortControllerRef.current?.abort();
                    abortControllerRef.current = new AbortController();
                    const response = await fetch(`${baseurl}/${entity}/search`,
                        {
                            method: 'POST',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify(requestbody),
                            credentials: 'include',
                            signal: abortControllerRef.current?.signal
                        });

                        if (response.status==401)
                        {
                            navigate(`/login`);
                        };
                        
                        if (response.ok)
                        {
                            const responsejson = await response.json();
                            const newids = responsejson.map(x => x.id);
                            const currentids = photos.map(x => x.id);
                            if (newids.every(x => currentids.includes(x)))
                            {
                                setIfMorePhotos(false);
                            }
                            else
                            {
                                setPhotos([...photos, ...responsejson]);
                            }
                        };
                }
                //else
                //{
                //    entity = 'photo';
                //}
            };
        };
    }, [isLoading, fetchError, photos]);

    useEffect(
        function()
        {
            const observer = new IntersectionObserver(
                function(entries)
                {
                    const entry = entries[0];
                    if (entry.isIntersecting)
                    {
                        handleShowMore();
                    }
                },
                {threshold:0.01}
            )

            if (moreRef.current)
            {
                observer.observe(moreRef.current);
            }

            return function()
            {
                if (moreRef.current)
                {
                    observer.unobserve(moreRef.current);
                }
            };
        }, [handleShowMore]);

    useEffect(
        function()
        {
            if (gridRef.current)
                {
                    const masonry = new Masonry(gridRef.current, {itemSelector: `.${styles.GridCard}`, gutter:15, columnWidth: `.${styles.GridCard}`, fitWidth:true});
                    
                    imagesloaded(gridRef.current, function()
                    {
                        masonry.layout();
                        setImagesAreLoaded(true);
                    })
                    /*return function cleunup()
                    {
                        masonry.destroy()
                    }*/
                };
        }, [photos, isLoading]);


    return(
        <>  
            {!imagesAreLoaded && <div ref={gridRef} className={styles.Grid}>{generatephotos()}</div>}
            {imagesAreLoaded && <div ref={gridRef} className={styles.Grid}>{generatephotos()}</div>}
            {imagesAreLoaded && ifMorePhotos && !requestbody.includes("tagIDs") && <button ref={moreRef} className={styles.ShowMoreButton} type="button" onClick={handleShowMore}>Loading more...</button>}
        </>
    )
}

export default Grid;