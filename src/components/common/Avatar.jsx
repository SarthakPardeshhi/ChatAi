import { getInitials } from '../../utils/helpers';
import './Avatar.css';

const Avatar = ({ name, avatar, size = 'medium', isOnline = false }) => {
  return (
    <div className={`avatar avatar-${size}`}>
      {avatar ? (
        <img src={avatar} alt={name} className="avatar-image" />
      ) : (
        <div className="avatar-placeholder">{getInitials(name)}</div>
      )}
      {isOnline && <span className="avatar-online-indicator"></span>}
    </div>
  );
};

export default Avatar;
