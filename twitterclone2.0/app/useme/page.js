'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoggedOut() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/userdetailvialogin');
  }, []);

  return <p>Logging you out...</p>;
}
