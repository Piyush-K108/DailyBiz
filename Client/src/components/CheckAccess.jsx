import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

const useCheckAccess = () => {

  const phone = useSelector(state => state.counter.phone);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    const phones = ['6262302626',"7024949888"];
    setHasAccess(phones.includes(phone));
  }, [phone]);

  return hasAccess;
};

export default useCheckAccess;
