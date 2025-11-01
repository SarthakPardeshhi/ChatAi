import './NavigationPanel.css';

const NavigationPanel = () => {
  return (
    <div className="navigation-panel">
      <button className="nav-icon-button" title="Messages">
        <span className="nav-icon">💬</span>
      </button>

      <button className="nav-icon-button" title="Profile">
        <span className="nav-icon">👤</span>
      </button>

      <button className="nav-icon-button" title="Settings">
        <span className="nav-icon">⚙️</span>
      </button>
    </div>
  );
};

export default NavigationPanel;
