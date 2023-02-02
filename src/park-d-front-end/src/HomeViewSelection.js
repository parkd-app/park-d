function HomeViewSelection() {
    return (
        <div>
          <div className="spot_selection">
            <span className="spot_selection_prompt">Pick Your Spot</span>
            <span className="spot_selection_stats">70 Spots Available</span>
            <div className="parking_layout" />
            <div className="select_parking_bg1">
              <div className="select_parking_bg2">
                <div className="select_parking_text_bg" />
                <span className="select_parking_text">Select Parking Space</span>
              </div>
            </div>
            <div className="parking_cars">
            </div>
            <div className="spot_availability_bg">
              <div className="spot_availability_text_bg" />
              <span className="spot_availability_text">70  Spots Available</span>
            </div>
          </div>
          <div className="chevron_bg1">
            <div className="chevron_bg2">
              <div className="chevron" />
            </div>
          </div>
        </div>
      );
    };

export default HomeViewSelection;