/**
 * It takes a ref and a callback function as arguments, and returns a boolean value to the callback
 * function based on the scroll position of the ref
 * @param ref - The ref of the element you want to track.
 * @param cb - callback function
 */
const scrollImpact = (ref, cb) => {
  const topDistance = ref.scrollTop;
  if (topDistance > 0) {
    cb(true);
  } else {
    cb(false);
  }
};

export default scrollImpact;
