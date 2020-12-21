//package imports
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//app imports
import { loadUsers, getAllUsers } from '../../store/slices/usersSlice';

const UsersList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUsers());
  }, [dispatch]);

  const users = useSelector(getAllUsers);

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
