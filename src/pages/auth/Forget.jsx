import { useState } from 'react'
import styles from './Forget.module.css'

import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/api';
import SpamCheckModal from '../../components/ui/SpamCheckModal';


function Forget() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showSpamPopup, setShowSpamPopup] = useState(false);
    const [sentEmail, setSentEmail] = useState('');

    let handleData = (event) => {
        setEmail(event.target.value);
    }

    let handleSubmit = async (event) => {
        event.preventDefault();

        if (!email) {
            toast.error("Email can't be empty");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSentEmail(email);
            setEmail("");
            setShowSpamPopup(true);
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className={`${styles.forget} box-grid`}>
            <div className={`${styles.wrapper}`}>
                <div className={`${styles.header}`}>
                    <h2>Forget</h2>
                    <p>We'll send a password reset link to your inbox.</p>
                </div>

                <div className={`${styles.forgetField}`}>
                    <form action="#" onSubmit={handleSubmit}>
                        <div className={`${styles.field}`}>
                            <label htmlFor="email">Email</label>
                            <input onChange={handleData} value={email} type="email" name='email' id='email' placeholder='Your email address' autoComplete='email' />
                        </div>

                        <button type='submit' className={`${styles.submitBtn} ${loading ? 'btn-loading' : ''}`}>{loading ? 'Sending...' : 'Send'}</button>
                    </form>
                </div>

                <div className={`${styles.goLogin}`}>
                    Remember your password? <Link to='/auth/login'>Login</Link>
                </div>
            </div>

            <SpamCheckModal
                isOpen={showSpamPopup}
                email={sentEmail}
                message="We've sent a password reset link to"
                onClose={() => { setShowSpamPopup(false); navigate('/auth/login'); }}
            />
        </div>
    )
}

export default Forget;