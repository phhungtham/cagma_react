import React from 'react';

const SeeMorePagination = props => {
  const { clazz, currentTotalItem = 0, allTotalItem = 0 } = props;
  return <section className={`pagination ${clazz}`}>{`See More ${currentTotalItem}/${allTotalItem}`}</section>;
};

export default SeeMorePagination;
