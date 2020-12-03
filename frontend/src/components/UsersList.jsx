import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUsers, getAllUsers } from '../store/slices/usersSlice';

const UsersList = () => {
  const dispatch = useDispatch();
  const users = useSelector(getAllUsers);
  //(state) => state.entities.users.list

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  return (
    <>
      <h3>Here is the list</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.name}</li>
        ))}
      </ul>
    </>
  );
};

export default UsersList;
