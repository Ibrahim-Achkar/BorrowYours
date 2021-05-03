//package imports
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//app imports
import { loadItems, getAllItems } from '../../store/slices/itemsSlice';

const ItemsCarousel = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadItems());
  }, [dispatch]);

  const items = useSelector(getAllItems);

  return (
    <>
      <h3>Here is the list</h3>
      <ul>
        {items.map((items) => (
          <li key={items._id}>{items.name}</li>
        ))}
      </ul>
    </>
  );
};

export default ItemsCarousel;
