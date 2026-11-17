import { Link } from "react-router-dom";
import styles from "./LinkExpired.module.css";
import { useParticles } from "../../hooks/useParticles";
import { Link2Off } from "lucide-react";

function LinkExpired() {
    const canvasRef = useParticles();

    return (
        <div className="page-section box-grid">
            <canvas ref={canvasRef} className="page-canvas" />

            <div className={`${styles.container} fade-up`}>

                <div className={styles.iconWrap} aria-hidden="true">
                    <div className={styles.iconRing} />
                    <Link2Off size={36} className={styles.icon} />
                </div>

                <span className={styles.badge}>
                    Link Expired
                </span>

                <div className={styles.divider}>
                    <span className={styles.dividerDot} />
                    <span className={styles.dividerLine} />
                    <span className={styles.dividerDot} />
                </div>

                <h1 className={styles.title}>This link has expired</h1>
                <p className={styles.description}>
                    The short link you followed is no longer active. <br />
                    It may have reached its expiry date or been removed.
                </p>

                <p className={styles.hint}>
                    Go back to <Link to="/app/dashboard" className={styles.hintLink}>shorten</Link> a new URL.
                </p>

            </div>
        </div>
    );
}

export default LinkExpired;
