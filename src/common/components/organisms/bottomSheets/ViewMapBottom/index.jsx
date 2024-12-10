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
    label: labels.phone,
    value: 'br_telno',
  },
  {
    label: labels.fax,
    value: 'br_fax_no',
  },
  {
    label: labels.address2,
    value: 'br_adr',
  },
];

const ViewMapBottom = ({ open, onClose, branchData, onBookAppointment, translate: t }) => {
  const onClickCallPhone = () => {
    callPhone(branchData?.br_telno);
  };

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={t(labels.viewMapTitle)}
      clazz="bottom__dropdown__wrapper"
      type="fit-content"
    >
      <div className="view_map">
        <div className="map">{!!branchData?.br_adr && <LocationMap address={branchData?.br_adr} />}</div>
        <div className="content">
          <div className="title">{branchData?.lcl_br_nm || ''}</div>
          <div className="detail_info">
            {!!branchData &&
              viewMapBranchFields.map(({ label, value }, index) => (
                <Fragment key={`${value}-${index}`}>
                  <span className="info_label">{t(label)}</span>
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
