'use client';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useProducts } from '@/modules/product/queries/use-products';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const ProductsPage = () => {
  const { products, isLoading } = useProducts();

  return (
    <PageContainer title="Products" description="List of all products">
      <DashboardCard title="Products">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="products table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell align="right">Price</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products?.map((product, index) => (
                <TableRow
                  key={product?.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>{product?.name}</TableCell>
                  <TableCell>{product?.description}</TableCell>
                  <TableCell align="right">
                    ${product?.discountedPrice?.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardCard>
    </PageContainer>
  );
};

export default ProductsPage;
