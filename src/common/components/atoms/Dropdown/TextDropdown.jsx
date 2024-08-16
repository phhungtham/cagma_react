import { ArrowDown } from '@assets/icons';

const TextDropdown = ({label, value, placeholder, onClick, children}) => {
  return (
    <div className='text-dropdown__wrapper'>
      <div className='text-dropdown__main' onClick={onClick}>
        <div className='text-dropdown__label'>{label}</div>
        <div className={`text-dropdown__value ${!!value ? 'selected' : ''}`}>{value || placeholder}</div>
        <div className='text-dropdown__select-icon'>
          <ArrowDown />
        </div>
      </div>
      {children && <section className='text-dropdown__sub-content'>{children}</section>}
    </div>
  );
};

export default TextDropdown;