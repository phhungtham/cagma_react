import { Fragment } from 'react';

import { Button } from '@common/components/atoms/ButtonGroup/Button/Button';
import LocationMap from '@common/components/atoms/LocationMap';
import BottomSheet from '@common/components/templates/BottomSheet';
import { bookAppointmentLabels as labels } from '@common/constants/labels';
import { callPhone } from '@utilities/index';
import withHTMLParseI18n from 'hocs/withHTMLParseI18n';
import { PropTypes } from 'prop-types';

import './styles.scss';

const viewMapBranchFields = [
  {
    label: 'Phone',
    value: 'br_telno',
  },
  {
    label: 'Fax',
    value: 'br_fax_no',
  },
  {
    label: 'Address',
    value: 'br_adr',
  },
];

const ViewMapBottom = ({ open, onClose, branchData, onBookAppointment, translate: t }) => {
  const encodeToURL = str => {
    if (!str) {
      return '';
    }
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
  };

  const onClickCallPhone = () => {
    callPhone(branchData?.br_telno);
  };

  const formattedAddress = encodeToURL(branchData?.br_adr || '');

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t(labels.viewMapTitle)}
      clazz="bottom__dropdown__wrapper"
      type="fit-content"
    >
      <div className="view_map">
        <div className="map">{!!formattedAddress && <LocationMap address={formattedAddress} />}</div>
        <div className="content">
          <div className="title">{branchData?.lcl_br_nm || ''}</div>
          <div className="detail_info">
            {!!branchData &&
              viewMapBranchFields.map(({ label, value }, index) => (
                <Fragment key={`${value}-${index}`}>
                  <span className="info_label">{label}</span>
                  <span className="info_content">{branchData[value]}</span>
                </Fragment>
              ))}
          </div>
        </div>

        <div className="btn_container">
          <Button
            label={t(labels.call)}
            variant="filled__secondary-blue"
            className="w-full"
            onClick={onClickCallPhone}
          />
          <Button
            label={t(labels.bookAppointmentTitle)}
            variant="filled__primary"
            className="w-full"
            onClick={() => onBookAppointment(branchData)}
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

export default withHTMLParseI18n(ViewMapBottom);
