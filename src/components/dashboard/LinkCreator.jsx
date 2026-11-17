import { useState, useRef, useEffect } from 'react';
import { Link2, CalendarDays, ChevronDown, Check, PenLine } from 'lucide-react';
import styles from './LinkCreator.module.css';
import toast from 'react-hot-toast';
import api from '../../api/api';
import LinkSuccessModal from '../ui/LinkSuccessModal';

const EXPIRE_OPTIONS = [
    { label: 'No expiry', value: '' },
    { label: '7 days', value: '7' },
    { label: '30 days', value: '30' },
    { label: '6 months', value: '180' },
    { label: '1 year', value: '365' },
];

function LinkCreator({ onAdd }) {
    const [formdata, setFormdata] = useState({
        url: "",
        alias: "",
        expireDay: "",
    });

    const [loading, setLoading] = useState(false);
    const [createdLink, setCreatedLink] = useState(null);

    const [dropOpen, setDropOpen] = useState(false);
    const dropRef = useRef(null);

    useEffect(() => {
        const handler = (e) => {
            if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleData = (event) => {
        const { name, value } = event.target;
        setFormdata((curr) => ({
            ...curr,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formdata.url.trim()) {
            toast.error("URL can not be empty");
            return;
        };

        const trimmedAlias = formdata.alias.trim();
        if (trimmedAlias) {
            if (!/^[a-zA-Z0-9]+$/.test(trimmedAlias)) {
                toast.error("Alias must be letters or numbers");
                return;
            }
        }

        setLoading(true);
        try {
            const payload = {
                longUrl: formdata.url.trim(),
            };
            if (formdata.alias.trim()) payload.alias = formdata.alias.trim();
            if (formdata.expireDay) payload.expiresInDays = Number(formdata.expireDay);

            const res = await api.post('/', payload);
            setCreatedLink({
                shortUrl: window.location.origin + "/" + res.data.url.shortCode,
                longUrl: formdata.url.trim(),
            });

            setFormdata({ url: '', alias: '', expireDay: '' });
            if (onAdd) onAdd(res.data.url);
        } catch (err) {
            console.error(err.response?.data || err.message);
            const message = err.response?.data?.message || err.response?.data || err.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fields}>

                    <div className={styles.urlInput}>
                        <Link2 size={16} className={styles.icon} />
                        <input
                            type="text"
                            name="url"
                            value={formdata.url}
                            onChange={handleData}
                            placeholder="Paste your long URL here…"
                            id="new-url-input"
                        />
                    </div>

                    <div className={styles.aliasWrap}>
                        <PenLine size={15} className={styles.icon} />
                        <input
                            type="text"
                            name="alias"
                            value={formdata.alias}
                            onChange={handleData}
                            placeholder="alias (optional)"
                            className={styles.aliasInput}
                            maxLength={10}
                        />
                    </div>

                    <div className={styles.expireWrap} ref={dropRef}>
                        <button
                            type="button"
                            className={styles.expireTrigger}
                            onClick={() => setDropOpen(v => !v)}
                            id="expire-select"
                        >
                            <CalendarDays size={14} className={styles.icon} />
                            <span className={formdata.expireDay ? styles.expireActive : styles.expirePlaceholder}>
                                {EXPIRE_OPTIONS.find(o => o.value === formdata.expireDay)?.label ?? 'No expiry'}
                            </span>
                            <ChevronDown size={13} className={`${styles.chevron} ${dropOpen ? styles.chevronOpen : ''}`} />
                        </button>

                        {dropOpen && (
                            <div className={styles.menu}>
                                {EXPIRE_OPTIONS.map(o => (
                                    <button
                                        key={o.value}
                                        type="button"
                                        className={`${styles.option} ${formdata.expireDay === o.value ? styles.optionActive : ''}`}
                                        onClick={() => {
                                            setFormdata(curr => ({ ...curr, expireDay: o.value }));
                                            setDropOpen(false);
                                        }}
                                    >
                                        {o.label}
                                        {formdata.expireDay === o.value && <Check size={13} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <button type="submit" disabled={loading} className={`${styles.submit} ${loading ? 'btn-loading' : ''}`}>
                    Shorten Now
                </button>
            </form>

            <LinkSuccessModal link={createdLink} onClose={() => setCreatedLink(null)} />
        </div>
    );
}

export default LinkCreator;
