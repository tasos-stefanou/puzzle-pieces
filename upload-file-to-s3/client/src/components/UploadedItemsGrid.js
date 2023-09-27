import { useEffect, useState } from 'react';
import { TextField, Button, Pagination, Typography } from '@mui/material';
import FilterByFileType from './FilterByFileType';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { LoadingButton } from '@mui/lab';

const UploadedItemsGrid = ({ links, bucket, folder, onDeleteSuccess }) => {
  const [searchText, setSearchText] = useState('');
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingIndex, setLoadingIndex] = useState(-1);

  const itemsPerPage = 5;

  const deleteFile = async (fileName, indexToBeDeleted) => {
    setLoadingIndex(indexToBeDeleted);
    try {
      const { data } = await axios.delete(`http://localhost:4002/delete?bucket=${bucket}&folder=${folder}&fileName=${fileName}`);
      onDeleteSuccess();
      toast.success('File deleted successfully');
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.error_message);
    }
    setLoadingIndex(-1);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchText]);

  const filterByFileTypeOptions = [...new Set(links.map((link) => link.split('/').pop().split('?')[0].split('.').pop()))].sort((a, b) =>
    a.localeCompare(b)
  );

  const filterByName = (name) => name.toLowerCase().includes(searchText.toLowerCase());
  const filterByFileType = (name) => name.split('/').pop().split('?')[0].split('.').pop().includes(filter) || filter === 'all';
  const namedLinks = links;
  const filteredLinks = namedLinks.filter((namedLink) => filterByName(namedLink) && filterByFileType(namedLink));
  const totalPages = Math.ceil(filteredLinks.length / itemsPerPage);
  const paginatedAndFilteredLinks = filteredLinks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div>
      <div className='row justify-space-between'>
        <Typography variant='h6'>Already uploaded ({links.length})</Typography>
        <TextField
          id='search'
          search='search'
          label='Search by name'
          type='text'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size='small'
          InputProps={{
            endAdornment: searchText && (
              <IconButton onClick={() => setSearchText('')} edge='end' aria-label='clear search text'>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
      </div>
      <FilterByFileType filter={filter} setFilter={setFilter} filterOptions={filterByFileTypeOptions} />
      {paginatedAndFilteredLinks.length > 0 ? (
        <div className='col' style={{ minHeight: '300px' }}>
          {paginatedAndFilteredLinks.map((link, index) => (
            <div key={link} className='row' style={{ padding: '1em' }}>
              <span>{(currentPage - 1) * itemsPerPage + index + 1}. </span>
              <div className='cutOffText1'>
                <a href={link} target='_blank'>
                  {link.split('/').pop().split('?')[0]}
                </a>
              </div>
              <LoadingButton
                style={{ marginLeft: 'auto' }}
                onClick={() => deleteFile(link.split('/').pop().split('?')[0], index)}
                variant='text'
                color='error'
                size='small'
                loading={loadingIndex === index}
              >
                Delete
              </LoadingButton>
            </div>
          ))}
        </div>
      ) : (
        <div className='col' style={{ minHeight: '300px' }}>
          No results found
        </div>
      )}
      {paginatedAndFilteredLinks.length > 0 && (
        <div className='row' style={{ justifyContent: 'center', padding: '1em' }}>
          <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} color='primary' />
        </div>
      )}
    </div>
  );
};

export default UploadedItemsGrid;
