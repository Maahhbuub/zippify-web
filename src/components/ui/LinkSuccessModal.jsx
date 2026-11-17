import { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, X } from 'lucide-react';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import styles from './LinkSuccessModal.module.css';

function LinkSuccessModal({ link, onClose }) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!link) return;

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') onClose();
        };

        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [link, onClose]);

    if (!link) return null;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(link.shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy');
        }
    };

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) onClose();
    };

    return createPortal(
        <div
            className={styles.overlay}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="link-success-title"
        >
            <div className={styles.modal}>
                <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
                    <X size={17} />
                </button>

                <div className={styles.heading}>
                    <h2 id="link-success-title">Your link is ready!</h2>
                    <p>Your new short link has been created successfully.</p>
                </div>

                <div className={styles.linkCard}>
                    <span className={styles.label}>Short link</span>
                    <a
                        href={link.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.shortUrl}
                    >
                        {link.shortUrl}
                        <ExternalLink size={14} />
                    </a>
                    <button
                        type="button"
                        className={`${styles.copyBtn} ${copied ? styles.copied : ''}`}
                        onClick={handleCopy}
                        aria-label={copied ? 'Short link copied' : 'Copy short link'}
                        title={copied ? 'Copied!' : 'Copy link'}
                    >
                        {copied ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                </div>

                <div className={styles.destination} title={link.longUrl}>
                    <span className={styles.label}>Destination</span>
                    <span className={styles.longUrl}>{link.longUrl}</span>
                </div>

                <button type="button" className={styles.doneBtn} onClick={onClose}>
                    Done
                </button>
            </div>
        </div>,
        document.body
    );
}

export default LinkSuccessModal;
