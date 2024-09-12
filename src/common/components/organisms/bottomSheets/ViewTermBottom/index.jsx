import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import { useTermAndConditions } from '@pages/Account/OpenAccount/components/TermAndConditions/TermAndConditionsContext';
import { PropTypes } from 'prop-types';

import BottomSheet from '../../../templates/BottomSheet';
import './style.scss';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const ViewTermBottom = ({ open, onClose, title, subTitle, pdfFile }) => {
  const [numPages, setNumPages] = useState(null);
  const containerRef = useRef(null);
  const pageRefs = useRef([]);
  const isScrollable = useRef(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const bottomRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  const { viewTermBottom, setViewTermBottom, checkedOptions, setCheckedOptions } = useTermAndConditions();

  const getResponsiveWidth = () => {
    if (window.innerWidth > 425) {
      return { width: 310, scale: 1.2 };
    } else if (window.innerWidth > 375) {
      return { width: 300, scale: 1.1 };
    } else {
      return { width: 550, scale: 0.6 };
    }
  };

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

  const { width, scale } = useMemo(() => getResponsiveWidth(), []);

  const handleConfirmViewTerm = () => {
    const checkedValue = viewTermBottom.value;
    if (bottomRef.current && !hasScrolledToEnd && !hasScrolled) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
      setHasScrolled(true);
    } else if (hasScrolled || hasScrolledToEnd) {
      if (!checkedOptions.includes(checkedValue)) {
        setCheckedOptions([...checkedOptions, checkedValue]);
      }
      setViewTermBottom({ ...viewTermBottom, open: false });
      setHasScrolled(false);
    }
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      subTitle={subTitle}
      clazz="view-term-bottom__wrapper"
      type="max-scroll"
    >
      <div className="view-term__content">
        <div className="view-term__detail">
          <div
            className="view-term__item"
            ref={containerRef}
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
                    scale={scale}
                    width={width}
                  />
                </Fragment>
              ))}
              <div ref={bottomRef} />
            </Document>
          </div>
        </div>
        <div className="view-term__footer">
          <Button
            label="Confirm"
            variant="filled__primary"
            className="btn__cta"
            onClick={handleConfirmViewTerm}
          />
        </div>
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

export default ViewTermBottom;
