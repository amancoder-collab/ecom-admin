import { ProductCreateEditTemplate } from '@/modules/product/templates/create-edit';

interface ProductEditPageProps {
  params: {
    id: string;
  };
}

const ProductEditPage: React.FC<ProductEditPageProps> = ({ params }) => {
  return <ProductCreateEditTemplate id={params.id} />;
};

export default ProductEditPage;
