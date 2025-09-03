import styles from './tagcreate.module.css';
import Tag from '../Tag/Tag.jsx'

function TagCreate(props)
{
    return(
        <>
            {localStorage.getItem("currentUserRoles") && localStorage.getItem("currentUserRoles").includes("Admin") && <Tag isTag={false}></Tag>}
        </>
    );
}

export default TagCreate;