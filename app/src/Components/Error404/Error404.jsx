import styles from './Error404.module.css'

function Error404()
{
    return(
        <>
            <div className={styles.ErrorMessage}>
                    <h2 className={styles.E404}>404</h2>
                    <p className={styles.msg404}>Sorry, page not found :(</p>
            </div>
        </>
    )
}

export default Error404