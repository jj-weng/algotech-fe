import React from 'react';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import ProductCellAction from 'src/components/inventory/ProductCellAction';
import '../../styles/pages/inventory/inventory.scss';
import '../../styles/common/common.scss';
import { Button, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';
import { Product, StockQuantity } from '../../models/types';
import asyncFetchCallback from 'src/services/util/asyncFetchCallback';
import { getAllProducts } from 'src/services/productService';
import { useNavigate } from 'react-router';

const columns: GridColDef[] = [
  { field: 'sku', headerName: 'SKU', flex: 1 },
  { field: 'category', headerName: 'Category', flex: 1 },
  { field: 'name', headerName: 'Product Name', flex: 1 },
  {
    field: 'stockQuantity',
    headerName: 'Total Quantity',
    type: 'number',
    flex: 1,
    valueGetter: (params: GridValueGetterParams) =>
      params.value?.reduce(
        (prev: number, curr: StockQuantity) => prev + curr.quantity,
        0
      ) ?? 0
  },
  {
    field: 'action',
    headerName: 'Action',
    headerAlign: 'right',
    flex: 1,
    renderCell: ProductCellAction
  }
];

const AllProducts = () => {
  const navigate = useNavigate();

  const [searchField, setSearchField] = React.useState<string>('');
  const [productData, setProductData] = React.useState<Product[]>([]);
  const [filteredData, setFilteredData] = React.useState<Product[]>([]);

  React.useEffect(() => {
    // TODO: implement error callback
    asyncFetchCallback(getAllProducts(), setProductData);
  }, []);

  React.useEffect(() => {
    setFilteredData(
      searchField
        ? productData.filter((product) =>
            Object.values(product).some((value) =>
              String(value).toLowerCase().match(searchField.toLowerCase())
            )
          )
        : productData
    );
  }, [searchField, productData]);

  console.log(filteredData);

  const handleSearchFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchField(e.target.value);
  };
  return (
    <div className='product-inventory'>
      <h1>Product Inventory</h1>
      <div className='grid-toolbar'>
        <div className='search-bar'>
          <Search />
          <TextField
            id='search'
            label='Search'
            margin='normal'
            fullWidth
            onChange={handleSearchFieldChange}
          />
        </div>
        <Button
          variant='contained'
          size='large'
          sx={{ height: 'fit-content' }}
          onClick={() => navigate({ pathname: '/inventory/createProduct' })}
        >
          Create Product
        </Button>
      </div>
      <DataGrid columns={columns} rows={filteredData} autoHeight />
    </div>
  );
};

export default AllProducts;