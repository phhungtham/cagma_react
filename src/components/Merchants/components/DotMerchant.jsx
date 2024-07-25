const DotMerchant = ({ merchantList, curIdx }) => {
  return (
    <div className="dot__wrapper">
      <ul>
        {merchantList.slice(0, 5).map((_, idx) => (
          <li
            className={
              ((curIdx < merchantList.slice(0, 5).length && idx === curIdx) ||
                (curIdx >= merchantList.slice(0, 5).length && idx === curIdx % 5)) &&
              'dot-active'
            }
          >
            <button></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DotMerchant;
