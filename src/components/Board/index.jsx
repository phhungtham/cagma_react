import Accoridan from '@common/ui/components/atomic/Accoridan';
import BottomSheet from '@common/ui/components/atomic/BottomSheet';
import InputSearch from '@common/ui/components/atomic/Input/InputSearch';
import Label from '@common/ui/components/atomic/Label';
import SeeMorePagination from '@common/ui/components/atomic/Pagination';
import Span from '@common/ui/components/atomic/Span';
import Tabs from '@common/ui/components/atomic/Tabs';
import Header from '@common/ui/components/Header';
import { scrollImpact } from '@utilities/index';
import { NewsIcon } from 'assets/icons';
import { useRef, useState } from 'react';
import no_result from '../../assets/images/no-result.png';

const Board = () => {
  const BOARD_TABS = {
    ALL: 'All',
    NEWS: 'News',
    NOTICE: 'Notice'
  };

  const boardRef = useRef(null);
  const [boardList, setBoardList] = useState(Array.from(Array(10).keys()));
  const [currentTab, setCurrentTab] = useState(BOARD_TABS.ALL);
  const [showBoardDetail, setShowBoardDetail] = useState(false);
  const [isHeaderExpand, setIsHeaderExpand] = useState(false);

  const handleTabChange = tabName => {
    setCurrentTab(tabName);
  };

  const handleBoardClick = () => {
    setShowBoardDetail(true);
  };

  const renderBoardList = () => {
    return boardList.map((data, index) => (
      <Accoridan
        key={index}
        label="Label"
        title="Shinhan Bank Vietnam Honors 2014 Government Emulation Flag"
        titleIcon={{
          name: NewsIcon,
          position: 'right'
        }}
        captionSegments={{
          type: 1,
          caption1: '01.04.2022'
        }}
        panelData={{
          text: 'Enter at least 2 lines of title. Enter at least 2  lines of title.'
        }}
        onClick={() => handleBoardClick(data)}
      />
    ));
  };

  return (
    <div className="board__wrapper">
      <div className="board__header">
        <Header isExpand={isHeaderExpand} title={'Board'} />
      </div>
      <div className="board__search">
        <InputSearch size="large" placeHolder="Type your question here" />
      </div>
      <div className="board__tab">
        <Tabs
          tabList={[
            {
              title: BOARD_TABS.ALL
            },
            {
              title: BOARD_TABS.NEWS
            },
            {
              title: BOARD_TABS.NOTICE
            }
          ]}
          onTabChange={handleTabChange}
        >
          {boardList.length > 0 && (
            <div
              className="board__content"
              ref={boardRef}
              onScroll={() => scrollImpact(boardRef.current, setIsHeaderExpand)}
            >
              {renderBoardList()}
              <div className="board__pagination">
                <SeeMorePagination currentTotalItem={10} allTotalItem={30} />
              </div>
            </div>
          )}
        </Tabs>
        {/* Bottom sheet show details */}
        <BottomSheet clazz="board__detail" type="max" open={showBoardDetail} onClose={() => setShowBoardDetail(false)}>
          <div className="board__detail__top">
            <Label label={'Notice'} variant="primary" />
            <Span clazz="title" text="Banking system upgrade complete" />
            <Span clazz="time" text="01.04.2022" />
          </div>
          <div className="board__detail__content">
            <img src={no_result} alt="no_result" />
            <p>
              Our system upgrade to better our service has been successfully completed. We sincerely thank our customers
              for waiting and are pleased to inform that our services have resumed back to normal. We ask for your
              understanding and we will always do our best to provide convenient and reliable service. Our system
              upgrade to better our service has been successfully completed. We sincerely thank our customers for
              waiting and are pleased to inform that our services have resumed back to normal. We ask for your
              understanding and we will always do our best to provide convenient and reliable service. Our system
              upgrade to better our service has been successfully completed. We sincerely thank our customers for
              waiting and are pleased to inform that our services have resumed back to normal. We ask for your
              understanding and we will always do our best to provide ceased to inform that our services have resumed
              back to normal. We ask for your understanding and we will always do our best to provide convenient and
              reliable service. Our system upgrade to better our service has been successfully completed. We sincerely
              thank our customers for waiting and are pleased to inform that our services have resumed back to normal.
              We ask for your understanding and we will always do our best to provide ceased to inform that our services
              have resumed back to normal. We ask for your understanding and we will always do our best to provide
              convenient and reliable service. Our system upgrade to better our service has been successfully completed.
              We sincerely thank our customers for waiting and are pleased to inform that our services have resumed back
              to normal. We ask for your understanding and we will always do our best to provide ceased to inform that
              our services have resumed back to normal. We ask for your understanding and we will always do our best to
              provide convenient and reliable service. Our system upgrade to better our service has been successfully
              completed. We sincerely thank our customers for waiting and are pleased to inform that our services have
              resumed back to normal. We ask for your understanding and we will always do our best to provide convenient
              and reliable service.
            </p>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
};

export default Board;
