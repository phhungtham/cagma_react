import { Controller, useFormContext } from 'react-hook-form';

import Dropdown from '@common/components/atoms/Dropdown';

const ManagementBranch = ({ openOpenBranchBottom }) => {
  const { control, watch, setValue } = useFormContext();

  return (
    <div className="form__section">
      <div className="form__section__title">Management Branch</div>
      <Controller
        render={({ field }) => (
          <Dropdown
            label="Branch"
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
