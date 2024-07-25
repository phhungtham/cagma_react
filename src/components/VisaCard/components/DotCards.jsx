const DotCards = ({ cardList, currentCard }) => {
  return (
    <div className="dot__wrapper">
      <ul>
        {cardList.map(cardItem => (
          <li className={cardItem?.card_no === currentCard?.card_no && 'dot-active'}>
            <button></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DotCards;
