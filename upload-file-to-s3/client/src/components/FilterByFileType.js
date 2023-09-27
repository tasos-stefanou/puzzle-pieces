import React from 'react';
import { FormControl, FormLabel, MenuItem, Select, Typography } from '@mui/material';

const FilterByFileType = ({ filter, setFilter, filterOptions }) => {
  return (
    <FormControl>
      <FormLabel
        style={{
          maxWidth: '300px',
          overflowWrap: 'break-word',
          textAlign: 'start',
        }}
      >
        <Typography>Filter by file type</Typography>
      </FormLabel>
      <Select labelId='demo-simple-select-label' id='demo-simple-select' value={filter} onChange={(e) => setFilter(e.target.value)} size='small'>
        <MenuItem value={'all'}>{'All'}</MenuItem>
        {filterOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterByFileType;
