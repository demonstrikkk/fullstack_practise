// import { useState } from 'react';

// export default function useUserProfile() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);

// //   // Fetch User Data
// //   const getUser = async (slug) => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetch(`/api/${slug}/page`); // Corrected path to match structure
// //       const result = await response.json();
// //       console.log(result)

// //       if (!response.ok) throw new Error(result.message);

// //       setData(result.user);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Create User Data
// //   const createUser = async (userData) => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetch(`/api/lib/models/${slug}`, { // Endpoint for model creation
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(userData),
// //       });
// //       const result = await response.json();

// //       if (!response.ok) throw new Error(result.message);

// //       setData(result.user);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Update User Data
// //   const updateUser = async (userId, updateData) => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetch(`/api/lib/models/${userId}`, { // Targeting specific user in models
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(updateData),
// //       });
// //       const result = await response.json();

// //       if (!response.ok) throw new Error(result.message);

// //       setData(result.user);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Delete User Data
// //   const deleteUser = async (userId) => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const response = await fetch(`/api/lib/models/${userId}`, { // Deleting by ID using models
// //         method: 'DELETE',
// //         headers: { 'Content-Type': 'application/json' },
// //       });
// //       const result = await response.json();

// //       if (!response.ok) throw new Error(result.message);

// //       setData(null);
// //     } catch (err) {
// //       setError(err.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };


// // Fetch User Data
// const getUser = async (slug) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`/api/lib/models/${slug}`);
//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message);
//       setData(result.user);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Create User Data
//   const createUser = async (userData) => {
//     setLoading(true);
//     setError(null);
//     try {
//         const response = await fetch(`/api/lib/models`, { 
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });
//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message);
//       setData(result.user);
//     } catch (err) {
//         setError(err.message);
//     } finally {
//         setLoading(false);
//     }
//   };
  
//   // Update User Data
//   const updateUser = async (userId, updateData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`/api/lib/models/${userId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updateData),
//     });
//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message);
//       setData(result.user);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Delete User Data
//   const deleteUser = async (userId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`/api/lib/models/${userId}`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message);
//       setData(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
  
//   return { data, loading, error, getUser, createUser, updateUser, deleteUser };
//   }

// import { useState } from 'react';
// import { useSession } from 'next-auth/react';
// export default function useUserProfile() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState(null);
// let {data:session} = useSession()
//   // Fetch User Data
//   const getUser = async (slug) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`/api/${slug}`);
//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message);
//       setData(result.user);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create User Data
//   const createUser = async (userData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`/api/${encodeURIComponent(userData.username)}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData),
//       });
//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message);
//       setData(result.user);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//     // try {
//     //   const response = await fetch(`api/${session.user.username}`, {
//     //     method: 'POST',
//     //     headers: { 'Content-Type': 'application/json' },
//     //     body: JSON.stringify(formData),
//     //   });
  
//     //   if (!response.ok) {
//     //     const errorData = await response.json();
//     //     throw new Error(errorData.message || 'Failed to create user');
//     //   }
  
//     //   return await response.json();
//     // } catch (error) {
//     //   console.error('API error:', error);
//     //   throw error;
//     // }
//   };

//   // Update User Data
//   const updateUser = async (userId, updateData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`/api/${slug}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updateData),
//       });
//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message);
//       setData(result.user);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete User Data
//   const deleteUser = async (userId) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`/api/${slug}`, {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//       });
//       const result = await response.json();
//       if (!response.ok) throw new Error(result.message);
//       setData(null);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { data, loading, error, getUser, createUser, updateUser, deleteUser };
// }


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
    console.log(email)
    setLoading(true);
    setError(null);
    try {
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
