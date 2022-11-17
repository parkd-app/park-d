import React from 'react'
import Select from 'react-select'

const options = [
  { value: 'parking lot 1', label: 'Parking Lot 1' },
  { value: 'parking lot 2', label: 'Parking Lot 2' },
  { value: 'parking lot 3', label: 'Parking Lot 3' },
]

const ParkingLotDropdown = () => {

  return(
    <Select 
      options={options}
      theme={(theme) => ({
        ...theme,
        borderRadius: 5,
        colors: {
          ...theme.colors,
          primary25: 'yellow',
          primary: 'black',
        }})}
    />
  );
}

export default ParkingLotDropdown;