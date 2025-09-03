import { Link } from 'react-router-dom';
import styles from './about.module.css'

function About()
{
    return(
    <>
        <section className={styles.AboutSection}>
            <section className={styles.Intro}>Not much to see here yet, but below are some of my contacts in case you want to send me some spam or whatever.</section>
            <section className={styles.Icons}>
                <a className={styles.InstagramLink} href="https://www.instagram.com/zubozht_photo/">
                    <img className={styles.InstagramLogo}
                    src="/Logos/Instagram_logo_2022bw.svg"
                    alt="Instagram logo"/>
                </a>
                <a className={styles.ThreadsLink} href="https://www.threads.net/@zubozht_photo">
                    <img className={styles.ThreadsLogo}
                    src="/Logos/Threads_(app)_logo.svg"
                    alt="Threads logo"/>
                </a>
                <a className={styles.TwitterLink} href="https://twitter.com/zubozht">
                    <img className={styles.TwitterLogo}
                    src="/Logos/Logo_of_Twitterbw.svg"
                    alt="Twitter logo"/>
                </a>
                <a className={styles.TelegramLink} href="https://t.me/zubozht">
                    <img className={styles.TelegramLogo}
                    src="/Logos/Logo_of_Telegrambw.svg"
                    alt="Telegram logo"/>
                </a>
            </section>
        </section>
    </>
    );
};

export default About;