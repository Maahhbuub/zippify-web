import { useEffect } from 'react';
import { AlertTriangle, MailCheck, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import styles from './SpamCheckModal.module.css';

function SpamCheckModal({
    isOpen,
    email,
    message,
    onClose,
    closeText = 'Got it!',
}) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) onClose();
    };

    return createPortal(
        <div
            className={styles.overlay}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="spam-check-title"
        >
            <div className={styles.popupBox}>
                <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
                    <X size={17} />
                </button>

                <div className={styles.popupIcon}>
                    <MailCheck size={28} />
                </div>
                <h3 id="spam-check-title" className={styles.popupTitle}>Check your email</h3>
                <p className={styles.popupMsg}>
                    {message} <strong>{email}</strong>.
                </p>
                <p className={styles.popupSpamHint}>
                    <AlertTriangle size={17} className={styles.popupSpamHintIcon} />
                    <span>
                        Check your <strong>Spam</strong> or <strong>Junk</strong> folder too it may have landed there.
                    </span>
                </p>
                <button type="button" className={styles.popupClose} onClick={onClose}>
                    {closeText}
                </button>
            </div>
        </div>,
        document.body
    );
}

export default SpamCheckModal;
