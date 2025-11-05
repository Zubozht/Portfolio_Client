import styles from './entityheader.module.css';
import { Link } from 'react-router-dom';

function EntityHeader(props)
{
    const { entityname, entityaction, entityactionlink } = props;
    return(
        <section className={styles.Heading}>
            <div className={styles.LeftSection}>
                <div className={styles.EntityText}>{entityname}</div>
                {localStorage.getItem('currentUserRoles') && localStorage.getItem('currentUserRoles').includes('Admin') && (localStorage.getItem("expires") - new Date(Date.now()).getTime() > 0) && <Link to={`/${entityactionlink}`}><button className={styles.EntityCreateButton}>{entityaction}</button></Link>}
                </div>
                {/*<div className={styles.RightSection}>
                    <Link to={`/tags`} className={styles.ToTagsLink}><div className={styles.ToTagsText}>To Tags →</div></Link>
                </div>*/}
        </section>
    );
};

export default EntityHeader;