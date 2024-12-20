/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import Dropdown from '@common/components/atoms/Dropdown';
import { signUpEnterPersonalLabels as labels } from '@common/constants/labels';
import { SignUpContext } from '@pages/SignUp';

const ManagementBranch = ({ openOpenBranchBottom }) => {
  const { translate: t } = useContext(SignUpContext);
  const { control, watch, setValue } = useFormContext();

  return (
    <div className="form__section flex-gap-y-12">
      <div className="form__section__title">{t(labels.managementBranch)}</div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label={t(labels.branch)}
            onFocus={openOpenBranchBottom}
            {...field}
          />
        )}
        control={control}
        name="branchDisplay"
      />
    </div>
  );
};

export default ManagementBranch;
