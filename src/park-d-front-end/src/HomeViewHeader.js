function HomeViewHeader() {
      return (
        <div className="header">
          <div className="logo_bg1">
            <div className="logo_bg2">
              <span className="logo_text" />
              <div className="logo" />
            </div>
            <div className="old_logo" />
          </div>
          <div className="logout_bg1" onclick="logout()">
            <div className="logout_bg2">
              <div className="logout_border" />
              <span className="logout_text">Logout</span>
            </div>
          </div>
          <div className="cogwheel_bg1">
            <div className="cogwheel_bg2">
              <div className="cogwheel" />
            </div>
            <div className="cogwheel_fg" />
          </div>
        </div>
      );
    };

export default HomeViewHeader;