import { Fragment, useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import Spinner from '@common/components/atoms/Spinner';
import { ctaLabels } from '@common/constants/labels';
import { isScrolledToBottom } from '@utilities/scroll';
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
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const bottomRef = useRef(null);
  const [zoomTouchMove, setZoomTouchMove] = useState(1);
  const initialDistance = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setIsLoading(false);
    setNumPages(numPages);
    setHasScrolledToEnd(false);
    pageRefs.current = new Array(numPages);
    checkIfScrollable();
  };

  const checkIfScrollable = () => {
    if (pageRefs.current.length <= 1) {
      setHasScrolledToEnd(true);
    }
  };

  const handleConfirmViewTerm = () => {
    let allowSubmit = false;
    if (hasScrolledToEnd) {
      allowSubmit = true;
    } else if (bottomRef.current) {
      const container = document.querySelector('.bottom__sheet__content');
      const scrolledBottom = isScrolledToBottom(container);
      if (scrolledBottom) {
        allowSubmit = true;
      } else {
        bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        setHasScrolledToEnd(true);
      }
    } else {
      allowSubmit = true;
    }

    if (allowSubmit) {
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
      setZoomTouchMove(prevScale => {
        const newZoom = Math.max(1, Math.min(2.5, prevScale * scaleChange));
        return newZoom;
      });
      initialDistance.current = newDistance;
    }
  };

  useEffect(() => {
    const heightTerm = `calc(93vh - ${hiddenConfirmBtn ? heightHeaderBS : heightFooterAndHeaderBS})`;
    document.documentElement.style.setProperty('--heightTerm', heightTerm);
  }, []);

  const handleOnLoadError = error => {
    setIsLoading(false);
  };

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
        {isLoading && <Spinner />}
        <div className="view-term__detail">
          <div
            className="view-term__item"
            ref={containerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            <div
              className="view-term_children"
              style={{ zoom: `${zoomTouchMove}` }}
            >
              <Document
                file={pdfFile}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={handleOnLoadError}
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
