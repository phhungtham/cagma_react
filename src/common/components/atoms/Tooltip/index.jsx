import { useContext, useEffect, useMemo, useRef } from 'react';

import { CloseIcon } from '@assets/icons';
import { TooltipContext } from '@common/components/atoms/Tooltip/TooltipContext';
import { allowedPlacements, placementsMap } from '@common/components/constants';
import { createPopper } from '@popperjs/core';
import { PropTypes } from 'prop-types';

import './styles.scss';

const Tooltip = ({ children, content, placement, onlyCloseBtn }) => {
  const { currentId, onChangeDisplayTooltipId } = useContext(TooltipContext);
  const popperButtonRef = useRef(null);
  const popperPopupRef = useRef(null);

  //every component tooltip will have an unique ID
  // use for requirement only show 1 tooltip per time
  const tooltipId = useMemo(() => String(Math.random()) + String(Math.random()), []);

  const isVisible = currentId === tooltipId;

  const togglePopper = () => {
    if (isVisible) {
      onChangeDisplayTooltipId(null);
      return;
    }

    onChangeDisplayTooltipId(tooltipId);
  };

  const onClosePopper = () => {
    if (isVisible) {
      onChangeDisplayTooltipId(null);
    }
  };

  const handleClickOutside = event => {
    if (
      popperPopupRef.current &&
      !popperPopupRef.current.contains(event.target) &&
      !popperButtonRef.current.contains(event.target)
    ) {
      onChangeDisplayTooltipId(null);
    }
  };

  useEffect(() => {
    let popperInstance = null;

    if (isVisible && !!content) {
      popperInstance = createPopper(popperButtonRef.current, popperPopupRef.current, {
        placement: placementsMap?.[placement] || 'auto',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 13],
            },
          },
          {
            name: 'flip',
            options: {
              // only top, bottom placement is allowed
              allowedAutoPlacements: allowedPlacements,
              rootBoundary: 'viewport',
            },
          },
        ],
      });

      // if onlyCloseBtn is true => the popover is only close by click in the children or close button
      // if not, the popover will close when click out (not focus) the popover
      if (!onlyCloseBtn) {
        document.addEventListener('mousedown', handleClickOutside);
      }
    }

    return () => {
      if (popperInstance) {
        popperInstance.destroy();
      }

      if (!onlyCloseBtn) {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [isVisible]);

  return (
    <div>
      <div
        ref={popperButtonRef}
        onClick={togglePopper}
      >
        {children}
      </div>
      <div
        id="popper-popup"
        ref={popperPopupRef}
        className={isVisible ? 'show' : 'hidden'}
      >
        <div className="__popover_content">
          {content}
          <div
            className="__btn_close"
            onClick={onClosePopper}
          >
            <CloseIcon size="small" />
          </div>
        </div>
      </div>
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.element.isRequired,
  content: PropTypes.string.isRequired,
  placement: PropTypes.oneOf(Object.keys(placementsMap)),
  onlyCloseBtn: PropTypes.bool,
};

Tooltip.defaultProps = {
  onlyCloseBtn: false,
};

export default Tooltip;
