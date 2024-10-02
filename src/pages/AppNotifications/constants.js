export const transactionListDummy = [
  {
    title: 'You have changed your information.',
    time: 'Mar 18, 2024 16:20',
    read: false,
  },
  {
    title: (
      <span>
        <span className="font-bold">-$200.00</span> to Bohyun Kim
      </span>
    ),
    time: 'Mar 18, 2024 16:20',
    read: true,
  },
  {
    title: (
      <span>
        <span className="text-primary font-bold">+$500.00</span> from Bohyun Kim
      </span>
    ),
    time: 'Mar 18, 2024 16:20',
    read: true,
  },
  {
    title: 'You’re account is below $100.00',
    time: 'Mar 18, 2024 16:20',
    read: true,
  },
];

export const offerListDummy = [
  {
    label: 'Your Offer',
    title: 'You’re account is below $100.00💙 ',
    time: 'Mar 18, 2024 16:20',
    read: false,
  },
  {
    label: 'Label',
    title: 'You’re account is below $100.00💙 ',
    time: 'Mar 18, 2024 16:20',
    read: true,
  },
  {
    label: 'Label',
    title: 'You’re account is below $100.00💙 ',
    time: 'Mar 18, 2024 16:20',
    read: true,
  },
];

export const promotionListDummy = [
  {
    title: 'Pension Plan Direct Deposit Event!',
    content: 'Special 1,000 Giveaways!',
    read: false,
  },
  {
    title: 'Pension Plan Direct Deposit Event!',
    content: 'Special 1,000 Giveaways!',
    read: true,
  },
  {
    title: 'Pension Plan Direct Deposit Event!',
    content: 'Special 1,000 Giveaways!',
    read: true,
  },
];

export const NotificationRequestType = {
  TRANSACTION: '01',
  OFFER: 'etc',
};

export const NotificationTabIndex = {
  TRANSACTIONS: 0,
  OFFERS: 1,
  PROMOTIONS: 2,
};

export const NotificationTabLabel = {
  TRANSACTIONS: 'Transactions',
  OFFERS: 'Your Offers',
  PROMOTIONS: 'Promotions',
};

export const NotificationLinkType = {
  EXTERNAL_LINK: ['4'],
  INTERNAL_LINK: ['1', '2', '3'],
};

export const initRecentMonthNumber = 3;
