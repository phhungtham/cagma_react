import { Fragment } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import LocationMap from '@common/components/atoms/LocationMap';
import BottomSheet from '@common/components/templates/BottomSheet';
import { branchFields } from '@pages/Appointment/constants';
import { PropTypes } from 'prop-types';

import './styles.scss';

const ViewMapBottom = ({ open, onClose, branchData, onBookAppointment }) => {
  function encodeToURL(str) {
    return str
      .replace(/"/g, '%22')
      .replace(/#/g, '%23')
      .replace(/\$/g, '%24')
      .replace(/%/g, '%25')
      .replace(/&/g, '%26')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\+/g, '%2B')
      .replace(/,/g, '%2C')
      .replace(/\//g, '%2F')
      .replace(/:/g, '%3A')
      .replace(/;/g, '%3B')
      .replace(/</g, '%3C')
      .replace(/=/g, '%3D')
      .replace(/>/g, '%3E')
      .replace(/\?/g, '%3F')
      .replace(/@/g, '%40')
      .replace(/\[/g, '%5B')
      .replace(/\]/g, '%5D')
      .replace(/\|/g, '%7C');
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="View Map"
      clazz="bottom__dropdown__wrapper"
      type="fit-content"
    >
      <div className="view_map">
        <div className="map">
          <LocationMap address={encodeToURL(branchData?.caption || '')} />
        </div>
        <div className="content">
          <div className="title">{branchData?.title || ''}</div>
          <div className="detail_info">
            {!!branchData &&
              branchFields.map(({ label, value }, index) => (
                <Fragment key={`${value}-${index}`}>
                  <span className="info_label">{label}</span>
                  <span className="info_content">{branchData[value]}</span>
                </Fragment>
              ))}
          </div>
        </div>

        <div className="btn_container">
          <Button
            label="Call"
            variant="filled__secondary-blue"
            className="w-full"
            onClick={() => {
              //
            }}
          />
          <Button
            label="Book Appointment"
            variant="filled__primary"
            className="w-full"
            onClick={() => onBookAppointment()}
          />
        </div>
      </div>
    </BottomSheet>
  );
};

ViewMapBottom.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  branchData: PropTypes.object,
  onBookAppointment: PropTypes.func,
};

ViewMapBottom.defaultProps = {
  open: false,
  onClose: () => {},
  title: 'Select Time',
  onBookAppointment: () => {},
};

export default ViewMapBottom;
