import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const onChange = (e) => {
        setMessage(e.target.value);
    };

    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                setLoading(true);
                setError(false);
                const res = await fetch(`/api/user/${listing.userRef}`);
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await res.json();
                setLandlord(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError(true);
                setLoading(false);
            }
        };
        fetchLandlord();
    }, [listing.userRef]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Something went wrong.</p>;
    }

    return (
        <>
            {landlord && (
                <div className='flex flex-col gap-2'>
                    <p>Contact <span className='font-semibold'>{landlord.username}</span> for
                    <span className='font-semibold'>{' '+listing.name.toLowerCase()}</span></p>
                    <textarea name="message" id="message" rows="2"
                    value={message} onChange={onChange} placeholder='Enter Your Message Here' 
                    className='w-full border p-3 rounded-lg'></textarea>
                    <Link
                    to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
                    className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
                    >
                    Send Message
                    </Link>
                </div>
            )}
        </>
    );
}
