import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { ctaLabels } from '@common/constants/labels';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { PropTypes } from 'prop-types';

import BottomSheet from '../../../templates/BottomSheet';
import './style.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;

const heightHeaderBS = '59px';
const heightFooterAndHeaderBS = '181px';
const paddingY = 48;

const ViewTermBottom = ({ open, onClose, title, subTitle, pdfFile, onConfirm, hiddenConfirmBtn, translate: t }) => {
  const widthPDf = (window.innerWidth || document.documentElement.clientWidth) - paddingY;
  const [numPages, setNumPages] = useState(null);
  const containerRef = useRef(null);
  const pageRefs = useRef([]);
  const isScrollable = useRef(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const bottomRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  const [scaleTouchMove, setScaleTouchMove] = useState(1);
  const initialDistance = useRef(0);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setHasScrolledToEnd(false);
    pageRefs.current = new Array(numPages);
    checkIfScrollable();
  };

  const handleScroll = useCallback(() => {
    if (isScrollable.current) {
      checkIfScrolledToEnd();
    }
  }, []);

  const checkIfScrollable = useCallback(() => {
    if (pageRefs.current.length > 1) {
      isScrollable.current = true;
    } else {
      isScrollable.current = false;
      setHasScrolledToEnd(true);
    }
  }, []);

  const checkIfScrolledToEnd = useCallback(() => {
    if (bottomRef.current && containerRef.current) {
      const bottom = bottomRef.current.getBoundingClientRect();
      const container = containerRef.current.getBoundingClientRect();
      if (Math.floor(bottom.bottom) <= container.bottom) {
        setHasScrolledToEnd(true);
      } else {
        setHasScrolledToEnd(false);
      }
    }
  }, []);

  const debounce = (func, delay) => {
    let timeOut;
    return (...args) => {
      clearTimeout(timeOut);
      timeOut = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debounceScroll = debounce(handleScroll, 500);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', debounceScroll);
      return () => container.removeEventListener('scroll', debounceScroll);
    }
  }, []);

  const handleConfirmViewTerm = () => {
    if (bottomRef.current && !hasScrolledToEnd && !hasScrolled) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      setHasScrolled(true);
    } else if (hasScrolled || hasScrolledToEnd) {
      setHasScrolled(false);
      if (onConfirm) {
        onConfirm();
      } else {
        onClose();
      }
    }

    //Load file failed
    if (!bottomRef.current) {
      if (onConfirm) {
        onConfirm();
      } else {
        onClose();
      }
    }
  };

  const handleTouchStart = e => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      initialDistance.current = Math.sqrt((touch1.pageX - touch2.pageX) ** 2 + (touch1.pageY - touch2.pageY) ** 2);
    }
  };

  const handleTouchMove = e => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const newDistance = Math.sqrt((touch1.pageX - touch2.pageX) ** 2 + (touch1.pageY - touch2.pageY) ** 2);

      const scaleChange = newDistance / initialDistance.current;
      setScaleTouchMove(prevScale => {
        const newScale = Math.max(1, Math.min(2.5, prevScale * scaleChange));
        const newPadding = (newScale - 1) * 300;
        if (newScale === 1) {
          document.documentElement.style.removeProperty('--padding');
        } else {
          document.documentElement.style.setProperty('--padding', `${newPadding}px`);
        }
        return newScale;
      });
      initialDistance.current = newDistance;
    }
  };

  useEffect(() => {
    const heightTerm = `calc(93vh - ${hiddenConfirmBtn ? heightHeaderBS : heightFooterAndHeaderBS})`;
    document.documentElement.style.setProperty('--heightTerm', heightTerm);
  }, []);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      subTitle={subTitle}
      clazz="view-term-bottom__wrapper"
      type="max"
    >
      <div className="view-term__content">
        <div className="view-term__detail">
          <div
            className="view-term__item"
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div
              className="view-term_children"
              style={{ transform: `scale(${scaleTouchMove})` }}
            >
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                {[...Array(numPages)].map((_, index) => (
                  <Fragment key={index + 1}>
                    <Page
                      pageNumber={index + 1}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      scale={1}
                      width={widthPDf}
                    />
                  </Fragment>
                ))}
                <div ref={bottomRef} />
              </Document>
            </div>
          </div>
        </div>
        {!hiddenConfirmBtn && (
          <div className="view-term__footer">
            <Button
              label={t(ctaLabels.confirm)}
              variant="filled__primary"
              className="btn__cta"
              onClick={handleConfirmViewTerm}
            />
          </div>
        )}
      </div>
    </BottomSheet>
  );
};

ViewTermBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  pdfFile: PropTypes.string,
  onClickSubmit: PropTypes.func,
  setHasScrolledToEnd: PropTypes.func,
  bottomRef: PropTypes.any,
};

ViewTermBottom.defaultProps = {
  open: false,
  onClose: () => {},
  title: '',
  subTitle: '',
  pdfFile: '',
  onClickSubmit: () => {},
  setHasScrolledToEnd: PropTypes.func,
};

export default withHTMLParseI18n(ViewTermBottom);
