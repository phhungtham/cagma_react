const isMaxVisaCard = cards => {
  if (!cards || !cards.length) return false;
  let navyCard = 0,
    pinkCard = 0,
    goldCard = 0,
    virtualCard = 0;
  cards.forEach(card => {
    if (card.card_virtual_yn === 1) {
      virtualCard++;
    } else {
      if (card.join_etpr_no === '0006') navyCard++;
      if (card.join_etpr_no === '0007') pinkCard++;
      if (card.join_etpr_no === '0008') goldCard++;
    }
  });
  return navyCard >= 1 && pinkCard >= 1 && goldCard >= 1 && virtualCard >= 5;
};

export default isMaxVisaCard;
