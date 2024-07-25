import { ArrowLeft, ArrowRight, FilterIcon, SearchThinIcon } from 'assets/icons';

const HeaderAction = ({ filterAction, searchAction, showDataPicker, recentDate, movePrev, moveNext }) => {
  return (
    <div className="header__action">
      <section className="date__picker">
        <div className="left__arrow" onClick={movePrev}>
          <ArrowLeft />
        </div>
        <div className="date__label" onClick={() => showDataPicker(true)}>
          {recentDate}
        </div>
        <div className="right__arrow" onClick={moveNext}>
          <ArrowRight />
        </div>
      </section>
      <section className="action">
        <div className="filter__action" onClick={() => filterAction(true)}>
          <FilterIcon />
        </div>
        <div className="vertical__line"></div>
        <div className="search__action" onClick={() => searchAction(true)}>
          <SearchThinIcon />
        </div>
      </section>
    </div>
  );
};

export default HeaderAction;
