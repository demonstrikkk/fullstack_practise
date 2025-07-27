

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function useUserProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const { data: session } = useSession();

  // Fetch All Users Data
  const getAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/findall`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch First User Data Matching Condition
  const getFirstUser = async (email) => {
    setLoading(true);
    setError(null);
    try {
      localStorage.setItem('email',email)
      const response = await fetch(`/api/findfirst?email=${encodeURIComponent(email)}`);

      if (!response.ok) throw new Error('Failed to fetch user');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  // Create User Data
  const createUser = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Unknown Error');
      setData(result.student);
      return { success: true, student: result.student };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  

  // Update User Data
  const updateUser = async (userId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, ...updateData }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update user');
      setData(result.student);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete User Data
  const deleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to delete user');
      setData(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, getAllUsers, getFirstUser, createUser, updateUser, deleteUser };
}


