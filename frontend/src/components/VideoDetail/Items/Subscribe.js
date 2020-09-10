import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Subscribe = (props) => {
  const [subscribeNumber, setSubscribeNumber] = useState(0);
  const [subscribedFlag, setSubscribedFlag] = useState(false);
  const [status, setStatus] = useState('idle');
  const { userFrom, userTo } = props;

  const onSubscribe = () => {
    const bothUserInfo = {
      userFrom,
      userTo
    }

    // Already subscribed
    if (subscribedFlag) {
      axios.post('/api/subscribe/unSubscribe', bothUserInfo)
        .then(response => {
          if (response.data.success) {
            setSubscribeNumber(subscribeNumber - 1);
            setSubscribedFlag(!subscribedFlag);
          } else {
            alert('Failed to un-subscribe');
          }
        })
    } else {
      axios.post('/api/subscribe/subscribe', bothUserInfo)
        .then(response => {
          if (response.data.success) {
            setSubscribeNumber(subscribeNumber + 1);
            setSubscribedFlag(!subscribedFlag);
          } else {
            alert('Failed to un-subscribe');
          }
        })
    }
  }

  useEffect(() => {
    const subscribeParam = { userTo };
    const subscribedParam = { userTo, userFrom };

    setStatus('fetching');

    const fetchData = async () => {
      await axios.post('/api/subscribe/subscribeNumber', subscribeParam)
        .then(response => {
          if (response.data.success) {
            setSubscribeNumber(response.data.subscribeNumber);
          } else {
            alert('Unable to fetch subscribe number');
          }
        });

      await axios.post('/api/subscribe/subscribed', subscribedParam)
        .then(response => {
          if (response.data.success) {
            setSubscribedFlag(response.data.subscribedFlag);
          } else {
            alert('Unable to fetch subscribed flag');
          }
        })

      setStatus('fetched');
    }

    fetchData();
  }, [userTo, userFrom]);

  if (status === 'fetched') {
    return (
      <div>
        <button
          style={{
            backgroundColor: `${subscribedFlag ? '#AAAAAA' : '#F08686'}`, borderRadius: '4px',
            color: 'white', padding: '10px 16px',
            fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase',
            cursor: 'pointer'
          }}
          onClick={onSubscribe}
        >
          #{subscribeNumber} {subscribedFlag ? 'Subscribed' : 'Subscribe'}
        </button>
      </div>
    );
  } else return (<div></div>);
};

export default Subscribe;